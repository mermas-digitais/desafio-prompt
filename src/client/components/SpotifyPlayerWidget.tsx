import React, { useEffect, useState } from 'react';
import { Link2, Pause, Play, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useRadioStore, estimatedRadioTime } from '../store/useRadioStore';
import { useAuthStore } from '../store/useAuthStore';
import { AccessibleDialog } from './AccessibleDialog';
import { radioPosition, type RadioState } from '../../shared/radio';

const secondsLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** Controls affect this browser only; only an authenticated playlist edit changes the station. */
export const SpotifyPlayerWidget: React.FC = React.memo(() => {
  const { station, paused, muted, playing, blocked, error, connectionError, togglePause, toggleMute } = useRadioStore();
  const { user, refresh } = useAuthStore();
  const [edit, setEdit] = useState(false);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => { void refresh().catch(() => {}); }, [refresh]);
  useEffect(() => {
    const update = () => setProgress(station ? radioPosition(station, estimatedRadioTime()) : 0);
    update(); const timer = setInterval(update, 500); return () => clearInterval(timer);
  }, [station]);
  useEffect(() => { if (!user || user.mustChangePassword) setEdit(false); }, [user?.id, user?.mustChangePassword]);
  const canEdit = Boolean(user && !user.mustChangePassword);
  const label = paused ? 'Pausado neste acesso' : blocked ? 'Ative o áudio neste acesso' : playing ? 'Acompanhando a rádio global' : station?.status === 'loading' || !station ? 'Preparando a rádio…' : 'Aguardando reprodução';
  return <section className="org-surface space-y-3 min-w-0" aria-label="Controles da rádio global">
    <div className="flex items-center justify-between gap-2"><h2 className="font-display text-base">Rádio global</h2>{canEdit && <button className="org-button org-button-quiet !p-2" title="Alterar playlist de todas as salas" aria-label="Alterar playlist de todas as salas" onClick={() => { setUrl(station?.playlistUrl || ''); setSaveError(''); setEdit(true); }}><Link2 size={17} aria-hidden="true" /></button>}</div>
    <div className="min-w-0"><p className="font-semibold text-sm break-words">{station?.track?.title || 'Trilha do evento'}</p><p className="org-description break-words">{station?.track?.artist || station?.playlistTitle || 'Uma rádio para todas as salas'}</p></div>
    <div aria-label="Posição global da faixa" className="space-y-1"><progress className="w-full accent-[var(--mermas-purple-neon)]" max={station?.track?.durationSec || 1} value={progress} /><p className="text-xs text-[var(--mermas-purple-soft)] tabular-nums">{secondsLabel(progress)} / {secondsLabel(station?.track?.durationSec || 0)} · ao vivo</p></div>
    <div className="flex flex-wrap gap-2"><button className="org-button" onClick={togglePause} aria-label={paused || blocked ? 'Ouvir rádio neste acesso' : 'Pausar rádio neste acesso'}>{paused || blocked ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}{paused || blocked ? 'Ouvir aqui' : 'Pausar aqui'}</button><button className="org-button" aria-pressed={muted} aria-label={muted ? 'Ativar som da música neste acesso' : 'Silenciar música neste acesso'} onClick={toggleMute}>{muted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}</button></div>
    <p role="status" className="org-description">{label}{muted ? ' · música silenciada aqui' : ''}</p>
    {(error || connectionError || station?.error) && <div className="space-y-2"><p role="alert" className="org-notice org-notice-error text-xs">{connectionError || error || station?.error}</p><button className="org-button org-button-quiet" onClick={() => useRadioStore.setState((state) => ({ activation: state.activation + 1, error: null, blocked: false }))}><RefreshCw size={15} aria-hidden="true" />Reconectar este player</button></div>}
    {notice && <p role="status" className="org-description">{notice}</p>}
    <p className="text-xs text-[var(--mermas-purple-soft)]">Pausar e silenciar só afetam este acesso. Ao retomar, você volta ao ponto atual da rádio.</p>
    <AccessibleDialog open={edit && canEdit} title="Playlist de todas as salas" onClose={() => { if (!saving) setEdit(false); }}>
      <form className="space-y-4" onSubmit={async (event) => {
        event.preventDefault(); if (saving || !station || !canEdit) return;
        setSaving(true); setSaveError('');
        try {
          const response = await fetch('/api/radio/playlist', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(75000), body: JSON.stringify({ url: url.trim(), epoch: station.epoch, revision: station.revision }) });
          const result = await response.json() as RadioState & { error?: string };
          if (!response.ok) throw new Error(result.error || 'Atualize a rádio antes de repetir a alteração.');
          useRadioStore.getState().apply(result); setEdit(false); setNotice('Playlist atualizada para todas as salas.');
        } catch (err) { setSaveError(err instanceof Error ? err.message : 'Não foi possível atualizar a playlist.'); }
        finally { setSaving(false); }
      }}>
        <p className="org-description">Esta alteração troca a trilha de todas as salas e sessões do evento. Quem pausou ou silenciou localmente continuará assim. As partidas não serão alteradas.</p>
        <label className="org-label">Link da playlist Spotify<input className="mermas-input org-field" required maxLength={500} value={url} disabled={saving} onChange={(event) => setUrl(event.target.value)} placeholder="https://open.spotify.com/playlist/…" /></label>
        <p className="org-description">A playlist define a seleção. A reprodução usa a mesma gravação do YouTube em todos os acessos, sem previews individuais.</p>
        {saveError && <p role="alert" className="org-notice org-notice-error">{saveError}</p>}
        <div className="flex flex-wrap gap-2"><button className="org-button" type="button" disabled={saving} onClick={() => setEdit(false)}>Cancelar</button><button className="org-button org-button-primary" disabled={saving || !station}>{saving ? 'Preparando e salvando…' : 'Aplicar em todas as salas'}</button></div>
      </form>
    </AccessibleDialog>
  </section>;
});
