import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { StaffUser } from '../../../shared/types';
import { useGameStore } from '../../store/useGameStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useRoomAccess } from '../../hooks/useRoomAccess';
import { api } from '../../lib/api';
import { AccessibleDialog } from '../AccessibleDialog';

export interface TVModerationModalProps { isOpen: boolean; onClose: () => void; currentRoomCode: string }
const button = 'min-h-11 px-4 py-2 rounded-xl border border-[#DDC7F8] bg-white hover:bg-[#FAF5FF] disabled:opacity-50 text-left';
type Operator = Pick<StaffUser, 'id' | 'name' | 'email' | 'role'>;

export const TVModerationModal: React.FC<TVModerationModalProps> = ({ isOpen, onClose, currentRoomCode }) => {
  const { user, room, canManage, refresh } = useRoomAccess(currentRoomCode);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ label: string; text: string; action: () => Promise<void> } | null>(null);
  useEffect(() => { setName(room?.roomName || currentRoomCode); }, [room?.roomName, currentRoomCode]);
  useEffect(() => {
    setTarget(''); setConfirmAction(null); setError(''); setNotice('');
    if (!isOpen || !user || user.mustChangePassword) return;
    let active = true;
    api<{ users: Operator[] }>('/api/users').then((data) => { if (active) setOperators(data.users); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [isOpen, user?.id, user?.mustChangePassword, currentRoomCode]);
  useEffect(() => { if (!canManage) setConfirmAction(null); }, [canManage]);
  const execute = async (action: () => Promise<void>) => {
    if (busy || !canManage) return;
    setBusy(true); setError(''); setNotice(''); setConfirmAction(null);
    try { await action(); await refresh(); await useAuthStore.getState().refresh(); setNotice(`Ação concluída na sala ${currentRoomCode}.`); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível concluir. Atualize antes de repetir.'); }
    finally { setBusy(false); }
  };
  const requireSuccess = async (action: Promise<{ ok: boolean; error?: string }>) => {
    const result = await action; if (!result.ok) throw new Error(result.error || 'Ação recusada. Atualize a sala.');
  };
  const selected = operators.find((operator) => operator.id === target);
  const owner = operators.find((operator) => operator.id === room?.moderatorId);
  return <AccessibleDialog open={isOpen} title={`Moderação · ${currentRoomCode}`} onClose={onClose}>
    <div className="space-y-5">
      <p className="text-sm break-words">Sala: <strong>{room?.roomName || currentRoomCode}</strong> · {room?.isOpen ? 'Entradas abertas' : 'Entradas fechadas'}<br />Responsável: {owner?.name || room?.moderatorId || 'Não informado'}</p>
      {error && <p role="alert" className="p-3 rounded-xl bg-red-50 text-red-800">{error}</p>}
      {notice && <p role="status" className="p-3 rounded-xl bg-emerald-50 text-emerald-900">{notice}</p>}
      {!canManage ? <div className="space-y-3"><p>{user?.mustChangePassword ? 'Conclua a troca inicial da senha para moderar.' : user ? 'Modo de visualização. Apenas o responsável da sala ou um administrador pode alterar esta sessão.' : 'Modo de visualização. Entre com sua conta da organização para moderar suas salas.'}</p><Link to="/admin" className={button}>Ir para minha conta</Link></div> : <>
        {confirmAction ? <section className="space-y-4 border border-amber-300 rounded-xl p-4">
          <h3 className="font-semibold">{confirmAction.label}</h3><p>{confirmAction.text}</p>
          <div className="flex flex-wrap gap-3"><button autoFocus className={button} onClick={() => setConfirmAction(null)}>Cancelar</button><button className={`${button} text-red-800`} disabled={busy} onClick={() => void execute(confirmAction.action)}>Confirmar — {currentRoomCode}</button></div>
        </section> : <>
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); setConfirmAction({ label: `Abrir entradas — ${currentRoomCode}`, text: `A sala ${currentRoomCode} receberá novas participantes e usará o nome “${name.trim()}”. A rodada atual será preservada.`, action: async () => { await api('/api/rooms/open', { roomCode: currentRoomCode, name: name.trim() }); } }); }}>
            <label className="block">Nome da sessão<input required maxLength={80} className="mermas-input w-full px-3 py-3 text-base" value={name} onChange={(event) => setName(event.target.value)} /></label>
            <button className={`${button} w-full`} disabled={busy}>{room?.isOpen ? 'Atualizar nome e manter entradas abertas' : 'Abrir entradas desta sala'}</button>
          </form>
          {room?.isOpen && <button className={`${button} w-full`} disabled={busy} onClick={() => setConfirmAction({ label: `Fechar entradas — ${currentRoomCode}`, text: `Novas participantes não entrarão em ${currentRoomCode}. A rodada atual e quem já participa continuam normalmente. Não cancela a rodada.`, action: async () => { await api('/api/rooms/close', { roomCode: currentRoomCode }); } })}>Fechar entradas · preservar rodada</button>}
          <section className="border-t border-[#DDC7F8] pt-4 space-y-3">
            <h3 className="font-semibold">Responsabilidade da sala</h3>
            <label className="block">Novo responsável<select className="mermas-input w-full px-3 py-3 text-base" value={target} onChange={(event) => setTarget(event.target.value)}><option value="">Selecione um operador</option>{operators.filter((operator) => operator.id !== room?.moderatorId).map((operator) => <option key={operator.id} value={operator.id}>{operator.name} ({operator.email})</option>)}</select></label>
            <button className={`${button} w-full`} disabled={busy || !selected} onClick={() => { if (selected) setConfirmAction({ label: `Transferir ${currentRoomCode} para ${selected.name}`, text: `${selected.name} (${selected.email}) assumirá a sala ${currentRoomCode}. O responsável anterior perderá os controles imediatamente, exceto se for administrador global.`, action: async () => { await api('/api/rooms/transfer', { roomCode: currentRoomCode, moderatorId: selected.id }); await refresh(); await useAuthStore.getState().refresh(); } }); }}>Transferir responsabilidade…</button>
          </section>
          <section className="border-t border-[#DDC7F8] pt-4 space-y-3">
            <h3 className="font-semibold">Ações sobre a rodada e o ranking</h3>
            <button className={`${button} w-full`} disabled={busy} onClick={() => setConfirmAction({ label: `Cancelar rodada — ${currentRoomCode}`, text: `A rodada atual de ${currentRoomCode} será cancelada. Palpites e avaliações pendentes desta rodada serão descartados, e um novo QR será gerado.`, action: () => requireSuccess(useGameStore.getState().resetRoom(currentRoomCode)) })}>Cancelar rodada e gerar novo QR…</button>
            <button className={`${button} w-full text-red-800`} disabled={busy} onClick={() => setConfirmAction({ label: `Zerar ranking — ${currentRoomCode}`, text: `Os placares de ${currentRoomCode} serão zerados de forma irreversível, e a rodada atual será cancelada. Outras salas não serão alteradas.`, action: () => requireSuccess(useGameStore.getState().clearRanking(currentRoomCode)) })}>Zerar ranking desta sala…</button>
          </section>
        </>}
      </>}
    </div>
  </AccessibleDialog>;
};
