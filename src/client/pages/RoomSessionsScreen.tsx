import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Eye, Plus, RefreshCw, Settings2 } from 'lucide-react';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { AccessibleDialog } from '../components/AccessibleDialog';
import { useAuthStore } from '../store/useAuthStore';
import { getSocket, useGameStore } from '../store/useGameStore';
import { api } from '../lib/api';
import type { GameRoomState, GameSessionMetadata } from '../../shared/types';
import type { RoomMetadata } from '../hooks/useRoomAccess';
import { sessionPhaseLabel } from '../lib/sessionNavigation';

export function RoomSessionsScreen({ roomCode }: { roomCode: string }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { ended?: boolean };
  const { user, refresh } = useAuthStore();
  const [room, setRoom] = useState<RoomMetadata | null>(null);
  const [sessions, setSessions] = useState<GameSessionMetadata[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [ending, setEnding] = useState<GameSessionMetadata | null>(null);
  const [endError, setEndError] = useState('');
  const request = useRef<{ id: string; name: string } | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [directory, gameSessions] = await Promise.all([api<{ rooms: RoomMetadata[] }>('/api/rooms'), api<{ sessions: GameSessionMetadata[] }>(`/api/sessions?room=${encodeURIComponent(roomCode)}`)]);
        if (active) { setRoom(directory.rooms.find((entry) => entry.roomCode === roomCode) ?? null); setSessions(gameSessions.sessions); setError(''); }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar as sessões.'); }
      finally { if (active) setLoading(false); }
    };
    setLoading(true); setSessions([]); setRoom(null); request.current = null;
    void refresh().catch(() => {}); void load();
    useGameStore.getState().joinSessionRoom(roomCode, '');
    const update = () => { void load(); };
    const socket = getSocket(); socket.on('rooms:updated', update);
    const timer = setInterval(update, 5000);
    return () => { active = false; socket.off('rooms:updated', update); clearInterval(timer); };
  }, [roomCode, refresh]);
  return <div className="org-surface min-h-screen bg-[#FAF7FF] text-[#330043]">
    <BandeirolasHeader mode="home" rightSlot={<Link to="/admin" className="org-button">{user ? 'Minha conta' : 'Organização'}</Link>} />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link to="/" className="org-button">Voltar às salas</Link>
      <section className="space-y-3"><h1 className="font-display text-3xl">{room?.roomName || roomCode}</h1><p className="org-description">Escolha uma sessão para assistir. Cada TV tem seu próprio lobby; os perfis e o ranking são compartilhados nesta sala.</p><p className="org-notice">Assistir não ocupa uma vaga. Para jogar, escaneie o QR da sessão desejada.</p></section>
      {search.ended && <p role="status" className="org-notice">A sessão foi encerrada. Resultados já gravados foram preservados. Escolha outra sessão para continuar assistindo.</p>}
      {error && <p role="alert" className="org-notice org-notice-error">{error} <button className="org-button" onClick={() => window.location.reload()}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></p>}
      {loading ? <p role="status">Carregando sessões…</p> : <section aria-label="Sessões disponíveis" className="space-y-3">
        <h2 className="font-display text-xl">Sessões desta sala · {sessions.length}/2</h2>
        {sessions.length === 0 ? <p className="org-notice">Nenhuma sessão ativa. Uma conta da organização pode criar a primeira sessão.</p> : <ul className="divide-y divide-[var(--mermas-lilac-border)]">{sessions.map((session) => <li key={session.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div className="min-w-0 break-words"><h3 className="font-display text-xl">{session.name}</h3><p className="font-semibold text-sm mt-1">{sessionPhaseLabel[session.phase]}</p><p className="org-description">{session.playersCount}/5 participantes · {session.isOpen ? 'Entradas abertas' : 'Entradas pausadas'}</p></div><div className="flex flex-wrap items-center gap-2"><Link to="/tv" search={{ room: roomCode, session: session.id, mode: 'watch' }} className="org-button org-button-primary"><Eye size={18} aria-hidden="true" />Assistir {session.name}</Link>{user && !user.mustChangePassword && <><Link to="/tv" search={{ room: roomCode, session: session.id, mode: 'control' }} className="org-button"><Settings2 size={18} aria-hidden="true" />Controlar {session.name}</Link><button className="org-button org-button-quiet !text-rose-800" disabled={busy} onClick={() => { setEndError(''); setEnding(session); }}>Encerrar {session.name}…</button></>}</div></li>)}</ul>}
      </section>}
      {room && user && !user.mustChangePassword ? <section className="space-y-4 border-t border-[var(--mermas-lilac-border)] pt-6"><h2 className="font-display text-xl">Criar sessão de jogo</h2><p className="org-description">Até duas sessões ativas por sala. Esta ação cria outro lobby, sem interromper os que já existem.</p><form className="flex flex-wrap items-end gap-3" onSubmit={async (event) => {
        event.preventDefault(); if (busy) return; setBusy(true); setError('');
        const label = name.trim();
        if (request.current?.name !== label) request.current = { id: crypto.randomUUID(), name: label };
        try {
          const result = await api<{ state: GameRoomState }>('/api/sessions', { roomCode, id: request.current!.id, name: label });
          await navigate({ to: '/tv', search: { room: roomCode, session: result.state.sessionId, mode: 'control' } });
        } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível criar a sessão.'); }
        finally { setBusy(false); }
      }}><label className="org-label flex-1 min-w-0">Nome da sessão<input className="mermas-input org-field" required minLength={2} maxLength={80} placeholder="Ex.: TV do palco" value={name} onChange={(event) => setName(event.target.value)} disabled={busy || sessions.length >= 2} /></label><button className="org-button org-button-primary" disabled={busy || sessions.length >= 2}><Plus size={18} aria-hidden="true" />{busy ? 'Criando sessão…' : 'Criar sessão'}</button></form>{sessions.length >= 2 && <p className="org-description">As duas sessões estão em uso. Encerre uma delas antes de criar outra.</p>}</section> : <p className="org-description">Para criar ou controlar sessões, <Link to="/admin" className="underline">entre com uma conta da organização</Link>{user?.mustChangePassword ? ' e conclua a troca inicial de senha' : ''}.</p>}
    </main>
    <AccessibleDialog open={!!ending} title={`Encerrar ${ending?.name || 'sessão'}?`} onClose={() => { if (!busy) setEnding(null); }}>
      <p className="org-description">Esta sessão será encerrada e suas participantes removidas. Perfis, pontos, partidas já gravadas e outras sessões serão preservados. Uma rodada em andamento não poderá ser retomada.</p>
      {endError && <p role="alert" className="org-notice org-notice-error">{endError}</p>}
      <div className="flex flex-wrap gap-3 mt-4"><button className="org-button" disabled={busy} onClick={() => setEnding(null)}>Voltar</button><button className="org-button org-button-danger" disabled={busy} onClick={async () => {
        if (!ending || busy) return;
        setBusy(true); setEndError('');
        try {
          await api(`/api/sessions/${ending.id}?room=${encodeURIComponent(roomCode)}&confirm=true`, undefined, 'DELETE');
          setSessions((current) => current.filter((session) => session.id !== ending.id)); setEnding(null);
        } catch (err) { setEndError(err instanceof Error ? err.message : 'Não foi possível encerrar. Atualize a lista antes de tentar novamente.'); }
        finally { setBusy(false); }
      }}>{busy ? 'Encerrando…' : 'Encerrar sessão'}</button></div>
    </AccessibleDialog>
  </div>;
}
