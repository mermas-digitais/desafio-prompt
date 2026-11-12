import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, RotateCcw, Zap } from 'lucide-react';
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

export const TVScreen: React.FC = () => {
  const roomState = useGameStore((s) => s.roomState);
  const phase = roomState.phase;
  const initSocketConnection = useGameStore((s) => s.initSocketConnection);
  const joinSessionRoom = useGameStore((s) => s.joinSessionRoom);
  const resetRoom = useGameStore((s) => s.resetRoom);

  const [isModerationOpen, setIsModerationOpen] = useState(false);

  const isMuted = useTVUiStore((s) => s.isMuted);
  const toggleMute = useTVUiStore((s) => s.toggleMute);
  const liveLockToast = useTVUiStore((s) => s.liveLockToast);
  const hintUnlockBanner = useTVUiStore((s) => s.hintUnlockBanner);

  useEffect(() => {
    initSocketConnection();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom && urlRoom.toUpperCase() !== roomState.roomCode) {
        joinSessionRoom(urlRoom.toUpperCase());
      }
    }
  }, [initSocketConnection, joinSessionRoom, roomState.roomCode]);

  // Hooks modulares de URL local/produção, posicionamento persistente da rádio e coreografia sonora
  const { playUrl, playDisplayUrl } = useNetworkConfig();
  const { idleRadioSlotRef, headerRadioSlotRef, radioRect } = usePersistentRadioSlot(phase);
  useTVSoundChoreography();

  const isInGameHeaderMode = phase !== 'IDLE';

  return (
    <div className="h-screen max-h-screen w-screen flex flex-col bg-[#FAF7FF] text-[#330043] relative overflow-hidden select-none">
      {/* Cenário Arquitetural Mermãs Digitais • MDX STEAM 2026 */}
      <EventFloatingAssets
        variant="tv"
        showBunting={phase === 'IDLE' || phase === 'PODIUM'}
        intensity={phase === 'PLAYING' || phase === 'REVEALING' ? 'excited' : 'calm'}
      />

      {/* Cabeçalho Oficial Limpo (Moderação concentrada exclusivamente no Card lateral de QR Code) */}
      <BandeirolasHeader
        mode="tv"
        isMuted={isMuted}
        onToggleMute={toggleMute}
        rightSlot={
          <div className="flex items-center gap-2">
            {isInGameHeaderMode && (
              <>
                <div
                  ref={headerRadioSlotRef}
                  className="hidden lg:block w-[290px] xl:w-[330px] h-[48px] shrink-0"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => resetRoom()}
                  title="Voltar ao Ranking Geral"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF5FF] border border-[#DDC7F8] text-xs font-semibold text-[#330043] cursor-pointer transition-colors shadow-xs whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#9747FF]" />
                  <span className="hidden xl:inline">Reiniciar</span>
                </button>
              </>
            )}
          </div>
        }
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
        className={`z-40 transition-all duration-300 ${
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
      <main className="max-w-[1840px] w-full mx-auto px-5 lg:px-8 py-3 flex-1 min-h-0 overflow-hidden flex flex-col justify-between relative z-10">
        {phase === 'IDLE' && (
          <motion.div
            key="phase-idle"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 overflow-hidden"
          >
            {/* COLUNA ESQUERDA (8 cols): Ranking Geral + Galeria IA com Prompt Permanentemente Borrado */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-3 min-h-0 overflow-hidden">
              <TVRankingCard />
              <TVShowcaseGalleryBanner />
            </div>

            {/* COLUNA DIREITA (4 cols): Slot da Música no Topo + Card Escaneie para Jogar */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3 min-h-0 overflow-hidden">
              <div
                ref={idleRadioSlotRef}
                className="w-full h-[126px] shrink-0"
                aria-hidden="true"
              />
              <TVQrCodeJoinCard
                playUrl={playUrl}
                playDisplayUrl={playDisplayUrl}
                onOpenModeration={() => setIsModerationOpen(true)}
              />
            </div>
          </motion.div>
        )}

        {phase === 'LOBBY' && <TVLobbyView playUrl={playUrl} />}

        {phase === 'COUNTDOWN' && <TVCountdownView />}

        {phase === 'PLAYING' && <TVPlayingView />}

        {phase === 'EVALUATING' && <TVEvaluatingView />}

        {phase === 'REVEALING' && <TVRevealingView />}

        {phase === 'PODIUM' && <TVPodiumView />}
      </main>

      {/* MODAL DE MODERAÇÃO E GESTÃO DE SESSÃO DA TV */}
      <TVModerationModal
        isOpen={isModerationOpen}
        onClose={() => setIsModerationOpen(false)}
        currentRoomCode={roomState.roomCode}
      />
    </div>
  );
};
