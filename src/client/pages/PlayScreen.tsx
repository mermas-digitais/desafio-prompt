import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Crown, History, Share2, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { usePlayerSessionStore } from '../store/usePlayerSessionStore';
import { useMobilePlayerSession } from '../hooks/useMobilePlayerSession';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { EventFloatingAssets } from '../components/EventFloatingAssets';
import { PlayProfileCard } from '../components/play/PlayProfileCard';
import { PlayLobbyCard } from '../components/play/PlayLobbyCard';
import { PlayActiveRoundView } from '../components/play/PlayActiveRoundView';
import { PlayResultView } from '../components/play/PlayResultView';
import { PlayMobilePodium } from '../components/play/PlayMobilePodium';
import { PlayRoomRoundRanking } from '../components/play/PlayRoomRoundRanking';
import { PlayShareCardStudio } from '../components/play/PlayShareCardStudio';
import { PlayPersonalMatchHistory } from '../components/play/PlayPersonalMatchHistory';
import { PlayMatchHistoryModal } from '../components/play/PlayMatchHistoryModal';
import { PlayImageZoomModal, PlayRankingModal } from '../components/play/PlayModals';
import { getAvatarMeta, isCustomPhotoAvatar } from '../components/AvatarBadge';
import { ACHIEVEMENTS_CATALOG, type AchievementId } from '../../shared/achievements';
import {
  getPersonalMatchHistory,
  savePersonalMatch,
  type SavedPersonalMatch,
} from '../lib/personalMatchHistory';
import type { PlayerRoundEvaluation } from '../../shared/types';
import type { ShareCardAchievement, ShareCardData } from '../lib/shareCardRenderer';

interface ActivePodiumSession {
  matchId: string;
  evaluations: PlayerRoundEvaluation[];
  myEvaluation: PlayerRoundEvaluation;
  shareData: ShareCardData;
  timeLeft: number; // Contagem de 60s
}

