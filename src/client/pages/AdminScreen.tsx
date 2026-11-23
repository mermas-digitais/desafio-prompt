import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, KeyRound, LogOut, Plus, RefreshCw, ShieldCheck, Trash2, Users } from 'lucide-react';
import type { StaffUser } from '../../shared/types';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import type { RoomMetadata } from '../hooks/useRoomAccess';
import { AccessibleDialog } from '../components/AccessibleDialog';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { getSocket, useGameStore } from '../store/useGameStore';
import { clearRoomMatchHistory } from '../lib/personalMatchHistory';

interface AdminPlayer { id: string; nickname: string; roomCode: string; highScore: number; totalScore: number; matchesPlayed: number }
type Section = 'team' | 'ranking' | 'account';
const field = 'mermas-input org-field';
const button = 'org-button';

export const AdminScreen: React.FC = () => {
  const { user, loaded, refresh, login, logout, changePassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rooms, setRooms] = useState<RoomMetadata[]>([]);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [section, setSection] = useState<Section>('team');
  const [scope, setScope] = useState('');
  const scopeRef = useRef(scope);
  scopeRef.current = scope;
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [confirmation, setConfirmation] = useState<{ title: string; text: string; label: string; action: () => Promise<void> } | null>(null);
  const [recovery, setRecovery] = useState<AdminPlayer | null>(null);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<RoomMetadata | null>(null);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (err) { setError(err instanceof Error ? err.message : 'Falha de conexão. Tente novamente.'); }
    finally { setBusy(false); }
  };
  const loadRanking = async (target: string) => {
    setRankingLoading(true);
    try {
      const result = await api<{ players: AdminPlayer[] }>(target === '*' ? '/api/admin/ranking' : `/api/admin/ranking?room=${encodeURIComponent(target)}`);
      if (scopeRef.current === target) setPlayers(result.players || []);
    } finally { if (scopeRef.current === target) setRankingLoading(false); }
  };
  useEffect(() => { void refresh().catch(() => setError('Não foi possível verificar sua sessão. Recarregue a página.')); }, [refresh]);
  useEffect(() => {
    setPlayers([]); setUsers([]); setRooms([]); setScope('');
    setSection(user?.mustChangePassword ? 'account' : user?.role === 'admin' ? 'team' : 'ranking');
    if (!user || user.mustChangePassword) return;
    let active = true;
    setDirectoryLoading(true);
    Promise.all([api<{ rooms: RoomMetadata[] }>('/api/rooms'), user.role === 'admin' ? api<{ users: StaffUser[] }>('/api/users') : Promise.resolve({ users: [] })])
      .then(([roomData, userData]) => { if (active) { setRooms(roomData.rooms); setUsers(userData.users); } })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setDirectoryLoading(false); });
    return () => { active = false; };
  }, [user?.id, user?.mustChangePassword]);
  useEffect(() => {
    setPlayers([]); setRankingLoading(false);
    if (!scope || !user || user.mustChangePassword) return;
    let active = true;
    setRankingLoading(true);
    api<{ players: AdminPlayer[] }>(scope === '*' ? '/api/admin/ranking' : `/api/admin/ranking?room=${encodeURIComponent(scope)}`)
      .then((data) => { if (active) setPlayers(data.players || []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setRankingLoading(false); });
    return () => { active = false; };
  }, [scope, user?.id, user?.mustChangePassword]);
  useEffect(() => {
    if (!user || user.mustChangePassword) return;
    const socket = getSocket();
    const update = (nextRooms: RoomMetadata[]) => {
      setRooms(nextRooms);
      if (scopeRef.current && scopeRef.current !== '*' && !nextRooms.some((room) => room.roomCode === scopeRef.current)) setScope('');
    };
    socket.on('rooms:updated', update);
    useGameStore.getState().initSocketConnection();
    return () => { socket.off('rooms:updated', update); };
  }, [user?.id, user?.mustChangePassword]);

  const targetLabel = scope === '*' ? 'todas as salas' : rooms.find((room) => room.roomCode === scope)?.roomName || scope;
  const selectedRoom = rooms.find((room) => room.roomCode === scope);
  const closeCreate = () => { if (!busy) { setCreateOpen(false); setTemporaryPassword(''); setDialogError(''); } };
  return <div className="org-surface min-h-screen">
    <BandeirolasHeader mode="home" compact rightSlot={<Link to="/" className={`${button} org-button-quiet`}><ArrowLeft size={16} aria-hidden="true" /><span className="hidden sm:inline">Voltar às </span>salas</Link>} />
    <main className={`mx-auto px-4 sm:px-6 py-8 sm:py-12 ${user ? 'max-w-5xl' : 'max-w-6xl'}`}>
      {!loaded ? <p className="org-notice" role="status">Verificando sua conta…</p> : !user ? <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-4xl mx-auto py-4 sm:py-10">
        <section className="space-y-5">
          <img src="/marca/menina-mdx.svg" alt="" className="h-24 w-24" />
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">O jogo acontece.<br />Você cuida da sala.</h1>
          <p className="org-description max-w-sm">Entre com sua conta da organização para abrir salas, acompanhar as participantes e conduzir o Desafio de Prompt.</p>
          <Link to="/" className={`${button} org-button-quiet !px-0`}>Só quero assistir aos telões <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
        <section className="mermas-card p-6 sm:p-8 space-y-6">
          <div><h2 className="font-display text-2xl">Acesso da organização</h2><p className="org-description mt-2">Use a conta fornecida pela administração.</p></div>
          {error && <p role="alert" className="org-notice org-notice-error">{error}</p>}
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); if (!busy) void run(async () => { await login(email.trim(), password); setPassword(''); }); }}>
            <label className="org-label">E-mail<input className={field} type="email" required autoComplete="username" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="org-label">Senha<input className={field} type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button disabled={busy} className={`${button} org-button-primary w-full`} aria-busy={busy}>{busy ? 'Entrando…' : 'Entrar na minha conta'}<ArrowRight size={16} aria-hidden="true" /></button>
          </form>
          <p className="org-description border-t border-[var(--mermas-lilac-border)] pt-4">Ainda não tem acesso? Peça uma conta à administração do evento.</p>
        </section>
      </div> : <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2"><span className="org-badge"><ShieldCheck size={14} aria-hidden="true" />{user.role === 'admin' ? 'Administração do evento' : 'Moderação de salas'}</span><h1 className="font-display text-2xl sm:text-3xl break-words">Olá, {user.name}.</h1><p className="org-description break-all">{user.email}</p></div>
          <button className={`${button} org-button-quiet`} disabled={busy} onClick={() => void run(async () => { await logout(); setPassword(''); })}><LogOut size={16} aria-hidden="true" />Sair da conta</button>
        </div>
        {error && <p role="alert" className="org-notice org-notice-error">{error}</p>}
        {notice && <p role="status" className="org-notice org-notice-success">{notice}</p>}
        {!user.mustChangePassword && <nav className="org-nav" aria-label="Seções da organização">
          {([...(user.role === 'admin' ? [['team', 'Equipe', Users]] : []), ['ranking', 'Ranking', ShieldCheck], ['account', 'Minha conta', KeyRound]] as const).map(([id, label, Icon]) => <button key={id as string} className={button} aria-pressed={section === id} onClick={() => { setSection(id as Section); setError(''); setNotice(''); }}><Icon size={16} aria-hidden="true" />{label as string}</button>)}
        </nav>}
        {(section === 'account' || user.mustChangePassword) && <section className="mermas-card p-5 sm:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3"><KeyRound size={28} aria-hidden="true" /><h2 className="font-display text-xl">{user.mustChangePassword ? 'Crie sua senha pessoal' : 'Segurança da sua conta'}</h2><p className="org-description max-w-sm">{user.mustChangePassword ? 'Antes de moderar, substitua a senha temporária por uma senha que só você conhece.' : 'Escolha uma senha com pelo menos 12 caracteres. Ao salvar, suas outras sessões serão encerradas.'}</p></div>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (!busy) void run(async () => {
              if (newPassword !== confirmPassword) throw new Error('As novas senhas não coincidem. Confira os dois campos.');
              await changePassword(password, newPassword); setPassword(''); setNewPassword(''); setConfirmPassword(''); setNotice('Senha alterada. Sua conta está pronta.');
            }); }}>
              <label className="org-label">Senha atual<input type="password" required autoComplete="current-password" className={field} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              <label className="org-label">Nova senha<input type="password" required minLength={12} aria-describedby="new-password-help" autoComplete="new-password" className={field} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
              <p id="new-password-help" className="org-description">No mínimo 12 caracteres, diferente da senha atual.</p>
              <label className="org-label">Confirme a nova senha<input type="password" required minLength={12} autoComplete="new-password" className={field} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
              <button className={`${button} org-button-primary`} disabled={busy}>{busy ? 'Salvando…' : 'Salvar nova senha'}</button>
            </form>
          </div>
        </section>}
        {!user.mustChangePassword && section === 'team' && user.role === 'admin' && <section className="mermas-card p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display text-xl">Equipe do evento</h2><p className="org-description mt-2 max-w-lg">Toda conta da organização pode moderar qualquer sala. Apenas administradores podem cadastrar usuários e fazer manutenção global.</p></div><button className={`${button} org-button-primary`} onClick={() => { setDialogError(''); setCreateOpen(true); }}><Plus size={16} aria-hidden="true" />Adicionar moderador</button></div>
          {directoryLoading ? <p role="status" className="org-notice">Carregando equipe…</p> : <ul className="divide-y divide-[var(--mermas-lilac-border)]">{users.map((operator) => <li key={operator.id} className="py-4 flex flex-wrap items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[var(--mermas-lilac-light)] flex items-center justify-center font-semibold shrink-0" aria-hidden="true">{operator.name.slice(0, 1)}</span>
            <div className="min-w-0 flex-1"><p className="font-semibold break-words">{operator.name}{operator.id === user.id && <span className="org-description font-normal"> · você</span>}</p><p className="org-description break-all">{operator.email}</p></div>
            <span className="org-badge">{operator.role === 'admin' ? 'Administrador' : 'Moderador'}</span>{operator.mustChangePassword && <span className="org-description">Primeiro acesso pendente</span>}
          </li>)}</ul>}
        </section>}
        {!user.mustChangePassword && section === 'ranking' && <section className="mermas-card p-5 sm:p-8 space-y-6">
          <div><h2 className="font-display text-xl">Ranking por sala</h2><p className="org-description mt-2">Selecione uma sala para consultar os perfis. Manutenção só altera a sala escolhida.</p></div>
          <div className="flex flex-wrap items-end gap-3"><div className="org-label flex-1 min-w-0"><label htmlFor="ranking-room">Sala</label><select id="ranking-room" value={scope} className={field} disabled={busy || directoryLoading} onChange={(event) => { setScope(event.target.value); setConfirmation(null); setError(''); }}>
            <option value="">Selecione uma sala</option>{rooms.map((room) => <option key={room.roomCode} value={room.roomCode}>{room.roomName} ({room.roomCode})</option>)}{user.role === 'admin' && <option value="*">Todas as salas — manutenção global</option>}
          </select></div>{scope && <button className={button} disabled={busy || rankingLoading} onClick={() => void run(() => loadRanking(scope))}><RefreshCw size={16} aria-hidden="true" />Atualizar</button>}{selectedRoom && <button className={`${button} org-button-danger`} disabled={busy || rankingLoading} onClick={() => { setRoomToDelete(selectedRoom); setDeleteCode(''); setDeleteError(''); }}><Trash2 size={16} aria-hidden="true" />Excluir sala e dados…</button>}</div>
          {!scope ? <div className="org-notice">{!directoryLoading && rooms.length === 0 ? <>Nenhuma sala cadastrada. <Link to="/" className="underline">Crie uma sala na página inicial.</Link></> : 'Escolha uma sala acima. Os perfis e a progressão são independentes em cada sala.'}</div> : rankingLoading ? <p role="status" className="org-notice">Carregando perfis de {targetLabel}…</p> : <>
            <p className="org-description">{players.length} {players.length === 1 ? 'perfil' : 'perfis'} · {targetLabel}</p>
            <ul className="divide-y divide-[var(--mermas-lilac-border)]">{players.map((player) => <li key={player.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0"><p className="font-semibold break-words">{player.nickname}</p><p className="org-description tabular-nums">{scope === '*' && `${player.roomCode} · `}Recorde {player.highScore} · {player.matchesPlayed} partidas</p></div>
              <div className="flex flex-wrap gap-2">{user.role === 'admin' && <button className={button} disabled={busy} onClick={() => { setRecovery(player); setRecoveryCode(''); }}>Recuperar vínculo<span className="sr-only"> de {player.nickname}</span></button>}
                <button className={`${button} org-button-quiet !text-rose-800`} disabled={busy} onClick={() => setConfirmation({ title: `Remover ${player.nickname}?`, label: 'Remover perfil', text: `O perfil e os dados de ${player.nickname} na sala ${player.roomCode} serão removidos. A rodada em andamento nessa sala será cancelada. Esta ação não pode ser desfeita.`, action: async () => { await api(`/api/admin/players/${encodeURIComponent(player.id)}?room=${encodeURIComponent(player.roomCode)}&confirm=true`, undefined, 'DELETE'); await loadRanking(scope); setNotice(`Perfil de ${player.nickname} removido da sala ${player.roomCode}.`); } })}><Trash2 size={16} aria-hidden="true" />Remover<span className="sr-only"> {player.nickname}</span></button>
              </div>
            </li>)}</ul>
            {players.length === 0 && <p className="org-notice">Esta sala ainda não tem perfis. As participantes aparecem aqui após se cadastrarem pelo QR Code.</p>}
            <details className="org-disclosure"><summary>Manutenção do ranking</summary><div className="space-y-4"><p className="org-description">Zerar o ranking apaga as pontuações e o histórico de partidas de {targetLabel}. Os perfis são mantidos. As rodadas nesse escopo serão canceladas.</p><button className={`${button} org-button-danger`} disabled={busy} onClick={() => setConfirmation({ title: `Zerar ranking de ${targetLabel}?`, label: 'Zerar ranking', text: `As pontuações e o histórico de partidas de ${targetLabel} serão apagados, e as rodadas nesse escopo serão canceladas. Esta ação não pode ser desfeita.`, action: async () => { await api('/api/admin/clear-ranking', { ...(scope === '*' ? {} : { roomCode: scope }), confirm: true }); await loadRanking(scope); setNotice(`Ranking zerado: ${targetLabel}.`); } })}>Zerar ranking…</button></div></details>
          </>}
        </section>}
      </div>}
    </main>
    <AccessibleDialog open={Boolean(roomToDelete) && Boolean(user) && !user?.mustChangePassword} title={`Excluir sala ${roomToDelete?.roomCode || ''}?`} onClose={() => { if (!busy) setRoomToDelete(null); }}>
      <div className="space-y-5">
        <p className="org-description">A sala <strong>{roomToDelete?.roomName} ({roomToDelete?.roomCode})</strong> será excluída junto com a rodada atual, os perfis das participantes, pontos, conquistas e histórico de partidas. As outras salas e as contas da equipe não serão alteradas.</p>
        <p className="org-notice org-notice-error">Esta ação é permanente. Fechar entradas ou zerar o ranking não exclui a sala.</p>
        {deleteError && <p role="alert" className="org-notice org-notice-error">{deleteError}</p>}
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault();
          if (!roomToDelete || busy || deleteCode !== roomToDelete.roomCode) return;
          const target = roomToDelete;
          setBusy(true); setDeleteError(''); setError(''); setNotice('');
          try {
            const result = await api<{ rooms: RoomMetadata[] }>(`/api/rooms/${encodeURIComponent(target.roomCode)}?confirm=${encodeURIComponent(deleteCode)}`, undefined, 'DELETE');
            clearRoomMatchHistory(target.roomCode);
            setRooms(result.rooms); setScope(''); setPlayers([]); setRoomToDelete(null); setDeleteCode('');
            setNotice(`Sala ${target.roomName} (${target.roomCode}) e seus dados excluídos.`);
          } catch (err) { setDeleteError(err instanceof Error ? err.message : 'Não foi possível excluir. Confira o estado da sala antes de tentar novamente.'); }
          finally { setBusy(false); }
        }}>
          <label className="org-label">Digite {roomToDelete?.roomCode} para confirmar<input className={field} value={deleteCode} onChange={(event) => setDeleteCode(event.target.value)} required autoComplete="off" autoCapitalize="characters" spellCheck={false} disabled={busy} /></label>
          <div className="flex flex-wrap justify-end gap-2"><button type="button" className={button} disabled={busy} onClick={() => setRoomToDelete(null)}>Cancelar</button><button className={`${button} org-button-danger`} disabled={busy || deleteCode !== roomToDelete?.roomCode}>{busy ? 'Excluindo sala…' : 'Excluir sala permanentemente'}</button></div>
        </form>
      </div>
    </AccessibleDialog>
    <AccessibleDialog open={createOpen && user?.role === 'admin'} title="Adicionar moderador" onClose={closeCreate}>
      <p className="org-description mb-5">A pessoa poderá criar e moderar qualquer sala, mas não cadastrar usuários nem fazer manutenção global. Ela precisará trocar a senha temporária no primeiro acesso.</p>
      {dialogError && <p role="alert" className="org-notice org-notice-error mb-4">{dialogError}</p>}
      <form className="space-y-4" onSubmit={async (event) => {
        event.preventDefault(); if (busy) return; setBusy(true); setDialogError('');
        try { await api('/api/users', { name: createName.trim(), email: createEmail.trim(), password: temporaryPassword }); setTemporaryPassword(''); setCreateName(''); setCreateEmail(''); setCreateOpen(false); setUsers((await api<{ users: StaffUser[] }>('/api/users')).users); setNotice('Moderador cadastrado. Compartilhe as credenciais em um canal privado.'); }
        catch (err) { setDialogError(err instanceof Error ? err.message : 'Não foi possível criar a conta.'); }
        finally { setBusy(false); }
      }}>
        <label className="org-label">Nome<input required minLength={2} maxLength={80} autoComplete="off" className={field} value={createName} onChange={(event) => setCreateName(event.target.value)} /></label>
        <label className="org-label">E-mail<input type="email" required autoComplete="off" className={field} value={createEmail} onChange={(event) => setCreateEmail(event.target.value)} /></label>
        <label className="org-label">Senha temporária<input type="password" required minLength={8} maxLength={128} autoComplete="new-password" aria-describedby="temporary-password-help" className={field} value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} /></label>
        <p className="org-description" id="temporary-password-help">No mínimo 8 caracteres. Entregue a senha somente à pessoa cadastrada.</p>
        <div className="flex flex-wrap justify-end gap-2 pt-2"><button type="button" className={button} disabled={busy} onClick={closeCreate}>Cancelar</button><button className={`${button} org-button-primary`} disabled={busy}>{busy ? 'Criando conta…' : 'Criar conta'}</button></div>
      </form>
    </AccessibleDialog>
    <AccessibleDialog open={Boolean(confirmation)} title={confirmation?.title || 'Confirmar ação'} onClose={() => setConfirmation(null)}>
      <p className="org-description mb-6">{confirmation?.text}</p><div className="flex flex-wrap justify-end gap-2"><button className={button} onClick={() => setConfirmation(null)}>Voltar</button><button className={`${button} org-button-danger`} disabled={busy} onClick={() => { const action = confirmation?.action; setConfirmation(null); if (action) void run(action); }}>{confirmation?.label || 'Confirmar'}</button></div>
    </AccessibleDialog>
    <AccessibleDialog open={Boolean(recovery)} title={`Recuperar vínculo · ${recovery?.nickname || ''}`} onClose={() => setRecovery(null)}>
      <p className="org-description mb-5">Verifique pessoalmente a identidade de {recovery?.nickname}. O progresso na sala {recovery?.roomCode} será vinculado ao navegador indicado. A sala precisa estar sem rodada em andamento.</p>
      <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); const player = recovery; if (!player) return; setRecovery(null); setConfirmation({ title: `Vincular perfil de ${player.nickname}?`, label: 'Confirmar vínculo', text: `Confirma que verificou a identidade de ${player.nickname}? O progresso da sala ${player.roomCode} passará ao código ${recoveryCode.trim()}. O navegador anterior perderá o vínculo.`, action: async () => { await api(`/api/admin/players/${encodeURIComponent(player.id)}/rebind`, { roomCode: player.roomCode, deviceId: recoveryCode.trim(), confirm: true }); setRecoveryCode(''); await loadRanking(scope); setNotice(`Vínculo de ${player.nickname} recuperado na sala ${player.roomCode}.`); } }); }}>
        <label className="org-label">Código de recuperação<input className={field} value={recoveryCode} required maxLength={128} onChange={(event) => setRecoveryCode(event.target.value)} autoComplete="off" /></label>
        <p className="org-description">Peça o código exibido no celular da participante. Se o navegador já tiver outro perfil nesta sala, nenhum dado será mesclado ou apagado.</p>
        <button className={`${button} org-button-primary`} disabled={busy || !recoveryCode.trim()}>Revisar recuperação <ArrowRight size={16} aria-hidden="true" /></button>
      </form>
    </AccessibleDialog>
  </div>;
};
