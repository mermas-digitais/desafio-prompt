import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Plus, RefreshCw, Shield, Tv } from 'lucide-react';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { EventFloatingAssets } from '../components/EventFloatingAssets';
import { AvatarBadge } from '../components/AvatarBadge';
import { AccessibleDialog } from '../components/AccessibleDialog';
import { useAuthStore } from '../store/useAuthStore';
import { getSocket } from '../store/useGameStore';
import { api } from '../lib/api';
import type { AvatarId } from '../../shared/types';
import type { RoomMetadata } from '../hooks/useRoomAccess';

interface GlobalStats {
  totalPlayers: number; totalMatches: number; highestScoreEver: number; totalRooms: number;
  topPWR: { nickname: string; avatar: string; powerScore: number; tier: string; roomCode: string }[];
}
const button = 'min-h-11 px-4 py-2 rounded-xl border border-[#DDC7F8] bg-white hover:bg-[#FAF5FF] disabled:opacity-50 inline-flex items-center justify-center gap-2';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, refresh } = useAuthStore();
  const [rooms, setRooms] = useState<RoomMetadata[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [createError, setCreateError] = useState('');
  const load = useCallback(async () => {
    try {
      const [roomData, metrics] = await Promise.all([api<{ rooms: RoomMetadata[] }>('/api/rooms'), api<{ stats: GlobalStats }>('/api/metrics/global')]);
      setRooms(roomData.rooms); setStats(metrics.stats); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível carregar as salas. Tente atualizar.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh().catch(() => {}); void load();
    const socket = getSocket();
    const update = () => { void load(); };
    socket.on('rooms:updated', update);
    const timer = setInterval(update, 10000);
    return () => { socket.off('rooms:updated', update); clearInterval(timer); };
  }, [load, refresh]);
  const openCreate = () => {
    if (!user || user.mustChangePassword) { navigate({ to: '/admin' }); return; }
    setCreateError(''); setCreateOpen(true);
  };
  return <div className="min-h-screen bg-[#FAF7FF] text-[#330043] relative overflow-x-hidden [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-[#9747FF] [&_:focus-visible]:outline-offset-2">
    <EventFloatingAssets variant="mobile" showBunting intensity="calm" />
    <BandeirolasHeader mode="home" rightSlot={<Link to="/admin" className={button}><Shield className="w-4 h-4" />{user ? 'Minha conta' : 'Entrar — organização'}</Link>} />
    <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <section className="rounded-3xl bg-white border-2 border-[#DDC7F8] shadow-sm p-6 sm:p-10 flex flex-col items-center text-center gap-5">
        <div className="flex items-center gap-3"><img src="/marca/menina-mdx.svg" alt="" className="w-16 h-16" /><h1 className="font-display text-3xl sm:text-5xl">Desafio de Prompt com IA</h1></div>
        <p className="text-[#6E4F7D] max-w-xl">Adivinhe as imagens secretas geradas por Inteligência Artificial, digite seu prompt criativo e conquiste o topo do pódio nas arenas do evento!</p>
        <p className="font-semibold">Para jogar, escaneie o QR Code da rodada no telão da sua sala.</p>
        <Link to="/tv" search={{ room: 'MDX26' }} className={`${button} text-[#9747FF] font-display`}><Tv className="w-5 h-5" />Abrir Telão Principal (MDX26)</Link>
      </section>
      {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200">{error} <button className={button} onClick={() => void load()}>Tentar novamente</button></p>}
      <section aria-label="Métricas do evento" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Perfis nas salas', stats?.totalPlayers], ['Partidas jogadas', stats?.totalMatches],
          ['Recorde da arena', stats?.highestScoreEver], ['Arenas', stats?.totalRooms],
        ].map(([label, value]) => <div key={label} className="rounded-3xl bg-white border border-[#DDC7F8] p-5"><p className="text-sm text-[#6E4F7D]">{label}</p><p className="font-display text-2xl">{loading ? '…' : value ?? '—'}</p></div>)}
      </section>
      {Boolean(stats?.topPWR?.length) && <section className="rounded-3xl bg-white border border-[#DDC7F8] p-6 space-y-4">
        <h2 className="font-display text-xl">Mestras do Prompt · Top PWR Acumulado</h2>
        <ol className="grid md:grid-cols-3 gap-4">{stats?.topPWR.map((player, index) => <li key={`${player.roomCode}-${player.nickname}`} className="flex items-center gap-3 min-w-0"><span>{index + 1}º</span><AvatarBadge avatar={player.avatar as AvatarId} size="sm" /><div className="min-w-0"><p className="font-semibold break-words">{player.nickname}</p><p className="text-sm text-[#6E4F7D]">{player.powerScore} PWR · {player.roomCode}</p></div></li>)}</ol>
      </section>}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-2xl">Telões e Sessões do Evento</h2><p className="text-sm text-[#6E4F7D]">Qualquer pessoa pode assistir. Criar e moderar exige conta da organização.</p></div><div className="flex gap-2"><button className={button} onClick={() => void load()} aria-label="Atualizar salas"><RefreshCw className="w-4 h-4" /></button><button className={`${button} text-[#9747FF] font-display`} onClick={openCreate}><Plus className="w-4 h-4" />Criar sala de TV</button></div></div>
        {loading ? <p role="status">Carregando telões…</p> : rooms.length === 0 ? <p>Nenhuma sala encontrada. A organização pode criar a primeira sala.</p> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => <article key={room.roomCode} className="rounded-3xl bg-white border-2 border-[#DDC7F8] p-5 space-y-4">
            <div><h3 className="font-display text-xl break-words">{room.roomName}</h3><p className="text-sm text-[#6E4F7D]">{room.roomCode}</p></div>
            <p className="text-sm">{room.isOpen ? 'Entradas abertas' : 'Entradas fechadas'} · {room.playersCount}/5 jogadoras</p>
            <p className="text-sm text-[#6E4F7D]">{room.isOpen ? 'Acompanhe a rodada e escaneie o QR no telão.' : 'A rodada atual continua. Assistir não reabre as entradas.'}</p>
            <Link to="/tv" search={{ room: room.roomCode }} className={`${button} w-full text-[#9747FF]`}><Tv className="w-4 h-4" />{room.isOpen ? 'Abrir telão' : 'Assistir telão — entradas fechadas'}</Link>
          </article>)}
        </div>}
      </section>
    </main>
    <AccessibleDialog open={createOpen} title="Criar sala de TV" onClose={() => setCreateOpen(false)}>
      <p className="mb-4">Sua conta será responsável pela nova sala. Salas existentes não serão alteradas.</p>
      {createError && <p role="alert" className="mb-4 text-red-800">{createError}</p>}
      <form className="space-y-4" onSubmit={async (event) => {
        event.preventDefault(); if (busy) return; setBusy(true); setCreateError('');
        try {
          await api('/api/rooms/create', { roomCode, name: name.trim() });
          setCreateOpen(false); navigate({ to: '/tv', search: { room: roomCode } });
        } catch (err) { setCreateError(err instanceof Error ? err.message : 'Não foi possível criar a sala.'); }
        finally { setBusy(false); }
      }}>
        <label className="block">Código da sala<input className="mermas-input w-full px-3 py-3 text-base" required pattern="[A-Z0-9_-]{1,12}" maxLength={12} value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} aria-describedby="room-code-help" /></label>
        <p id="room-code-help" className="text-sm text-[#6E4F7D]">Até 12 letras, números, hífen ou sublinhado.</p>
        <label className="block">Nome da sessão ou local<input className="mermas-input w-full px-3 py-3 text-base" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
        <button className={`${button} w-full text-[#9747FF]`} disabled={busy}>{busy ? 'Criando…' : `Criar e abrir ${roomCode || 'nova sala'}`}</button>
      </form>
    </AccessibleDialog>
  </div>;
};
