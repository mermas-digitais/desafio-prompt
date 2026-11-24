import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Zap } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';
import { RoomSessionsScreen } from './RoomSessionsScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { useTVUiStore } from '../store/useTVUiStore';
import { useNetworkConfig } from '../hooks/useNetworkConfig';
import { usePersistentRadioSlot } from '../hooks/usePersistentRadioSlot';
import { useTVSoundChoreography } from '../hooks/useTVSoundChoreography';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { EventFloatingAssets } from '../components/EventFloatingAssets';
import { SpotifyPlayerWidget } from '../components/SpotifyPlayerWidget';
import { TVRankingCard } from '../components/tv/TVRankingCard';
import { TVShowcaseGalleryBanner } from '../components/tv/TVShowcaseGalleryBanner';
import { TVQrCodeJoinCard } from '../components/tv/TVQrCodeJoinCard';
import { TVLobbyView } from '../components/tv/TVLobbyView';
import { TVCountdownView } from '../components/tv/TVCountdownView';
import { TVPlayingView } from '../components/tv/TVPlayingView';
import { TVEvaluatingView } from '../components/tv/TVEvaluatingView';
import { TVRevealingView } from '../components/tv/TVRevealingView';
import { TVPodiumView } from '../components/tv/TVPodiumView';
import { TVModerationModal } from '../components/tv/TVModerationModal';
import { canControlSession, parseTVMode } from '../lib/sessionNavigation';

export const TVScreen: React.FC = () => {
  const search = useSearch({ strict: false }) as { room?: string; session?: string };
  return search.session ? <ActiveTVScreen /> : <RoomSessionsScreen roomCode={(search.room || 'MDX26').toUpperCase().trim()} />;
};