export const PlayScreen: React.FC = () => {
  const phase = useGameStore((s) => s.roomState.phase);
  const countdownLeft = useGameStore((s) => s.roomState.countdownLeft);
  const evaluations = useGameStore((s) => s.roomState.evaluations);
  const currentRevealIndex = useGameStore((s) => s.roomState.currentRevealIndex);
  const challenge = useGameStore((s) => s.roomState.challenge);
  const setIsZoomOpen = usePlayerSessionStore((s) => s.setIsZoomOpen);
  const setIsRankingModalOpen = usePlayerSessionStore((s) => s.setIsRankingModalOpen);
  const [shareData, setShareData] = useState<ShareCardData | null>(null);
  const [isShareStudioOpen, setIsShareStudioOpen] = useState(false);

  // Sessão local do Pódio no celular (permanece 60s mesmo que a TV volte para IDLE após 10s)
  const [activePodiumSession, setActivePodiumSession] = useState<ActivePodiumSession | null>(null);
  const [personalHistory, setPersonalHistory] = useState<SavedPersonalMatch[]>([]);
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState<SavedPersonalMatch | null>(null);

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

  // Carrega histórico pessoal de partidas gravadas no celular
  useEffect(() => {
    if (deviceId) {
      setPersonalHistory(getPersonalMatchHistory(deviceId));
    }
  }, [deviceId]);

  // Captura um "snapshot" enriquecido do resultado para o card compartilhável.
  useEffect(() => {
    if ((phase !== 'REVEALING' && phase !== 'PODIUM') || !myEvaluation) return;
    const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
    const rank = Math.max(1, sorted.findIndex((ev) => ev.playerId === myEvaluation.playerId) + 1);
    const avatar = myEvaluation.avatar;

    // Conquistas ganhas nesta rodada ou catálogo de conquistas desbloqueadas
    const roundAchIds: string[] =
      myEvaluation.roundAchievements && myEvaluation.roundAchievements.length > 0
        ? myEvaluation.roundAchievements
        : myAchievements || [];

    const activeAchList: ShareCardAchievement[] = roundAchIds
      .map((id) => ACHIEVEMENTS_CATALOG[id as AchievementId])
      .filter(Boolean)
      .map((a) => ({
        id: a.id,
        title: a.title,
        rarity: a.rarity,
        powerBonus: a.powerBonus,
      }));

    const totalRoundPwr = activeAchList.reduce((acc, a) => acc + (a.powerBonus || 0), 0);
    const totalPwr = totalRoundPwr > 0 ? totalRoundPwr : (myPowerTier?.powerScore || 0);

    setShareData({
      nickname: myEvaluation.nickname,
      avatarSrc: isCustomPhotoAvatar(avatar) ? String(avatar) : getAvatarMeta(avatar).src,
      tierTitle: myEvaluation.newTitle || myPowerTier.title,
      powerLevel: myEvaluation.newPowerLevel || myPowerTier.level,
      totalPwr,
      rank,
      totalPlayers: evaluations.length,
      totalScore: myEvaluation.totalScore,
      subjectScore: myEvaluation.subjectScore,
      styleScore: myEvaluation.styleScore,
      detailsScore: myEvaluation.detailsScore,
      speedBonus: myEvaluation.speedBonus,
      isNewHighScore: myEvaluation.isNewHighScore,
      challengeTitle: challenge?.title || 'Arte gerada por IA',
      challengeImageUrl: challenge?.imageUrl || '',
      achievements: activeAchList,
    });
  }, [phase, myEvaluation, evaluations, challenge, myPowerTier, myAchievements]);

  // Inicia sessão de pódio de 1 minuto no celular e grava no histórico
  useEffect(() => {
    if (phase === 'PODIUM' && myEvaluation && evaluations.length > 0 && shareData) {
      const matchId = `match-${challenge?.id || 'round'}-${myEvaluation.playerId}-${myEvaluation.totalScore}`;
      setActivePodiumSession((prev) => {
        if (prev && prev.matchId === matchId) return prev;
        return {
          matchId,
          evaluations: [...evaluations],
          myEvaluation,
          shareData,
          timeLeft: 60,
        };
      });

      // Grava no histórico pessoal local
      const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
      const myRank = Math.max(1, sorted.findIndex((ev) => ev.playerId === myEvaluation.playerId) + 1);
      const savedItem: SavedPersonalMatch = {
        id: matchId,
        timestamp: Date.now(),
        challenge: {
          id: challenge?.id || 'default',
          title: challenge?.title || 'Arte gerada por IA',
          imageUrl: challenge?.imageUrl || '',
          fullPrompt: challenge?.fullPrompt,
        },
        myEvaluation,
        allEvaluations: evaluations,
        myRank,
        totalPlayers: evaluations.length,
        shareData,
      };
      savePersonalMatch(deviceId, savedItem);
      setPersonalHistory(getPersonalMatchHistory(deviceId));
    }
  }, [phase, myEvaluation, evaluations, shareData, challenge, deviceId]);

  // Contagem regressiva de 60 segundos no celular para permanência no pódio
  useEffect(() => {
    if (!activePodiumSession) return;
    const interval = setInterval(() => {
      setActivePodiumSession((prev) => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          return null; // 1 min expirou -> volta ao lobby
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activePodiumSession]);

  // Se o jogador entrar em uma nova rodada (COUNTDOWN ou PLAYING), limpa a sessão de pódio anterior
  useEffect(() => {
    if (phase === 'COUNTDOWN' || phase === 'PLAYING') {
      setActivePodiumSession(null);
    }
  }, [phase]);

  // Define se o celular deve renderizar a visualização de pódio / resultado
  const isShowingPodium = Boolean(activePodiumSession) || (phase === 'PODIUM' && Boolean(myEvaluation));
  const activeEvals = activePodiumSession ? activePodiumSession.evaluations : evaluations;
  const activeMyEval = activePodiumSession ? activePodiumSession.myEvaluation : myEvaluation;
  const activeShare = activePodiumSession ? activePodiumSession.shareData : shareData;

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
        {/* 0. CONTROLE SUPERIOR DE PERMANÊNCIA DO PÓDIO (60s + Voltar ao Lobby) */}
        {isShowingPodium && activePodiumSession && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-[#DDC7F8] shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-amber-500" />
              </span>
              <div className="min-w-0 text-left">
                <div className="font-display text-xs text-[#330043] leading-tight">
                  Pódio da sua Partida
                </div>
                <div className="font-quicksand text-[11px] text-[#6E4F7D]">
                  Tela ativa por mais <strong className="text-[#9747FF]">{activePodiumSession.timeLeft}s</strong>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActivePodiumSession(null)}
              className="px-3.5 py-1.5 rounded-xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-[#4C1D95] font-quicksand font-bold text-xs cursor-pointer transition-colors shrink-0"
            >
              Voltar ao Lobby
            </button>
          </motion.div>
        )}

        {/* 🌟 BOTÃO DE DESTAQUE NO TOPO: COMPARTILHAR CONQUISTA NO INSTAGRAM STORIES */}
        {(phase === 'REVEALING' || isShowingPodium) && activeMyEval && (
          <motion.button
            type="button"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (activeShare) setShareData(activeShare);
              setIsShareStudioOpen(true);
            }}
            className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white shadow-[0_10px_28px_rgba(253,29,29,0.32)] border-2 border-white/40 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-white/90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  <span>Card Oficial MDX26</span>
                </div>
                <div className="font-display text-sm sm:text-base text-white leading-tight truncate">
                  Postar no Instagram Stories
                </div>
                <div className="font-quicksand text-[11px] text-white/90 truncate">
                  {activeMyEval.totalScore} pts • {activeShare?.rank ? `${activeShare.rank}º lugar na sala` : 'Resultado pronto'}
                </div>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#9747FF] font-display text-xs font-bold shrink-0 shadow-md">
              Abrir
            </span>
          </motion.button>
        )}

        {/* 1. PÓDIO NO CELULAR (EXIBE 1º, 2º E 3º LUGAR COM DEGRAUS E COROAS) */}
        {isShowingPodium && activeMyEval && activeEvals.length > 0 && (
          <PlayMobilePodium
            evaluations={activeEvals}
            myPlayerId={activeMyEval.playerId}
            onOpenShareCard={() => {
              if (activeShare) setShareData(activeShare);
              setIsShareStudioOpen(true);
            }}
          />
        )}

        {/* 2. RESULTADO INDIVIDUAL DA JOGADORA (NOTAS, CAMADAS, FEEDBACK E CONQUISTAS) */}
        {(phase === 'REVEALING' || isShowingPodium) && activeMyEval && (
          <PlayResultView
            myEvaluation={activeMyEval}
            myPowerTier={myPowerTier}
            onOpenRanking={() => setIsRankingModalOpen(true)}
            onOpenShareCard={() => {
              if (activeShare) setShareData(activeShare);
              setIsShareStudioOpen(true);
            }}
          />
        )}

        {/* 3. PONTUAÇÃO GERAL DA SALA: ACOMPANHA O TELÃO DA TV COM DESTAQUE DA VEZ */}
        {(phase === 'REVEALING' || isShowingPodium) && activeEvals.length > 0 && (
          <PlayRoomRoundRanking
            evaluations={activeEvals}
            myPlayerId={activeMyEval?.playerId}
            currentRevealIndex={currentRevealIndex}
            phase={phase}
          />
        )}

        {/* 4. BOTÃO AMPLO DE VOLTAR AO LOBBY NA BASE DO PÓDIO */}
        {isShowingPodium && activePodiumSession && (
          <button
            type="button"
            onClick={() => setActivePodiumSession(null)}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#F5F0FF] border-2 border-[#DDC7F8] font-display text-sm text-[#4C1D95] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#9747FF]" />
            <span>Voltar ao Lobby para Próxima Partida ({activePodiumSession.timeLeft}s)</span>
          </button>
        )}

        {/* ========================================================================= */}
        {/* ÁREA DE LOBBY / JOGO (QUANDO NÃO ESTIVER NO PÓDIO ATIVO)                   */}
        {/* ========================================================================= */}

        {/* ENTRADA / PERFIL DO JOGADOR */}
        {!isShowingPodium && (!myRoomSlot || isEditingProfile) && phase !== 'REVEALING' && (
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

        {/* LOBBY NO CELULAR (ESPERANDO ADVERSÁRIOS) */}
        {!isShowingPodium && myRoomSlot && !isEditingProfile && phase === 'LOBBY' && (
          <PlayLobbyCard
            myRoomSlot={myRoomSlot}
            myPowerTier={myPowerTier}
            onLeaveRoom={() => leaveRoom(deviceId)}
          />
        )}

        {/* CONTAGEM REGRESSIVA (3, 2, 1) */}
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

        {/* HORA DO JOGO */}
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

        {/* AVALIANDO PALPITES PELA MERMÃ IA */}
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

        {/* 📜 HISTÓRICO DE ÚLTIMAS PARTIDAS NO LOBBY (ABAIXO DO CARD DO USUÁRIO) */}
        {!isShowingPodium && phase !== 'REVEALING' && phase !== 'COUNTDOWN' && phase !== 'PLAYING' && (
          <PlayPersonalMatchHistory
            history={personalHistory}
            onSelectMatch={setSelectedHistoryMatch}
          />
        )}
      </main>

      <PlayImageZoomModal />
      <PlayRankingModal />
      <PlayMatchHistoryModal
        match={selectedHistoryMatch}
        onClose={() => setSelectedHistoryMatch(null)}
        onOpenShareCard={(data) => {
          setShareData(data);
          setIsShareStudioOpen(true);
        }}
      />
      <PlayShareCardStudio
        isOpen={isShareStudioOpen}
        data={shareData}
        onClose={() => setIsShareStudioOpen(false)}
      />
    </div>
  );
};

