import React, { useEffect, useRef } from 'react';
import { useGlobalRadio } from '../hooks/useGlobalRadio';
import { estimatedRadioTime, useRadioStore } from '../store/useRadioStore';
import { radioPosition } from '../../shared/radio';

interface RadioYTPlayer {
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate?: (suggestedRate: number) => void;
  getPlaybackRate?: () => number;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}
interface RadioYTApi {
  Player: new (mount: HTMLElement, options: {
    width: number; height: number; playerVars: Record<string, string | number>;
    events: { onReady: () => void; onStateChange: (event: { data: number }) => void; onError: () => void; onAutoplayBlocked: () => void };
  }) => RadioYTPlayer;
}
declare global { interface Window { YT?: RadioYTApi; onYouTubeIframeAPIReady?: () => void } }

/** Persistent playback survives room, session and mode navigation. No client owns the queue. */
export function RadioPlayback() {
  useGlobalRadio();
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<RadioYTPlayer | null>(null);
  const ready = useRef(false);
  const loadedRevision = useRef('');
  const loadedVideo = useRef('');
  const failedRevision = useRef('');
  const lastSeekAt = useRef(0);
  const startupSettled = useRef(false);

  useEffect(() => {
    let alive = true, blockedTimer: ReturnType<typeof setTimeout> | undefined;
    const block = () => { if (alive) useRadioStore.setState({ blocked: true, playing: false }); };
    const setRate = (engine: RadioYTPlayer, rate: number) => {
      if (typeof engine.setPlaybackRate === 'function' && engine.getPlaybackRate?.() !== rate) {
        engine.setPlaybackRate(rate);
      }
    };
    const reconcile = (forceImmediateSync = false) => {
      const { station, paused, muted, blocked } = useRadioStore.getState();
      const engine = player.current;
      if (!ready.current || !engine) return;
      try {
        if (muted) engine.mute(); else { engine.unMute(); engine.setVolume(85); }
        if (!station?.track || station.status !== 'playing' || paused) {
          setRate(engine, 1);
          engine.pauseVideo();
          useRadioStore.setState({ playing: false });
          return;
        }
        const key = `${station.epoch}:${station.revision}`;
        if (failedRevision.current === key) return;
        const target = radioPosition(station, estimatedRadioTime());
        const videoKey = `${station.epoch}:${station.track.videoId}`;
        const playerState = engine.getPlayerState();
        if (loadedVideo.current !== videoKey) {
          loadedVideo.current = videoKey;
          loadedRevision.current = key;
          startupSettled.current = false;
          setRate(engine, 1);
          engine.loadVideoById(station.track.videoId, target);
          clearTimeout(blockedTimer);
          blockedTimer = setTimeout(() => {
            if (alive && !useRadioStore.getState().paused && engine.getPlayerState() === -1) block();
          }, 6000);
        } else {
          const revisionChanged = loadedRevision.current !== key;
          loadedRevision.current = key;
          if (playerState === 1 || revisionChanged || forceImmediateSync) {
            const actual = engine.getCurrentTime();
            const drift = actual - target; // positive = ahead of live clock, negative = behind
            const absDrift = Math.abs(drift);
            const nowMs = performance.now();
            const hardThreshold = forceImmediateSync || revisionChanged ? 0.22 : 0.35;
            if (absDrift > hardThreshold && (forceImmediateSync || revisionChanged || nowMs - lastSeekAt.current > 2500)) {
              lastSeekAt.current = nowMs;
              setRate(engine, 1);
              // Compensate slightly (~120ms) for YouTube iframe seek/rebuffer latency so both TVs land closer together
              const compensated = Math.min(station.track.durationSec, target + 0.12);
              engine.seekTo(compensated, true);
            } else if (playerState === 1 && absDrift > 0.08 && absDrift <= hardThreshold) {
              // Gentle playback-rate nudge closes sub-350ms drift smoothly without audible rebuffer pops
              setRate(engine, drift < 0 ? 1.05 : 0.95);
            } else {
              setRate(engine, 1);
            }
          }
        }
        if (!blocked && playerState !== 1 && playerState !== 3) engine.playVideo();
      } catch { useRadioStore.setState({ playing: false, error: 'Não foi possível reproduzir aqui. Tente reconectar à rádio.' }); }
    };
    const init = () => {
      if (!alive || !mount.current || !window.YT?.Player || player.current) return;
      player.current = new window.YT.Player(mount.current, {
        width: 200, height: 200,
        playerVars: { autoplay: 1, controls: 1, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: () => { if (alive) { ready.current = true; reconcile(true); } },
          onStateChange: ({ data }) => {
            if (!alive) return;
            const current = useRadioStore.getState();
            const nativePause = data === 2 && current.playing && !current.paused && current.station?.status === 'playing';
            useRadioStore.setState({ playing: data === 1, ...(nativePause ? { paused: true } : {}), ...(data === 1 ? { blocked: false, error: null, paused: false } : {}) });
            // Re-lock right after initial buffering finishes (data === 1) so startup latency doesn't leave a ~1s offset.
            if (data === 1 && !startupSettled.current) {
              startupSettled.current = true;
              setTimeout(() => { if (alive) reconcile(true); }, 180);
            }
            // ENDED never advances the shared station; only the server selects the next track.
          },
          onError: () => {
            if (!alive) return;
            failedRevision.current = loadedRevision.current;
            useRadioStore.setState({ playing: false, error: 'Esta faixa não pôde tocar neste acesso. A rádio global continua; tente reconectar.' });
          },
          onAutoplayBlocked: block,
        },
      });
    };
    const previousReady = window.onYouTubeIframeAPIReady;
    const apiReady = () => { previousReady?.(); init(); };
    window.onYouTubeIframeAPIReady = apiReady;
    if (window.YT?.Player) init();
    else if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true; document.head.appendChild(script);
    }
    const unsubscribe = useRadioStore.subscribe((state, previous) => {
      if (state.activation !== previous.activation) { failedRevision.current = ''; loadedRevision.current = ''; loadedVideo.current = ''; startupSettled.current = false; }
      if (state.station !== previous.station || state.activation !== previous.activation || state.paused !== previous.paused || state.muted !== previous.muted) reconcile();
    });
    const timer = setInterval(() => reconcile(false), 750);
    const unlock = () => { const state = useRadioStore.getState(); if (state.blocked && !state.paused) useRadioStore.setState({ blocked: false, activation: state.activation + 1 }); };
    const visible = () => { if (document.visibilityState === 'visible') reconcile(true); };
    window.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('visibilitychange', visible);
    return () => {
      alive = false; unsubscribe(); clearInterval(timer); clearTimeout(blockedTimer);
      window.removeEventListener('pointerdown', unlock); document.removeEventListener('visibilitychange', visible);
      if (window.onYouTubeIframeAPIReady === apiReady) window.onYouTubeIframeAPIReady = previousReady;
      player.current?.destroy(); player.current = null; ready.current = false; loadedRevision.current = ''; loadedVideo.current = '';
    };
  }, []);

  // Visible official player: unlike the old 1px hidden iframe, this respects the minimum viewport.
  return <div aria-label="Player YouTube da rádio global" className="w-[200px] h-[200px] mx-auto bg-black"><div ref={mount} /></div>;
}