const ActiveTVScreen: React.FC = () => {
  const roomState = useGameStore((s) => s.roomState);
  const phase = roomState.phase;
  const joinSessionRoom = useGameStore((s) => s.joinSessionRoom);
  const search = useSearch({ strict: false }) as { room?: string; session?: string; mode?: string };
  const { user, loaded, refresh } = useAuthStore();
  const mode = parseTVMode(search.mode);
  const canControl = canControlSession(mode, user);
  const requestedCode = (search.room || 'MDX26').toUpperCase().trim();
  const connectionError = useGameStore((s) => s.connectionError);

  const [isModerationOpen, setIsModerationOpen] = useState(false);

  const isMuted = useTVUiStore((s) => s.isMuted);
  const toggleMute = useTVUiStore((s) => s.toggleMute);
  const liveLockToast = useTVUiStore((s) => s.liveLockToast);
  const hintUnlockBanner = useTVUiStore((s) => s.hintUnlockBanner);

  useEffect(() => {
    joinSessionRoom(requestedCode, search.session);
  }, [joinSessionRoom, requestedCode, search.session]);
  useEffect(() => { void refresh().catch(() => {}); }, [refresh]);
  useEffect(() => { setIsModerationOpen(false); }, [mode, canControl, search.session]);
  useEffect(() => {
    const oldTitle = document.title;
    document.title = `${roomState.sessionName || 'Sessão'} · ${canControl ? 'Controlando' : mode === 'control' ? 'Acesso ao controle' : 'Assistindo'} · Desafio de Prompt`;
    return () => { document.title = oldTitle; };
  }, [roomState.sessionName, mode, canControl]);

  // Hooks modulares de URL local/produção, posicionamento persistente da rádio e coreografia sonora
  const { playUrl, playDisplayUrl } = useNetworkConfig();
  const { idleRadioSlotRef, headerRadioSlotRef, radioRect } = usePersistentRadioSlot(phase);
  useTVSoundChoreography();

  const isInGameHeaderMode = phase !== 'IDLE';

  const controlReturnTo = `/tv?${new URLSearchParams({ room: requestedCode, session: search.session || '', mode: 'control' })}`;
  if (roomState.sessionId !== search.session || roomState.roomCode !== requestedCode) return <main className="org-surface p-6 space-y-4">{connectionError ? <><h1 className="font-display text-2xl">Sessão indisponível</h1><p role="alert">{connectionError}</p></> : <p role="status">Conectando à sessão…</p>}<Link to="/tv" search={{ room: requestedCode }} className="org-button">Ver sessões desta sala</Link></main>;
  if (mode === 'control' && !canControl) return <main className="org-surface p-6 space-y-4"><h1 className="font-display text-2xl">{roomState.sessionName} · Controle da sessão</h1><p role="status">{!loaded ? 'Verificando sua conta…' : user?.mustChangePassword ? 'Conclua a troca inicial de senha para controlar esta sessão.' : 'Entre com uma conta da organização para controlar esta sessão.'}</p>{loaded && <Link to="/admin" search={{ returnTo: controlReturnTo }} className="org-button org-button-primary">{user ? 'Concluir meu acesso' : 'Entrar para controlar'}</Link>}<Link to="/tv" search={{ room: requestedCode, session: search.session, mode: 'watch' }} className="org-button">Só assistir</Link></main>;

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col bg-[#FAF7FF] text-[#330043] relative overflow-x-hidden lg:overflow-hidden select-none">
      {/* Cenário Arquitetural Mermãs Digitais • MDX STEAM 2026 */}
      <EventFloatingAssets
        variant="tv"
        showBunting={phase === 'IDLE' || phase === 'PODIUM'}
        intensity={phase === 'PLAYING' || phase === 'REVEALING' ? 'excited' : 'calm'}
      />

      {/* A moderação fica no cartão do QR Code; o cabeçalho mantém a rádio. */}
      <BandeirolasHeader
        mode="tv"
        isMuted={isMuted}
        onToggleMute={toggleMute}
        sessionInfo={<div className="min-w-0 max-w-[130px] sm:max-w-[240px] text-right leading-tight"><p className="text-xs text-[#330043] font-semibold truncate" title={`${roomState.roomName} / ${roomState.sessionName}`}>{roomState.sessionName}</p><p className="text-[10px] sm:text-xs text-[#6E4F7D]"><span>{requestedCode} · </span><Link to="/tv" search={{ room: requestedCode, session: search.session, mode: mode === 'watch' ? 'control' : 'watch' }} className="inline-flex items-center min-h-8 underline-offset-4 hover:underline" title={canControl ? 'Mudar para somente assistir' : 'Acessar controle da sessão'}>{canControl ? 'Controlando' : 'Assistindo'}</Link></p></div>}
        rightSlot={<Link to="/tv" search={{ room: requestedCode }} aria-label="Ver sessões desta sala" title="Ver sessões desta sala" className="inline-flex items-center justify-center w-8 h-8 text-[#6E4F7D] hover:text-[#330043]"><ArrowLeft size={16} aria-hidden="true" /></Link>}
        headerMusicSlot={isInGameHeaderMode ? <div
          ref={headerRadioSlotRef}
          className="hidden lg:block w-[290px] xl:w-[330px] h-[48px] shrink-0"
          aria-hidden="true"
        /> : undefined}
      />

      {/* =====================================================================
          INSTÂNCIA ÚNICA PERSISTENTE DO SPOTIFY PLAYER:
          - Em IDLE: Fica ancorada no TOPO da Coluna da Direita (acima do card "Escaneie para Jogar")
          - No Modo de Jogo (!== IDLE): Vai para o Header no topo direito e fica menor!
          Como é a mesma instância na árvore React, o iframe NUNCA recarrega!
         ===================================================================== */}
      <div
        style={
          radioRect
            ? {
                position: 'fixed',
                top: `${radioRect.top}px`,
                left: `${radioRect.left}px`,
                width: `${radioRect.width}px`,
              }
            : undefined
        }
        className={`hidden lg:block z-40 transition-all duration-300 ${
          radioRect
            ? ''
            : phase === 'IDLE'
            ? 'fixed top-20 right-6 lg:right-10 w-[340px] lg:w-[420px]'
            : 'fixed top-2 right-44 w-[300px]'
        }`}
      >
        <SpotifyPlayerWidget
          compact={isInGameHeaderMode}
          inHeader={isInGameHeaderMode}
          variant={isInGameHeaderMode ? 'header-compact' : 'home-banner'}
        />
      </div>

      {/* Dock Lateral de Notificações HUD Ao Vivo (Canto Inferior Direito — Não cobre Imagem nem Relógio!) */}
      <div className="pointer-events-none fixed bottom-5 right-6 z-50 flex flex-col items-end gap-2.5 max-w-md">
        <AnimatePresence>
          {hintUnlockBanner && phase === 'PLAYING' && (
            <motion.div
              key="hint-unlock-banner"
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md text-[#330043] shadow-[0_14px_34px_rgba(245,158,11,0.24)] border-2 border-amber-300 flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Nova Dica Desbloqueada
                </div>
                <div className="font-display text-xs md:text-sm text-[#330043] leading-snug">
                  “{hintUnlockBanner}”
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {liveLockToast && phase === 'PLAYING' && (
            <motion.div
              key="live-lock-toast"
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#330043] via-[#6B21A8] to-[#9747FF] text-white shadow-[0_14px_34px_rgba(151,71,255,0.34)] border-2 border-white/90 flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#FFCD34] animate-bounce" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFCD34]">
                  Prompt Travado na Arena
                </div>
                <div className="font-display text-xs md:text-sm text-white leading-snug">
                  {liveLockToast}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Container Widescreen 100vh Travado (Sem Scroll, Sem Vazar pelo Bottom e Sem Piscar a Tela!) */}
      <main className="max-w-[1840px] w-full mx-auto px-4 lg:px-8 py-3 flex-1 min-h-0 lg:overflow-hidden flex flex-col gap-3 relative z-10">
        <h1 className="sr-only">{roomState.roomName} / {roomState.sessionName} · {canControl ? 'Controlando' : 'Assistindo'}</h1>
        {connectionError && <p role="alert" className="bg-red-50 text-red-800 p-3 rounded-xl">{connectionError}</p>}
        {phase === 'IDLE' && (
          <motion.div
            key="phase-idle"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 lg:overflow-hidden"
          >
            {/* COLUNA ESQUERDA (8 cols): Ranking Geral + Galeria IA com Prompt Permanentemente Borrado */}
            <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col justify-between gap-3 min-h-0 lg:overflow-hidden">
              <TVRankingCard />
              <TVShowcaseGalleryBanner />
            </div>

            {/* COLUNA DIREITA (4 cols): Slot da Música no Topo + Card Escaneie para Jogar */}
            <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col justify-between gap-3 min-h-0 lg:overflow-hidden">
              <div
                ref={idleRadioSlotRef}
                className="hidden lg:block w-full h-[126px] shrink-0"
                aria-hidden="true"
              />
              <TVQrCodeJoinCard
                playUrl={playUrl}
                playDisplayUrl={playDisplayUrl}
                onOpenModeration={canControl ? () => setIsModerationOpen(true) : undefined}
              />
            </div>
          </motion.div>
        )}

        {phase === 'LOBBY' && <TVLobbyView playUrl={playUrl} onOpenModeration={canControl ? () => setIsModerationOpen(true) : undefined} />}

        {phase === 'COUNTDOWN' && <TVCountdownView />}

        {phase === 'PLAYING' && <TVPlayingView />}

        {phase === 'EVALUATING' && <TVEvaluatingView />}

        {phase === 'REVEALING' && <TVRevealingView />}

        {phase === 'PODIUM' && <TVPodiumView />}
      </main>

      {/* MODAL DE MODERAÇÃO E GESTÃO DE SESSÃO DA TV */}
      <TVModerationModal
        isOpen={isModerationOpen && canControl}
        onClose={() => setIsModerationOpen(false)}
        currentRoomCode={requestedCode}
      />
    </div>
  );
};
