import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, DoorClosed, DoorOpen, Settings2, ShieldCheck, UserMinus, Users } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useRoomAccess } from '../../hooks/useRoomAccess';
import { api } from '../../lib/api';
import { AccessibleDialog } from '../AccessibleDialog';
import { AvatarBadge } from '../AvatarBadge';

export interface TVModerationModalProps { isOpen: boolean; onClose: () => void; currentRoomCode: string }
type Confirmation = { label: string; text: string; button: string; destructive?: boolean; action: () => Promise<void> };
const button = 'org-button';
const field = 'mermas-input org-field';

export const TVModerationModal: React.FC<TVModerationModalProps> = ({ isOpen, onClose, currentRoomCode }) => {
  const { user, room, canManage, refresh } = useRoomAccess(currentRoomCode);
  const state = useGameStore((store) => store.roomState);
  const players = state.roomCode === currentRoomCode ? state.players : [];
  const [name, setName] = useState('');
  const [view, setView] = useState<'room' | 'players'>('room');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmAction, setConfirmAction] = useState<Confirmation | null>(null);
  useEffect(() => { setName(room?.roomName || currentRoomCode); }, [room?.roomName, currentRoomCode]);
  useEffect(() => {
    setConfirmAction(null); setError(''); setNotice(''); setView('room');
  }, [isOpen, user?.id, user?.mustChangePassword, currentRoomCode]);
  useEffect(() => { if (!canManage) setConfirmAction(null); }, [canManage]);
  const execute = async (action: () => Promise<void>) => {
    if (busy || !canManage) return;
    setBusy(true); setError(''); setNotice(''); setConfirmAction(null);
    try { await action(); await refresh(); await useAuthStore.getState().refresh(); setNotice('Alteração salva nesta sala.'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível concluir. Atualize antes de repetir.'); }
    finally { setBusy(false); }
  };
  const requireSuccess = async (action: Promise<{ ok: boolean; error?: string }>) => {
    const result = await action; if (!result.ok) throw new Error(result.error || 'Ação recusada. Atualize a sala.');
  };
  return <AccessibleDialog open={isOpen} title={`Moderação · ${currentRoomCode}`} onClose={onClose}>
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><p className="font-semibold break-words">{room?.roomName || currentRoomCode}</p><p className="org-description">Qualquer conta da organização pode moderar esta sala.</p></div>
        {room && <span className="org-badge">{room.isOpen ? <DoorOpen size={14} aria-hidden="true" /> : <DoorClosed size={14} aria-hidden="true" />}{room.isOpen ? 'Entradas abertas' : 'Entradas fechadas'}</span>}
      </div>
      {error && <p role="alert" className="org-notice org-notice-error">{error}</p>}
      {notice && <p role="status" className="org-notice org-notice-success">{notice}</p>}
      {busy && <p role="status" className="org-notice">Salvando alteração…</p>}
      {!canManage ? <div className="space-y-4">
        <div className="org-notice"><ShieldCheck className="w-5 h-5 mb-2" aria-hidden="true" /><p className="font-semibold mb-1">{user?.mustChangePassword ? 'Conclua seu primeiro acesso' : 'Você está em modo de visualização'}</p><p>{user?.mustChangePassword ? 'Troque a senha temporária na sua conta para começar a moderar.' : user ? 'Aguarde o carregamento da sala para acessar os controles.' : 'Entre com sua conta da organização para moderar qualquer sala.'}</p></div>
        <Link to="/admin" className={`${button} org-button-primary`}>{user ? 'Ir para minha conta' : 'Entrar na minha conta'}<ArrowRight size={16} aria-hidden="true" /></Link>
      </div> : confirmAction ? <section className="space-y-5" aria-label="Revisar alteração">
        <div><h3 className="font-semibold text-lg mb-2">{confirmAction.label}</h3><p className="org-description">{confirmAction.text}</p></div>
        <div className="flex flex-wrap justify-end gap-2"><button autoFocus className={button} onClick={() => setConfirmAction(null)}>Voltar</button><button className={`${button} ${confirmAction.destructive ? 'org-button-danger' : 'org-button-primary'}`} disabled={busy} onClick={() => void execute(confirmAction.action)}>{confirmAction.button}</button></div>
      </section> : <>
        <nav className="org-nav" aria-label="Controles da sala">
          <button className={button} disabled={busy} aria-pressed={view === 'room'} onClick={() => setView('room')}><Settings2 size={16} aria-hidden="true" />Sala</button>
          <button className={button} disabled={busy} aria-pressed={view === 'players'} onClick={() => setView('players')}><Users size={16} aria-hidden="true" />Participantes ({players.filter((player) => !player.isBot).length})</button>
        </nav>
        {view === 'players' ? <section className="space-y-3">
          <h3 className="sr-only">Participantes da rodada</h3><p className="org-description">Remover alguém impede seu retorno nesta rodada. Bots são identificados separadamente.</p>
          {players.length === 0 ? <p className="org-notice">Nenhuma participante nesta rodada. Abra as entradas e peça para escanear o QR do telão.</p> : <ul className="divide-y divide-[var(--mermas-lilac-border)]">{players.map((player) => <li key={player.id} className="flex items-center gap-3 py-3">
            <AvatarBadge avatar={player.avatar} size="sm" /><div className="min-w-0 flex-1"><p className="font-semibold break-words">{player.nickname}</p><p className="org-description">{player.isBot ? 'Bot da arena' : player.isConnected ? 'Conectada' : 'Desconectada'} · Posição {player.slot}</p></div>
            {!player.isBot && <button className={`${button} org-button-quiet !text-rose-800 shrink-0`} disabled={busy} aria-label={`Remover ${player.nickname}`} onClick={() => setConfirmAction({ label: `Remover ${player.nickname}?`, button: 'Remover da rodada', destructive: true, text: `${player.nickname} será removida da sala ${currentRoomCode} e não poderá voltar nesta rodada. As outras participantes continuam.`, action: () => requireSuccess(useGameStore.getState().kickPlayer({ roomCode: currentRoomCode, playerId: player.id })) })}><UserMinus size={18} aria-hidden="true" /></button>}
          </li>)}</ul>}
        </section> : <section className="space-y-5">
          <div className="space-y-3"><h3 className="font-semibold">Quem pode entrar?</h3><p className="org-description">{room?.isOpen ? 'Novas participantes podem entrar pelo QR Code. Fechar as entradas mantém a rodada atual e quem já participa.' : 'Novas entradas estão pausadas. Quem já participa pode terminar a rodada e se reconectar.'}</p>
            <button className={`${button} org-button-primary w-full`} disabled={busy || !room} onClick={() => setConfirmAction(room?.isOpen ? { label: 'Fechar entradas?', button: 'Fechar entradas', text: `Ninguém novo entrará na sala ${currentRoomCode}. A rodada atual e as participantes que já entraram continuam normalmente.`, action: async () => { await api('/api/rooms/close', { roomCode: currentRoomCode }); } } : { label: 'Reabrir entradas?', button: 'Reabrir entradas', text: `A sala ${currentRoomCode} voltará a receber participantes pelo QR Code. A rodada atual será preservada.`, action: async () => { await api('/api/rooms/open', { roomCode: currentRoomCode }); } })}>{room?.isOpen ? <DoorClosed size={18} aria-hidden="true" /> : <DoorOpen size={18} aria-hidden="true" />}{room?.isOpen ? 'Fechar entradas · manter rodada' : 'Reabrir entradas'}</button>
          </div>
          <details className="org-disclosure"><summary>Nome da sala</summary><div className="space-y-6">
            <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); setConfirmAction({ label: 'Atualizar nome da sala?', button: 'Salvar nome', text: `A sala ${currentRoomCode} passará a se chamar “${name.trim()}”. O código da sala e a rodada atual serão mantidos. ${!room?.isOpen ? 'Salvar o nome também reabrirá as entradas.' : ''}`, action: async () => { await api('/api/rooms/open', { roomCode: currentRoomCode, name: name.trim() }); } }); }}>
              <label className="org-label">Nome da sala<input required minLength={2} maxLength={80} className={field} disabled={busy} value={name} onChange={(event) => setName(event.target.value)} /></label><button className={button} disabled={busy || name.trim() === room?.roomName}>{room?.isOpen ? 'Salvar nome…' : 'Salvar nome e reabrir…'}</button>
            </form>
          </div></details>
          <details className="org-disclosure"><summary>Cancelar rodada ou zerar ranking</summary><div className="space-y-4">
            <p className="org-description">Essas ações interrompem a rodada. Para apenas impedir novas entradas, use o botão acima.</p>
            <button className={`${button} w-full`} disabled={busy} onClick={() => setConfirmAction({ label: 'Cancelar a rodada atual?', button: 'Cancelar rodada', destructive: true, text: `A rodada de ${currentRoomCode} será cancelada. Palpites e avaliações pendentes serão descartados, e um novo QR será gerado. Resultados já gravados não serão apagados.`, action: () => requireSuccess(useGameStore.getState().resetRoom(currentRoomCode)) })}>Cancelar rodada e gerar novo QR…</button>
            <button className={`${button} org-button-danger w-full`} disabled={busy} onClick={() => setConfirmAction({ label: 'Zerar ranking desta sala?', button: 'Zerar ranking', destructive: true, text: `As pontuações e o histórico de partidas de ${currentRoomCode} serão apagados, e a rodada atual será cancelada. Os perfis serão mantidos. Outras salas não serão alteradas. Esta ação não pode ser desfeita.`, action: () => requireSuccess(useGameStore.getState().clearRanking(currentRoomCode)) })}>Zerar ranking desta sala…</button>
          </div></details>
        </section>}
      </>}
    </div>
  </AccessibleDialog>;
};
