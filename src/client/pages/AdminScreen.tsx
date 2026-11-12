import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { StaffUser } from '../../shared/types';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import type { RoomMetadata } from '../hooks/useRoomAccess';
import { AccessibleDialog } from '../components/AccessibleDialog';

interface AdminPlayer { id: string; nickname: string; roomCode: string; highScore: number; totalScore: number; matchesPlayed: number }
const field = 'mermas-input w-full px-3 py-3 text-base';
const button = 'min-h-11 px-4 py-2 rounded-xl border border-[#DDC7F8] bg-white hover:bg-[#FAF5FF] disabled:opacity-50';

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
  const [users, setUsers] = useState<Pick<StaffUser, 'id' | 'name' | 'email' | 'role'>[]>([]);
  const [scope, setScope] = useState('');
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [confirmation, setConfirmation] = useState<{ title: string; text: string; action: () => Promise<void> } | null>(null);
  const [recovery, setRecovery] = useState<AdminPlayer | null>(null);
  const [recoveryCode, setRecoveryCode] = useState('');

  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (err) { setError(err instanceof Error ? err.message : 'Falha de conexão. Tente novamente.'); }
    finally { setBusy(false); }
  };
  const loadRanking = async (target: string) => {
    const result = await api<{ players: AdminPlayer[] }>(target === '*' ? '/api/admin/ranking' : `/api/admin/ranking?room=${encodeURIComponent(target)}`);
    setPlayers(result.players || []);
  };
  useEffect(() => { void refresh().catch(() => setError('Não foi possível verificar sua sessão. Recarregue a página.')); }, [refresh]);
  useEffect(() => {
    setPlayers([]); setUsers([]); setRooms([]); setScope('');
    if (!user || user.mustChangePassword) return;
    let active = true;
    Promise.all([api<{ rooms: RoomMetadata[] }>('/api/rooms'), api<{ users: typeof users }>('/api/users')])
      .then(([roomData, userData]) => { if (active) { setRooms(roomData.rooms); setUsers(userData.users); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [user?.id, user?.mustChangePassword]);
  useEffect(() => {
    setPlayers([]);
    if (!scope || !user || user.mustChangePassword) return;
    let active = true;
    api<{ players: AdminPlayer[] }>(scope === '*' ? '/api/admin/ranking' : `/api/admin/ranking?room=${encodeURIComponent(scope)}`)
      .then((data) => { if (active) setPlayers(data.players || []); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [scope, user?.id, user?.mustChangePassword]);

  const targetLabel = scope === '*' ? 'TODAS as salas' : `sala ${scope}`;
  return <div className="min-h-screen bg-[#FAF7FF] text-[#330043] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-[#9747FF] [&_:focus-visible]:outline-offset-2">
    <header className="bg-white border-b border-[#DDC7F8] p-4 flex flex-wrap items-center justify-between gap-4">
      <img src="/mermas/logo.svg" alt="Mermãs Digitais" className="h-9" />
      <nav className="flex flex-wrap gap-3 items-center"><Link to="/">Salas e telões</Link>{user && <button className={button} disabled={busy} onClick={() => void run(async () => { await logout(); setPassword(''); })}>Sair da conta</button>}</nav>
    </header>
    <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
      <h1 className="font-display text-2xl">{user ? `Conta de ${user.name}` : 'Acesso da organização'}</h1>
      {error && <p role="alert" className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200">{error}</p>}
      {notice && <p role="status" className="p-3 rounded-xl bg-emerald-50 text-emerald-900">{notice}</p>}
      {!loaded ? <p role="status">Verificando sessão…</p> : !user ? <form className="mermas-card p-6 max-w-md space-y-4" onSubmit={(event) => { event.preventDefault(); void run(async () => { await login(email.trim(), password); setPassword(''); }); }}>
        <p>Entre com a conta fornecida pela administração. Visitantes podem acompanhar os telões sem login.</p>
        <label className="block">E-mail<input className={field} type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="block">Senha<input className={field} type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button disabled={busy} className={`${button} text-[#9747FF] font-semibold`}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form> : <>
        <section className="mermas-card p-6 space-y-4">
          <h2 className="font-display text-xl">{user.mustChangePassword ? 'Troque a senha para continuar' : 'Alterar senha'}</h2>
          <p>{user.mustChangePassword ? 'Primeiro acesso: crie uma senha pessoal antes de criar ou administrar salas.' : 'Ao alterar a senha, outras sessões desta conta serão encerradas.'}</p>
          <form className="max-w-md space-y-3" onSubmit={(event) => { event.preventDefault(); void run(async () => {
            if (newPassword !== confirmPassword) throw new Error('As novas senhas não coincidem.');
            await changePassword(password, newPassword); setPassword(''); setNewPassword(''); setConfirmPassword(''); setNotice('Senha alterada. Sua conta está pronta.');
          }); }}>
            <label className="block">Senha atual<input type="password" required autoComplete="current-password" className={field} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <label className="block">Nova senha (mínimo 12 caracteres)<input type="password" required minLength={12} autoComplete="new-password" className={field} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
            <label className="block">Confirme a nova senha<input type="password" required minLength={12} autoComplete="new-password" className={field} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            <button className={button} disabled={busy}>Salvar nova senha</button>
          </form>
        </section>
        {!user.mustChangePassword && <>
          {user.role === 'admin' && <section className="mermas-card p-6 space-y-4">
            <h2 className="font-display text-xl">Operadores</h2>
            <ul className="space-y-2">{users.map((operator) => <li key={operator.id} className="break-words">{operator.name} · {operator.email} · {operator.role === 'admin' ? 'Administrador' : 'Moderador'}</li>)}</ul>
            <form className="max-w-md space-y-3" onSubmit={(event) => { event.preventDefault(); void run(async () => {
              await api('/api/users', { name: createName.trim(), email: createEmail.trim(), password: temporaryPassword });
              setTemporaryPassword(''); setCreateName(''); setCreateEmail('');
              setUsers((await api<{ users: typeof users }>('/api/users')).users); setNotice('Moderador criado. A senha temporária deverá ser trocada no primeiro acesso.');
            }); }}>
              <h3 className="font-semibold">Criar moderador</h3>
              <label className="block">Nome<input required maxLength={100} className={field} value={createName} onChange={(event) => setCreateName(event.target.value)} /></label>
              <label className="block">E-mail<input type="email" required className={field} value={createEmail} onChange={(event) => setCreateEmail(event.target.value)} /></label>
              <label className="block">Senha temporária (mínimo 8 caracteres)<input type="password" required minLength={8} autoComplete="new-password" className={field} value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} /></label>
              <button className={button} disabled={busy}>Criar conta de moderador</button>
            </form>
          </section>}
          <section className="mermas-card p-6 space-y-4">
            <h2 className="font-display text-xl">Manutenção do ranking</h2>
            <label className="block">Sala alvo<select value={scope} className={field} onChange={(event) => { setScope(event.target.value); setConfirmation(null); setError(''); }}>
              <option value="">Selecione uma sala</option>
              {rooms.filter((room) => user.role === 'admin' || room.moderatorId === user.id).map((room) => <option key={room.roomCode} value={room.roomCode}>{room.roomName} ({room.roomCode})</option>)}
              {user.role === 'admin' && <option value="*">Todas as salas — manutenção global</option>}
            </select></label>
            {scope && <>
              <div className="flex flex-wrap gap-3"><button className={button} disabled={busy} onClick={() => void run(() => loadRanking(scope))}>Atualizar {targetLabel}</button>
                <button className={`${button} text-red-800`} disabled={busy} onClick={() => setConfirmation({ title: `Zerar ranking — ${targetLabel}`, text: `Os placares de ${targetLabel} serão zerados, e as rodadas em andamento nesse escopo serão canceladas. A ação não pode ser desfeita.`, action: async () => { await api('/api/admin/clear-ranking', { ...(scope === '*' ? {} : { roomCode: scope }), confirm: true }); await loadRanking(scope); setNotice(`Ranking zerado: ${targetLabel}.`); } })}>Zerar ranking de {targetLabel}</button></div>
              <ul className="divide-y divide-[#DDC7F8]">{players.map((player) => <li key={player.id} className="py-3 flex flex-wrap items-center justify-between gap-3"><span>{player.nickname} · Recorde {player.highScore} · {player.matchesPlayed} partidas</span>
                <div className="flex flex-wrap gap-2">{user.role === 'admin' && <button className={button} disabled={busy} onClick={() => { setRecovery(player); setRecoveryCode(''); }}>Recuperar vínculo · {player.nickname}</button>}
                <button className={`${button} text-red-800`} disabled={busy} onClick={() => setConfirmation({ title: `Remover ${player.nickname}`, text: `Remover o perfil e os dados de ${player.nickname} da sala ${player.roomCode}? A rodada em andamento nessa sala será cancelada. Esta ação é irreversível.`, action: async () => { await api(`/api/admin/players/${encodeURIComponent(player.id)}?room=${encodeURIComponent(player.roomCode)}&confirm=true`, undefined, 'DELETE'); await loadRanking(scope); setNotice(`${player.nickname} removida da sala ${player.roomCode}.`); } })}>Remover {player.nickname}</button></div>
              </li>)}</ul>
              {players.length === 0 && <p>Nenhuma participante neste ranking.</p>}
            </>}
          </section>
        </>}
      </>}
    </main>
    <AccessibleDialog open={Boolean(confirmation)} title={confirmation?.title || 'Confirmar ação'} onClose={() => setConfirmation(null)}>
      <p className="mb-5">{confirmation?.text}</p><div className="flex gap-3"><button className={button} onClick={() => setConfirmation(null)}>Cancelar</button><button className={`${button} text-red-800`} disabled={busy} onClick={() => { const action = confirmation?.action; setConfirmation(null); if (action) void run(action); }}>Confirmar ação</button></div>
    </AccessibleDialog>
    <AccessibleDialog open={Boolean(recovery)} title={`Recuperar vínculo · ${recovery?.nickname || ''}`} onClose={() => setRecovery(null)}>
      <p className="mb-4">Verifique pessoalmente a identidade de {recovery?.nickname} antes de continuar. O perfil da sala {recovery?.roomCode} será vinculado ao navegador indicado. Aguarde a sala ficar sem rodada em andamento. Não mescla perfis: se já existir outro perfil nesse navegador e sala, a operação será recusada.</p>
      <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); const player = recovery; if (!player) return; setRecovery(null); setConfirmation({ title: `Confirmar recuperação de ${player.nickname}`, text: `Confirma que verificou a identidade de ${player.nickname} e deseja vincular seu progresso da sala ${player.roomCode} ao código ${recoveryCode.trim()}? O navegador anterior perderá o vínculo.`, action: async () => { await api(`/api/admin/players/${encodeURIComponent(player.id)}/rebind`, { roomCode: player.roomCode, deviceId: recoveryCode.trim(), confirm: true }); setRecoveryCode(''); await loadRanking(scope); setNotice(`Vínculo de ${player.nickname} recuperado na sala ${player.roomCode}.`); } }); }}>
        <label className="block">Código de recuperação do navegador da participante<input className={field} value={recoveryCode} required maxLength={128} onChange={(event) => setRecoveryCode(event.target.value)} autoComplete="off" /></label>
        <button className={button} disabled={busy || !recoveryCode.trim()}>Revisar recuperação</button>
      </form>
    </AccessibleDialog>
  </div>;
};
