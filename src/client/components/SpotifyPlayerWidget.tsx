import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Link2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

export interface SpotifyPlayerWidgetProps {
  compact?: boolean;
  inHeader?: boolean;
  variant?: 'home-banner' | 'header-compact';
  className?: string;
}

interface SpotifyTrackItem {
  uri: string;
  title: string;
  subtitle: string;
  duration: number;
  previewUrl: string;
}

interface YTPlayerInstance {
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy?: () => void;
}

interface YTApi {
  Player: new (
    element: HTMLElement | string,
    options: {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (ev: { target: YTPlayerInstance }) => void;
        onStateChange?: (ev: { data: number; target: YTPlayerInstance }) => void;
        onError?: (ev: { data: number; target: YTPlayerInstance }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const DEFAULT_FALLBACK_URL = 'https://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63';
const STORAGE_OVERRIDE_KEY = 'mdx26_spotify_url_override';

export function toSpotifyEmbedUrl(rawUrl: string): string {
  return (rawUrl || '').trim() || DEFAULT_FALLBACK_URL;
}

function shuffleTracks(list: SpotifyTrackItem[]): SpotifyTrackItem[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const SpotifyPlayerWidget: React.FC<SpotifyPlayerWidgetProps> = React.memo(
  ({ inHeader = false, className = '' }) => {
    const envUrl =
      (import.meta as unknown as { env?: Record<string, string | undefined> }).env
        ?.VITE_SPOTIFY_PLAYLIST_URL || '';

    const [overrideUrl, setOverrideUrl] = useState<string>(() => {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(STORAGE_OVERRIDE_KEY) || '';
      }
      return '';
    });

    const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
    const [draftUrl, setDraftUrl] = useState<string>('');
    const [playlistTitle, setPlaylistTitle] = useState<string>('Músicas de Competição');
    const [coverUrl, setCoverUrl] = useState<string>('');
    const [currentTrack, setCurrentTrack] = useState<SpotifyTrackItem | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [progressSec, setProgressSec] = useState<number>(0);
    const [durationSec, setDurationSec] = useState<number>(0);

    // Refs de fila embaralhada e motores de áudio (Full-Track YouTube + Fallback CDN MP3)
    const shuffledQueueRef = useRef<SpotifyTrackItem[]>([]);
    const queueIndexRef = useRef<number>(0);
    const activeEngineRef = useRef<'yt' | 'html5'>('yt');
    const userPausedManuallyRef = useRef<boolean>(false);
    const isMutedRef = useRef<boolean>(false);

    const ytMountRef = useRef<HTMLDivElement | null>(null);
    const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
    const ytReadyRef = useRef<boolean>(false);
    const candidateVideoIdsRef = useRef<string[]>([]);
    const candidateIdxRef = useRef<number>(0);
    const ytFallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
    const currentTrackRef = useRef<SpotifyTrackItem | null>(null);

    const clearYtFallbackTimer = useCallback(() => {
      if (ytFallbackTimeoutRef.current) {
        clearTimeout(ytFallbackTimeoutRef.current);
        ytFallbackTimeoutRef.current = null;
      }
    }, []);

    // Inicia reprodução via stream direto MP3 da CDN do Spotify (sem iframe, zero banner!)
    const startHtml5Fallback = useCallback(
      (track: SpotifyTrackItem | null) => {
        clearYtFallbackTimer();
        if (!track || !track.previewUrl) return;

        activeEngineRef.current = 'html5';
        try {
          ytPlayerRef.current?.stopVideo();
        } catch {}

        const audio = htmlAudioRef.current;
        if (!audio) return;

        audio.src = track.previewUrl;
        audio.muted = isMutedRef.current;
        audio.volume = 0.85;
        audio.currentTime = 0;

        if (!userPausedManuallyRef.current) {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      },
      [clearYtFallbackTimer]
    );

    // Carrega e toca uma faixa específica (Tenta faixa completa via YT; fallback instantâneo para MP3 CDN)
    const loadAndPlayTrack = useCallback(
      async (track: SpotifyTrackItem) => {
        clearYtFallbackTimer();
        currentTrackRef.current = track;
        setCurrentTrack(track);
        setProgressSec(0);
        setDurationSec(track.duration ? Math.round(track.duration / 1000) : 180);

        if (htmlAudioRef.current) {
          htmlAudioRef.current.pause();
        }

        const query = `${track.title} ${track.subtitle}`.trim();
        let videoIds: string[] = [];

        try {
          const res = await fetch(`/api/spotify-track-video?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.videoIds)) {
              videoIds = data.videoIds;
            }
          }
        } catch {
          // Offline ou erro de rede -> usa fallback MP3 direto
        }

        if (currentTrackRef.current?.uri !== track.uri) return;

        if (videoIds.length > 0 && ytReadyRef.current && ytPlayerRef.current) {
          activeEngineRef.current = 'yt';
          candidateVideoIdsRef.current = videoIds;
          candidateIdxRef.current = 0;

          try {
            ytPlayerRef.current.loadVideoById(videoIds[0], 0);
            if (isMutedRef.current) {
              ytPlayerRef.current.mute();
            } else {
              ytPlayerRef.current.unMute();
              ytPlayerRef.current.setVolume(85);
            }

            if (!userPausedManuallyRef.current) {
              ytPlayerRef.current.playVideo();
            }

            // Se o vídeo não entrar em PLAYING em até 5s, ativa o stream MP3 direto sem silêncio
            ytFallbackTimeoutRef.current = setTimeout(() => {
              if (activeEngineRef.current === 'yt' && !userPausedManuallyRef.current) {
                const state = ytPlayerRef.current?.getPlayerState?.() ?? -1;
                if (state !== 1 && state !== 3) {
                  startHtml5Fallback(track);
                }
              }
            }, 5000);
            return;
          } catch {
            // Se falhar, cai no fallback HTML5 abaixo
          }
        }

        startHtml5Fallback(track);
      },
      [clearYtFallbackTimer, startHtml5Fallback]
    );

    const playNextRandomTrack = useCallback(() => {
      const queue = shuffledQueueRef.current;
      if (queue.length === 0) return;

      userPausedManuallyRef.current = false;
      queueIndexRef.current += 1;

      if (queueIndexRef.current >= queue.length) {
        const lastUri = queue[queue.length - 1]?.uri;
        const reshuffled = shuffleTracks(queue);
        if (reshuffled.length > 1 && reshuffled[0].uri === lastUri) {
          [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
        }
        shuffledQueueRef.current = reshuffled;
        queueIndexRef.current = 0;
      }

      const nextTrack = shuffledQueueRef.current[queueIndexRef.current];
      if (nextTrack) {
        loadAndPlayTrack(nextTrack);
      }
    }, [loadAndPlayTrack]);

    // Inicializa API do YouTube IFrame oculta (1x1) para tocar músicas completas sem banner
    useEffect(() => {
      let mounted = true;

      const initYtPlayer = () => {
        if (!mounted || !ytMountRef.current || !window.YT?.Player) return;
        if (ytPlayerRef.current) return;

        ytPlayerRef.current = new window.YT.Player(ytMountRef.current, {
          width: 1,
          height: 1,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!mounted) return;
              ytReadyRef.current = true;
              if (currentTrackRef.current && activeEngineRef.current === 'yt') {
                loadAndPlayTrack(currentTrackRef.current);
              }
            },
            onStateChange: (ev) => {
              if (!mounted || activeEngineRef.current !== 'yt') return;
              const state = ev.data;
              if (state === 1) {
                clearYtFallbackTimer();
                setIsPlaying(true);
                const dur = ev.target.getDuration?.() || 0;
                if (dur > 0) setDurationSec(Math.round(dur));
              } else if (state === 2) {
                if (userPausedManuallyRef.current) {
                  setIsPlaying(false);
                } else {
                  try {
                    ev.target.playVideo();
                  } catch {}
                }
              } else if (state === 0) {
                playNextRandomTrack();
              }
            },
            onError: () => {
              if (!mounted || activeEngineRef.current !== 'yt') return;
              const nextCandidateIdx = candidateIdxRef.current + 1;
              if (nextCandidateIdx < candidateVideoIdsRef.current.length) {
                candidateIdxRef.current = nextCandidateIdx;
                try {
                  ytPlayerRef.current?.loadVideoById(
                    candidateVideoIdsRef.current[nextCandidateIdx],
                    0
                  );
                  return;
                } catch {}
              }
              startHtml5Fallback(currentTrackRef.current);
            },
          },
        });
      };

      if (window.YT?.Player) {
        initYtPlayer();
      } else {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof prev === 'function') prev();
          initYtPlayer();
        };
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.async = true;
          document.body.appendChild(script);
        }
      }

      return () => {
        mounted = false;
        clearYtFallbackTimer();
      };
    }, [clearYtFallbackTimer, loadAndPlayTrack, playNextRandomTrack, startHtml5Fallback]);

    // Carrega a lista de faixas da playlist do Spotify via backend e embaralha
    useEffect(() => {
      let cancelled = false;

      async function fetchPlaylist() {
        const queryParam = overrideUrl ? `?url=${encodeURIComponent(overrideUrl)}` : '';
        try {
          const res = await fetch(`/api/spotify-playlist${queryParam}`);
          if (!res.ok) return;
          const data = await res.json();
          if (cancelled) return;

          if (data?.playlistTitle) setPlaylistTitle(data.playlistTitle);
          if (data?.coverUrl) setCoverUrl(data.coverUrl);

          if (Array.isArray(data?.tracks) && data.tracks.length > 0) {
            const shuffled = shuffleTracks(data.tracks);
            shuffledQueueRef.current = shuffled;
            queueIndexRef.current = 0;
            userPausedManuallyRef.current = false;
            loadAndPlayTrack(shuffled[0]);
          }
        } catch {
          // Mantém estado atual se offline
        }
      }

      fetchPlaylist();

      return () => {
        cancelled = true;
      };
    }, [overrideUrl, loadAndPlayTrack]);

    // Atualiza barra de progresso continuamente a cada 500ms
    useEffect(() => {
      const timer = setInterval(() => {
        if (activeEngineRef.current === 'yt' && ytPlayerRef.current && ytReadyRef.current) {
          try {
            const cur = ytPlayerRef.current.getCurrentTime?.() || 0;
            const dur = ytPlayerRef.current.getDuration?.() || 0;
            if (cur >= 0) setProgressSec(Math.floor(cur));
            if (dur > 0) setDurationSec(Math.floor(dur));
          } catch {}
        } else if (activeEngineRef.current === 'html5' && htmlAudioRef.current) {
          const audio = htmlAudioRef.current;
          setProgressSec(Math.floor(audio.currentTime || 0));
          if (audio.duration && Number.isFinite(audio.duration)) {
            setDurationSec(Math.floor(audio.duration));
          }
        }
      }, 500);

      return () => clearInterval(timer);
    }, []);

    // Desbloqueia autoplay na primeira interação do usuário na página caso o navegador tenha bloqueado
    useEffect(() => {
      const unlockAudio = () => {
        if (userPausedManuallyRef.current || isPlaying) return;
        if (activeEngineRef.current === 'yt' && ytPlayerRef.current && ytReadyRef.current) {
          try {
            ytPlayerRef.current.playVideo();
          } catch {}
        } else if (activeEngineRef.current === 'html5' && htmlAudioRef.current) {
          htmlAudioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      };

      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      return () => {
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
    }, [isPlaying]);

    const handleTogglePlay = useCallback(() => {
      if (isPlaying) {
        userPausedManuallyRef.current = true;
        setIsPlaying(false);
        if (activeEngineRef.current === 'yt') {
          try {
            ytPlayerRef.current?.pauseVideo();
          } catch {}
        } else {
          htmlAudioRef.current?.pause();
        }
      } else {
        userPausedManuallyRef.current = false;
        setIsPlaying(true);
        if (activeEngineRef.current === 'yt' && ytPlayerRef.current && ytReadyRef.current) {
          try {
            ytPlayerRef.current.playVideo();
          } catch {}
        } else if (htmlAudioRef.current) {
          htmlAudioRef.current.play().catch(() => {});
        }
      }
    }, [isPlaying]);

    const handleToggleMute = useCallback(() => {
      const next = !isMutedRef.current;
      isMutedRef.current = next;
      setIsMuted(next);

      if (ytPlayerRef.current && ytReadyRef.current) {
        try {
          if (next) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        } catch {}
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.muted = next;
      }
    }, []);

    const handleSeekBarClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (durationSec <= 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const targetSec = Math.floor(ratio * durationSec);
        setProgressSec(targetSec);

        if (activeEngineRef.current === 'yt' && ytPlayerRef.current && ytReadyRef.current) {
          try {
            ytPlayerRef.current.seekTo(targetSec, true);
          } catch {}
        } else if (activeEngineRef.current === 'html5' && htmlAudioRef.current) {
          htmlAudioRef.current.currentTime = targetSec;
        }
      },
      [durationSec]
    );

    const handleSaveCustomUrl = (e: React.FormEvent) => {
      e.preventDefault();
      const cleaned = draftUrl.trim();
      if (!cleaned) return;
      setOverrideUrl(cleaned);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_OVERRIDE_KEY, cleaned);
      }
      setIsEditingUrl(false);
    };

    const handleResetToDefault = () => {
      setOverrideUrl('');
      setDraftUrl('');
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_OVERRIDE_KEY);
      }
      setIsEditingUrl(false);
    };

    const progressPct =
      durationSec > 0 ? Math.min(100, Math.round((progressSec / durationSec) * 100)) : 0;

    return (
      <div
        className={
          inHeader
            ? `w-[290px] xl:w-[330px] h-[48px] bg-[#FAF5FF] rounded-2xl border border-[#DDC7F8] px-2.5 py-1 shadow-2xs flex items-center justify-between gap-2.5 relative overflow-hidden ${className}`
            : `w-full h-[126px] bg-white rounded-3xl border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] p-3 flex flex-col justify-between relative overflow-hidden ${className}`
        }
      >
        {/* Motores de Áudio Invisíveis (Zero Iframe do Spotify = Zero Banner de 30s!) */}
        <div
          aria-hidden="true"
          className="fixed -left-[9999px] -top-[9999px] w-px h-px overflow-hidden pointer-events-none opacity-0"
        >
          <div ref={ytMountRef} />
          <audio
            ref={htmlAudioRef}
            preload="auto"
            onEnded={playNextRandomTrack}
            onError={playNextRandomTrack}
            onPlay={() => setIsPlaying(true)}
          />
        </div>

        {/* =================================================================
            MODO COMPACTO NO HEADER (DURANTE A PARTIDA)
           ================================================================= */}
        {inHeader ? (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-white border border-[#DDC7F8] shrink-0 flex items-center justify-center shadow-2xs">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={playlistTitle}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music2 className="w-4 h-4 text-[#9747FF]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {/* Barrinhas do equalizador no header */}
                  <span className="inline-flex items-end gap-[2px] h-2.5 shrink-0">
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#FF4A97] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-1' : 'scale-y-35'
                      }`}
                    />
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#9747FF] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-2' : 'scale-y-35'
                      }`}
                    />
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#FF4A97] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-3' : 'scale-y-35'
                      }`}
                    />
                  </span>
                  <span className="font-display text-xs text-[#330043] truncate">
                    {currentTrack?.title || 'Rádio MDX'}
                  </span>
                </div>

                {/* Mini barra de progresso no modo header */}
                <div
                  onClick={handleSeekBarClick}
                  className="w-full h-1 rounded-full bg-[#E9D8FD] overflow-hidden cursor-pointer mt-1"
                  title="Avançar na faixa"
                >
                  <div
                    style={{ width: `${progressPct}%` }}
                    className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFCD34] rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#9747FF] to-[#FF4A97] text-white flex items-center justify-center shadow-2xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pausar música' : 'Tocar música'}
                aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={playNextRandomTrack}
                className="w-7 h-7 rounded-xl bg-white hover:bg-[#F3E8FF] border border-[#DDC7F8] text-[#330043] flex items-center justify-center transition-colors cursor-pointer"
                title="Próxima música aleatória"
                aria-label="Próxima música aleatória"
              >
                <SkipForward className="w-3.5 h-3.5 text-[#9747FF]" />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="w-7 h-7 rounded-xl bg-white hover:bg-[#F3E8FF] border border-[#DDC7F8] text-[#6E4F7D] flex items-center justify-center transition-colors cursor-pointer"
                title={isMuted ? 'Ativar som da música' : 'Silenciar música'}
                aria-label={isMuted ? 'Ativar som da música' : 'Silenciar música'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#9747FF]" />
                )}
              </button>
            </div>
          </>
        ) : (
          /* =================================================================
              MODO CARD PRINCIPAL NA HOME (COLUNA DA DIREITA — PADRÃO MERMÃS)
             ================================================================= */
          <>
            {/* Detalhe suave de brilho Mermãs no canto do card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(221, 199, 248, 0.7) 0%, transparent 70%)',
              }}
            />

            {/* Linha 1: Selo Rádio Oficial com Equalizador + Ações Rápidas */}
            <div className="flex items-center justify-between gap-2 relative z-10">
              <div className="inline-flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-[11px] font-bold text-[#9747FF] uppercase tracking-wider shrink-0">
                  <span className="inline-flex items-end gap-[2px] h-2.5">
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#FF4A97] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-1' : 'scale-y-35'
                      }`}
                    />
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#9747FF] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-2' : 'scale-y-35'
                      }`}
                    />
                    <span
                      className={`w-[2.5px] h-full rounded-full bg-[#FF4A97] ${
                        isPlaying && !isMuted ? 'mdx-eq-bar-3' : 'scale-y-35'
                      }`}
                    />
                  </span>
                  <span>Rádio MDX</span>
                </span>

                <span className="text-xs font-bold text-[#6E4F7D] truncate">
                  {playlistTitle}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={playNextRandomTrack}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-[11px] font-bold text-[#330043] transition-colors cursor-pointer"
                  title="Sortear próxima música aleatória"
                >
                  <Shuffle className="w-3 h-3 text-[#9747FF]" />
                  <span>Aleatório</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="w-7 h-7 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] flex items-center justify-center text-[#330043] transition-colors cursor-pointer"
                  title={isMuted ? 'Ativar som da música' : 'Silenciar música'}
                  aria-label={isMuted ? 'Ativar som da música' : 'Silenciar música'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#9747FF]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDraftUrl(overrideUrl || envUrl);
                    setIsEditingUrl((v) => !v);
                  }}
                  className="w-7 h-7 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] hover:text-[#330043] transition-colors cursor-pointer"
                  title="Alterar playlist do Spotify"
                  aria-label="Alterar playlist do Spotify"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Linha 2: Deck Claro Mermãs Digitais (Capa + Faixa + Progresso + Play/Skip) */}
            <div className="flex items-center gap-3 px-2.5 py-2 rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD] relative z-10">
              {/* Capa da Playlist com Moldura Lilás */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#DDC7F8] shadow-2xs shrink-0 flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={playlistTitle}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music2 className="w-5 h-5 text-[#9747FF]" />
                )}
              </div>

              {/* Nome da Música, Artista e Barra de Progresso no Gradiente Oficial */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-sm lg:text-base text-[#330043] truncate leading-tight">
                    {currentTrack?.title || 'Carregando trilha...'}
                  </div>
                  <span className="font-orbitron text-[10px] font-bold text-[#6E4F7D] shrink-0">
                    {formatSeconds(progressSec)} / {formatSeconds(durationSec)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#9747FF] truncate mb-1.5">
                  {currentTrack?.subtitle || playlistTitle}
                </div>

                <div
                  onClick={handleSeekBarClick}
                  className="w-full h-2 rounded-full bg-white border border-[#DDC7F8] overflow-hidden cursor-pointer"
                  title="Clique para avançar na música"
                >
                  <div
                    style={{ width: `${progressPct}%` }}
                    className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFCD34] rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Botões Principais no Padrão Mermãs Digitais */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#FF4A97] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(255,74,151,0.28)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? 'Pausar música' : 'Tocar música'}
                  aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={playNextRandomTrack}
                  className="w-9 h-9 rounded-2xl bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] text-[#330043] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="Próxima música aleatória"
                  aria-label="Próxima música aleatória"
                >
                  <SkipForward className="w-4 h-4 text-[#9747FF]" />
                </button>
              </div>
            </div>

            {/* Overlay Embutido para Trocar URL da Playlist (Não altera a altura de 126px do card!) */}
            {isEditingUrl && (
              <form
                onSubmit={handleSaveCustomUrl}
                className="absolute inset-0 z-20 bg-white/98 backdrop-blur-md p-3 flex flex-col justify-between rounded-3xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#330043] flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#9747FF]" />
                    <span>Sincronizar Playlist do Spotify</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingUrl(false)}
                    className="w-6 h-6 rounded-lg bg-[#FAF5FF] border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] hover:text-[#330043] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftUrl}
                    onChange={(e) => setDraftUrl(e.target.value)}
                    placeholder="Cole o link https://open.spotify.com/playlist/..."
                    autoFocus
                    className="mermas-input flex-1 px-3 py-2 text-xs font-quicksand font-semibold min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-purple-pink text-white text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                  {overrideUrl && (
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="p-2 rounded-xl bg-[#FAF5FF] border border-[#DDC7F8] text-[#6E4F7D] hover:text-[#330043] flex items-center justify-center shrink-0 cursor-pointer"
                      title="Restaurar playlist padrão do .env"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    );
  }
);
