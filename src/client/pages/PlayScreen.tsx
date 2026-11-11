import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { usePlayerSessionStore } from '../store/usePlayerSessionStore';
import { useMobilePlayerSession } from '../hooks/useMobilePlayerSession';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { EventFloatingAssets } from '../components/EventFloatingAssets';
import { PlayProfileCard } from '../components/play/PlayProfileCard';
import { PlayLobbyCard } from '../components/play/PlayLobbyCard';
import { PlayActiveRoundView } from '../components/play/PlayActiveRoundView';
import { PlayResultView } from '../components/play/PlayResultView';
import { PlayImageZoomModal, PlayRankingModal } from '../components/play/PlayModals';

export const PlayScreen: React.FC = () => {
  const phase = useGameStore((s) => s.roomState.phase);
  const countdownLeft = useGameStore((s) => s.roomState.countdownLeft);
  const setIsZoomOpen = usePlayerSessionStore((s) => s.setIsZoomOpen);
  const setIsRankingModalOpen = usePlayerSessionStore((s) => s.setIsRankingModalOpen);

  const {
    deviceId,
    profile,
    nickname,
    selectedAvatar,
    isEditingProfile,
    errorMsg,
    suggestions,
    isSubmittingJoin,
    promptText,
    isLocked,
    myRoomSlot,
    myEvaluation,
    myPowerTier,
    myAchievements,
    setNickname,
    setSelectedAvatar,
    setIsEditingProfile,
    setErrorMsg,
    setIsLocallyUnlocked,
    leaveRoom,
    handlePhotoUploadChange,
    handleSaveOrJoin,
    handlePromptChange,
    handleLockPrompt,
  } = useMobilePlayerSession();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FAF7FF] text-[#330043] relative overflow-x-hidden pb-10">
      <EventFloatingAssets
        variant="mobile"
        intensity={phase === 'PLAYING' ? 'excited' : 'calm'}
      />

      <BandeirolasHeader
        compact
        mode="play"
        rightSlot={
          <button
            type="button"
            onClick={() => setIsRankingModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-quicksand font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Ranking</span>
          </button>
        }
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 flex flex-col gap-4 relative z-10">
        {/* 1. ENTRADA / PERFIL */}
        {(!myRoomSlot || isEditingProfile) && phase !== 'REVEALING' && phase !== 'PODIUM' && (
          <PlayProfileCard
            profile={profile}
            nickname={nickname}
            selectedAvatar={selectedAvatar}
            isEditingProfile={isEditingProfile}
            errorMsg={errorMsg}
            suggestions={suggestions}
            isSubmittingJoin={isSubmittingJoin}
            myPowerTier={myPowerTier}
            myAchievements={myAchievements}
            onSetNickname={setNickname}
            onSetSelectedAvatar={setSelectedAvatar}
            onSetIsEditingProfile={setIsEditingProfile}
            onClearError={() => setErrorMsg(null)}
            onPhotoUploadChange={handlePhotoUploadChange}
            onSaveOrJoin={handleSaveOrJoin}
          />
        )}

        {/* 2. LOBBY NO CELULAR */}
        {myRoomSlot && !isEditingProfile && phase === 'LOBBY' && (
          <PlayLobbyCard
            myRoomSlot={myRoomSlot}
            myPowerTier={myPowerTier}
            onLeaveRoom={() => leaveRoom(deviceId)}
          />
        )}

        {/* 3. CONTAGEM REGRESSIVA (3, 2, 1) */}
        {myRoomSlot && phase === 'COUNTDOWN' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mermas-card p-8 flex flex-col items-center text-center gap-3"
          >
            <span className="px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#DDC7F8] text-xs font-quicksand font-bold text-[#9854CB]">
              Slot #{myRoomSlot.slot} • Prepare-se!
            </span>
            <div className="font-display text-6xl text-[#FF4A97] my-2">
              {countdownLeft > 0 ? countdownLeft : 'Valendo!'}
            </div>
            <p className="font-quicksand text-sm font-semibold text-[#545454]">
              Observe a imagem e descreva o sujeito, o estilo e o cenário!
            </p>
          </motion.div>
        )}

        {/* 4. HORA DO JOGO */}
        {myRoomSlot && phase === 'PLAYING' && (
          <PlayActiveRoundView
            deviceId={deviceId}
            myRoomSlot={myRoomSlot}
            promptText={promptText}
            isLocked={isLocked}
            onPromptChange={handlePromptChange}
            onLockPrompt={handleLockPrompt}
            onUnlockForEdit={() => setIsLocallyUnlocked(true)}
            onOpenZoom={() => setIsZoomOpen(true)}
          />
        )}

        {/* 5. AVALIANDO PALPITES */}
        {phase === 'EVALUATING' && (
          <div className="mermas-card p-8 text-center flex flex-col items-center gap-4">
            <img
              src="/marca/ia.svg"
              alt="Mermã IA"
              decoding="async"
              className="w-20 h-20 object-contain mdx-float"
            />
            <h2 className="font-display text-2xl text-[#330043]">Analisando seu palpite...</h2>
            <p className="font-quicksand text-sm text-[#545454]">
              Olhe para o Telão da TV para acompanhar a revelação das notas e conquistas!
            </p>
          </div>
        )}

        {/* 6. RESULTADO INDIVIDUAL */}
        {(phase === 'REVEALING' || phase === 'PODIUM') && (
          <PlayResultView
            myEvaluation={myEvaluation}
            myPowerTier={myPowerTier}
            onOpenRanking={() => setIsRankingModalOpen(true)}
          />
        )}
      </main>

      <PlayImageZoomModal />
      <PlayRankingModal />
    </div>
  );
};
