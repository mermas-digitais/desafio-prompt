import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Link2,
  Music2,
  Pause,
  Play,
  RefreshCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useRadioStore, estimatedRadioTime } from '../store/useRadioStore';
import { useAuthStore } from '../store/useAuthStore';
import { AccessibleDialog } from './AccessibleDialog';
import { RadioPlayback } from './RadioPlayback';
import { radioPosition, type RadioState } from '../../shared/radio';

const secondsLabel = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * Single persistent global radio UI:
 * - In TV IDLE: docks cleanly into the 126px banner slot above the QR card.
 * - In TV active phases: shrinks cleanly into the BandeirolasHeader slot.
 * - Elsewhere (Home/Rooms/Admin/Mobile): floats as a discreet collapsible pill with thumbnail.
 * The YouTube player stays mounted once in the DOM so playback never reloads across navigation or phases.
 */
export const GlobalRadioDock: React.FC = () => {
  const { station, paused, muted, playing, blocked, error, connectionError, anchor, togglePause, toggleMute } =
    useRadioStore();
  const { user, refresh } = useAuthStore();

  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyControl, setBusyControl] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

  useEffect(() => {
    const update = () => setProgress(station ? radioPosition(station, estimatedRadioTime()) : 0);
    update();
    const timer = setInterval(update, 500);
    return () => clearInterval(timer);
  }, [station]);

  useEffect(() => {
    if (!user || user.mustChangePassword) setEdit(false);
  }, [user?.id, user?.mustChangePassword]);

  const canControlGlobal = Boolean(user && !user.mustChangePassword);
  const duration = station?.track?.durationSec || 0;
  const pct = duration > 0 ? Math.min(100, Math.max(0, (progress / duration) * 100)) : 0;
  const hasIssue = Boolean(error || connectionError || station?.error);

  const thumbnailUrl = station?.track?.videoId
    ? `https://i.ytimg.com/vi/${station.track.videoId}/hqdefault.jpg`
    : station?.coverUrl || '';

  const trackTitle = station?.track?.title || 'Trilha do evento';
  const trackArtist = station?.track?.artist || station?.playlistTitle || 'Rádio global MDX';

  const sendControl = async (endpoint: '/api/radio/next' | '/api/radio/previous' | '/api/radio/seek', extra?: Record<string, unknown>) => {
    if (!canControlGlobal || !station || busyControl) return;
    setBusyControl(true);
    setNotice('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epoch: station.epoch, revision: station.revision, ...extra }),
      });
      const result = (await response.json()) as RadioState & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Não foi possível controlar a rádio agora.');
      useRadioStore.getState().apply(result);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Erro ao controlar a rádio.');
    } finally {
      setBusyControl(false);
    }
  };

  const handleSeekClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canControlGlobal || !station?.track || duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    void sendControl('/api/radio/seek', { positionSec: Math.round(ratio * duration) });
  };

  const renderThumbnail = (sizeClass: string) => (
    <div
      className={`relative ${sizeClass} rounded-xl overflow-hidden bg-[#F5F0FF] border border-[#DDC7F8] shrink-0 flex items-center justify-center`}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={trackTitle}
          decoding="async"
          className="w-full h-full object-cover"
        />
      ) : (
        <Music2 className="w-4 h-4 text-[#9747FF]" aria-hidden="true" />
      )}
    </div>
  );

  const isAnchoredIdle = anchor?.variant === 'tv-idle';
  const isAnchoredHeader = anchor?.variant === 'tv-header';

  const containerStyle: React.CSSProperties | undefined = anchor
    ? {
        position: 'fixed',
        top: `${anchor.top}px`,
        left: `${anchor.left}px`,
        width: `${anchor.width}px`,
        right: 'auto',
        bottom: 'auto',
      }
    : undefined;

  return (
    <aside
      style={containerStyle}
      className={`global-radio-dock ${anchor ? 'is-anchored' : ''} ${expanded ? 'is-expanded' : ''}`}
      aria-label="Rádio de todas as salas"
    >
      {/* Persistent YouTube player container (visible when expanded, hidden via CSS visibility when collapsed) */}
      <div
        className={`global-radio-drawer ${isAnchoredHeader ? 'is-below' : ''}`}
        aria-hidden={!expanded}
        inert={!expanded ? true : undefined}
      >
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--mermas-lilac-border)]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--mermas-lilac-light)] text-[var(--mermas-purple-neon)] shrink-0">
              <Music2 size={14} aria-hidden="true" />
            </span>
            <h2 className="font-display text-sm text-[var(--mermas-plum)] truncate">Rádio global</h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {canControlGlobal && (
              <button
                type="button"
                className="org-button org-button-quiet !p-1.5"
                title="Alterar playlist de todas as salas"
                aria-label="Alterar playlist de todas as salas"
                onClick={() => { setUrl(station?.playlistUrl || ''); setSaveError(''); setEdit(true); }}
              >
                <Link2 size={15} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="org-button org-button-quiet !p-1.5"
              title="Recolher vídeo da rádio"
              aria-label="Recolher rádio"
              onClick={() => setExpanded(false)}
            >
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 rounded-xl overflow-hidden bg-black/95 border border-[var(--mermas-lilac-border)]">
          <RadioPlayback />
        </div>

        <div className="mt-2.5 min-w-0">
          <p className="font-semibold text-xs text-[var(--mermas-plum)] truncate">{trackTitle}</p>
          <p className="text-[11px] text-[var(--mermas-purple-soft)] truncate">{trackArtist}</p>
        </div>

        <div aria-label="Posição global da faixa" className="mt-2 space-y-1">
          <div
            onClick={handleSeekClick}
            className={`h-2 w-full rounded-full bg-[var(--mermas-lilac-light)] border border-[#DDC7F8] overflow-hidden ${canControlGlobal ? 'cursor-pointer' : ''}`}
            title={canControlGlobal ? 'Clique para avançar ou voltar o tempo da faixa para todas as salas' : 'Linha do tempo sincronizada ao vivo'}
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #9747FF, #FF4A97, #FFCD34)' }}
            />
          </div>
          <p className="text-[11px] text-[var(--mermas-purple-soft)] tabular-nums flex items-center justify-between">
            <span>{secondsLabel(progress)} / {secondsLabel(duration)}</span>
            <span>{paused ? 'Pausado aqui' : blocked ? 'Ative o som' : 'Ao vivo'}{muted ? ' · mudo' : ''}</span>
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          {canControlGlobal && (
            <button
              type="button"
              disabled={busyControl}
              onClick={() => void sendControl('/api/radio/previous')}
              className="w-8 h-8 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-[#330043] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              title="Faixa anterior (todas as salas)"
              aria-label="Faixa anterior"
            >
              <SkipBack size={14} className="text-[#9747FF]" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="org-button flex-1 justify-center !py-1.5 text-xs"
            onClick={togglePause}
            aria-label={paused || blocked ? 'Ouvir rádio neste acesso' : 'Pausar rádio neste acesso'}
          >
            {paused || blocked ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused || blocked ? 'Ouvir aqui' : 'Pausar aqui'}
          </button>
          {canControlGlobal && (
            <button
              type="button"
              disabled={busyControl}
              onClick={() => void sendControl('/api/radio/next')}
              className="w-8 h-8 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-[#330043] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              title="Próxima faixa (todas as salas)"
              aria-label="Próxima faixa"
            >
              <SkipForward size={14} className="text-[#9747FF]" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-[#330043] flex items-center justify-center transition-colors cursor-pointer"
            aria-pressed={muted}
            aria-label={muted ? 'Ativar som da música neste acesso' : 'Silenciar música neste acesso'}
            onClick={toggleMute}
          >
            {muted ? <VolumeX size={14} className="text-rose-500" aria-hidden="true" /> : <Volume2 size={14} className="text-[#9747FF]" aria-hidden="true" />}
          </button>
        </div>

        {hasIssue && (
          <div className="mt-2 space-y-1.5">
            <p role="alert" className="org-notice org-notice-error text-xs">{connectionError || error || station?.error}</p>
            <button
              type="button"
              className="org-button org-button-quiet w-full justify-center !py-1 text-xs"
              onClick={() => useRadioStore.setState((state) => ({ activation: state.activation + 1, error: null, blocked: false }))}
            >
              <RefreshCw size={13} aria-hidden="true" />Reconectar este player
            </button>
          </div>
        )}
        {notice && <p role="status" className="mt-1.5 text-[11px] text-[var(--mermas-purple-mid)]">{notice}</p>}
      </div>

      {/* MODE 1: TV IDLE Banner (126px height above QR card, matching original visual identity) */}
      {isAnchoredIdle && (
        <div
          role="region"
          aria-label="Controles rápidos da rádio global"
          className="w-full h-[126px] rounded-3xl bg-white/95 backdrop-blur-md border border-[#DDC7F8] shadow-[0_10px_28px_rgba(151,71,255,0.12)] px-3.5 py-2.5 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-[10px] font-bold text-[#9747FF] uppercase tracking-wider shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${playing && !paused ? 'bg-emerald-500 animate-pulse' : 'bg-[#FF4A97]'}`} />
                <span>Rádio MDX</span>
              </span>
              <span className="text-[11px] font-bold text-[#6E4F7D] truncate">{station?.playlistTitle || 'Rádio global'}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-pressed={muted}
                aria-label={muted ? 'Ativar som da música neste acesso' : 'Silenciar música neste acesso'}
                title={muted ? 'Ativar som da música' : 'Silenciar música'}
                className="w-7 h-7 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#9747FF]" />}
              </button>
              {canControlGlobal && (
                <button
                  type="button"
                  onClick={() => { setUrl(station?.playlistUrl || ''); setSaveError(''); setEdit(true); }}
                  aria-label="Alterar playlist de todas as salas"
                  title="Alterar playlist de todas as salas"
                  className="w-7 h-7 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] hover:text-[#330043] cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                aria-label={expanded ? 'Recolher rádio' : 'Expandir rádio'}
                title={expanded ? 'Recolher vídeo' : 'Abrir player completo'}
                className="w-7 h-7 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] hover:text-[#330043] cursor-pointer"
              >
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD]">
            {renderThumbnail('w-12 h-12')}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#330043] truncate" title={trackTitle}>{trackTitle}</p>
                <span className="text-[10px] font-semibold text-[#6E4F7D] tabular-nums shrink-0">
                  {secondsLabel(progress)} / {secondsLabel(duration)}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#9747FF] truncate mb-1.5">{trackArtist}</p>
              <div
                onClick={handleSeekClick}
                className={`w-full h-2 rounded-full bg-white border border-[#DDC7F8] overflow-hidden ${canControlGlobal ? 'cursor-pointer' : ''}`}
                title={canControlGlobal ? 'Clique para avançar ou voltar o tempo da faixa' : 'Progresso ao vivo'}
              >
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFCD34] rounded-full transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {canControlGlobal && (
                <button
                  type="button"
                  disabled={busyControl}
                  onClick={() => void sendControl('/api/radio/previous')}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Faixa anterior"
                  aria-label="Faixa anterior"
                >
                  <SkipBack className="w-3.5 h-3.5 text-[#9747FF]" />
                </button>
              )}
              <button
                type="button"
                onClick={togglePause}
                className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#FF4A97] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(255,74,151,0.28)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                title={paused || blocked ? 'Ouvir rádio aqui' : 'Pausar rádio aqui'}
                aria-label={paused || blocked ? 'Ouvir rádio neste acesso' : 'Pausar rádio neste acesso'}
              >
                {paused || blocked ? <Play className="w-4 h-4 fill-white ml-0.5" /> : <Pause className="w-4 h-4 fill-white" />}
              </button>
              {canControlGlobal && (
                <button
                  type="button"
                  disabled={busyControl}
                  onClick={() => void sendControl('/api/radio/next')}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Próxima faixa"
                  aria-label="Próxima faixa"
                >
                  <SkipForward className="w-3.5 h-3.5 text-[#9747FF]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: TV Header Compact Pill (48px height inside BandeirolasHeader during active rounds) */}
      {isAnchoredHeader && (
        <div
          role="region"
          aria-label="Controles rápidos da rádio global"
          className="w-full h-[48px] rounded-2xl bg-[#FAF7FF]/95 backdrop-blur-md border border-[#DDC7F8] shadow-xs px-2 flex items-center gap-2"
        >
          {renderThumbnail('w-8 h-8 !rounded-lg')}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-[#330043] truncate leading-tight">{trackTitle}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                onClick={handleSeekClick}
                className={`h-1.5 flex-1 rounded-full bg-white border border-[#DDC7F8] overflow-hidden ${canControlGlobal ? 'cursor-pointer' : ''}`}
                title={canControlGlobal ? 'Clique para avançar o tempo da faixa' : 'Ao vivo'}
              >
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-gradient-to-r from-[#9747FF] to-[#FF4A97] rounded-full transition-all duration-300"
                />
              </div>
              <span className="text-[10px] text-[#6E4F7D] tabular-nums shrink-0">{secondsLabel(progress)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {canControlGlobal && (
              <button
                type="button"
                disabled={busyControl}
                onClick={() => void sendControl('/api/radio/previous')}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Faixa anterior"
                aria-label="Faixa anterior"
              >
                <SkipBack className="w-3 h-3 text-[#9747FF]" />
              </button>
            )}
            <button
              type="button"
              onClick={togglePause}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9747FF] to-[#FF4A97] text-white flex items-center justify-center cursor-pointer"
              title={paused || blocked ? 'Ouvir rádio aqui' : 'Pausar rádio aqui'}
              aria-label={paused || blocked ? 'Ouvir rádio neste acesso' : 'Pausar rádio neste acesso'}
            >
              {paused || blocked ? <Play className="w-3.5 h-3.5 fill-white ml-0.5" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
            </button>
            {canControlGlobal && (
              <button
                type="button"
                disabled={busyControl}
                onClick={() => void sendControl('/api/radio/next')}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Próxima faixa"
                aria-label="Próxima faixa"
              >
                <SkipForward className="w-3 h-3 text-[#9747FF]" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={muted}
              aria-label={muted ? 'Ativar som da música neste acesso' : 'Silenciar música neste acesso'}
              className="w-7 h-7 rounded-lg bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center cursor-pointer"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#9747FF]" />}
            </button>
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              aria-label={expanded ? 'Recolher rádio' : 'Expandir rádio'}
              className="w-7 h-7 rounded-lg bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: Floating Discreet Pill (Home, Room Directory, Admin, Mobile) */}
      {!anchor && (
        <div className="global-radio-pill" role="region" aria-label="Controles rápidos da rádio global">
          {renderThumbnail('w-9 h-9 !rounded-full')}

          <button
            type="button"
            className="min-w-0 flex-1 text-left px-1"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Recolher painel da rádio global' : 'Expandir painel da rádio global'}
          >
            <p className="text-xs font-semibold text-[var(--mermas-plum)] truncate leading-tight flex items-center gap-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                  hasIssue ? 'bg-red-500' : playing && !paused ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--mermas-purple-neon)]'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{trackTitle}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1 flex-1 rounded-full bg-[var(--mermas-lilac-light)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #9747FF, #FF4A97)' }}
                />
              </div>
              <span className="text-[10px] text-[var(--mermas-purple-soft)] tabular-nums shrink-0">
                {secondsLabel(progress)}
              </span>
            </div>
          </button>

          {canControlGlobal && (
            <button
              type="button"
              disabled={busyControl}
              onClick={() => void sendControl('/api/radio/previous')}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--mermas-purple-soft)] hover:bg-[var(--mermas-lilac-light)] hover:text-[var(--mermas-plum)] transition shrink-0 disabled:opacity-50"
              title="Faixa anterior"
              aria-label="Faixa anterior"
            >
              <SkipBack size={13} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#9747FF] to-[#FF4A97] text-white hover:opacity-95 transition shrink-0 shadow-xs"
            onClick={togglePause}
            aria-label={paused || blocked ? 'Ouvir rádio neste acesso' : 'Pausar rádio neste acesso'}
            title={paused || blocked ? 'Ouvir rádio aqui' : 'Pausar rádio aqui'}
          >
            {paused || blocked ? <Play size={13} className="fill-white ml-0.5" aria-hidden="true" /> : <Pause size={13} className="fill-white" aria-hidden="true" />}
          </button>

          {canControlGlobal && (
            <button
              type="button"
              disabled={busyControl}
              onClick={() => void sendControl('/api/radio/next')}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--mermas-purple-soft)] hover:bg-[var(--mermas-lilac-light)] hover:text-[var(--mermas-plum)] transition shrink-0 disabled:opacity-50"
              title="Próxima faixa"
              aria-label="Próxima faixa"
            >
              <SkipForward size={13} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--mermas-purple-soft)] hover:bg-[var(--mermas-lilac-light)] hover:text-[var(--mermas-plum)] transition shrink-0"
            aria-pressed={muted}
            aria-label={muted ? 'Ativar som da música neste acesso' : 'Silenciar música neste acesso'}
            title={muted ? 'Ativar som da música' : 'Silenciar música'}
            onClick={toggleMute}
          >
            {muted ? <VolumeX size={14} className="text-rose-500" aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
          </button>

          {canControlGlobal && (
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--mermas-purple-soft)] hover:bg-[var(--mermas-lilac-light)] hover:text-[var(--mermas-plum)] transition shrink-0"
              title="Alterar playlist de todas as salas"
              aria-label="Alterar playlist de todas as salas"
              onClick={() => { setUrl(station?.playlistUrl || ''); setSaveError(''); setEdit(true); }}
            >
              <Link2 size={14} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--mermas-purple-soft)] hover:bg-[var(--mermas-lilac-light)] hover:text-[var(--mermas-plum)] transition shrink-0"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Recolher rádio' : 'Expandir rádio'}
            title={expanded ? 'Recolher rádio' : 'Expandir rádio'}
          >
            {expanded ? <ChevronDown size={15} aria-hidden="true" /> : <ChevronUp size={15} aria-hidden="true" />}
          </button>
        </div>
      )}

      <AccessibleDialog open={edit && canControlGlobal} title="Playlist de todas as salas" onClose={() => { if (!saving) setEdit(false); }}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (saving || !station || !canControlGlobal) return;
            setSaving(true);
            setSaveError('');
            try {
              const response = await fetch('/api/radio/playlist', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(75000),
                body: JSON.stringify({ url: url.trim(), epoch: station.epoch, revision: station.revision }),
              });
              const result = (await response.json()) as RadioState & { error?: string };
              if (!response.ok) throw new Error(result.error || 'Atualize a rádio antes de repetir a alteração.');
              useRadioStore.getState().apply(result);
              setEdit(false);
              setNotice('Playlist atualizada para todas as salas.');
            } catch (err) {
              setSaveError(err instanceof Error ? err.message : 'Não foi possível atualizar a playlist.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <p className="org-description">
            Esta alteração troca a trilha de todas as salas e sessões do evento. Quem pausou ou silenciou localmente continuará assim. As partidas não serão alteradas.
          </p>
          <label className="org-label">
            Link da playlist Spotify
            <input
              className="mermas-input org-field"
              required
              maxLength={500}
              value={url}
              disabled={saving}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://open.spotify.com/playlist/…"
            />
          </label>
          <p className="org-description">
            A playlist define a seleção. A reprodução usa a mesma gravação do YouTube em todos os acessos, sem previews individuais.
          </p>
          {saveError && <p role="alert" className="org-notice org-notice-error">{saveError}</p>}
          <div className="flex flex-wrap gap-2">
            <button className="org-button" type="button" disabled={saving} onClick={() => setEdit(false)}>Cancelar</button>
            <button className="org-button org-button-primary" disabled={saving || !station}>
              {saving ? 'Preparando e salvando…' : 'Aplicar em todas as salas'}
            </button>
          </div>
        </form>
      </AccessibleDialog>
    </aside>
  );
};
