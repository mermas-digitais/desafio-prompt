import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, History, Share2, Sparkles, Trophy } from 'lucide-react';
import { InstagramLogoIcon } from '../components/InstagramLogoIcon';
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
import { PlayExpiredQrView } from '../components/play/PlayExpiredQrView';
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
  roomCode: string;
  profileId: string;
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
  const roomName = useGameStore((s) => s.roomState.roomName);
  const roundId = useGameStore((s) => s.roomState.roundId);
  const roomIsOpen = useGameStore((s) => s.roomState.isOpen);
  const connectionError = useGameStore((s) => s.connectionError);
  const kickedReason = useGameStore((s) => s.kickedReason);
  const setKickedReason = useGameStore((s) => s.setKickedReason);
  const setIsZoomOpen = usePlayerSessionStore((s) => s.setIsZoomOpen);
  const setIsRankingModalOpen = usePlayerSessionStore((s) => s.setIsRankingModalOpen);
  const [shareData, setShareData] = useState<ShareCardData | null>(null);
  const [shareRoundId, setShareRoundId] = useState('');
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
    isExpiredQr,
    expiredRoundData,
    currentUrlRoom,
    currentUrlRound,
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
    setShareData(null); setShareRoundId(''); setIsShareStudioOpen(false); setActivePodiumSession(null); setSelectedHistoryMatch(null);
    setPersonalHistory(profile?.roomCode === currentUrlRoom ? getPersonalMatchHistory(currentUrlRoom, profile.id) : []);
  }, [currentUrlRoom, profile?.id]);

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
    setShareRoundId(roundId);
  }, [phase, myEvaluation, evaluations, challenge, myPowerTier, myAchievements, roundId]);

  // Inicia sessão de pódio de 1 minuto no celular e grava no histórico
  useEffect(() => {
    if (phase === 'PODIUM' && myEvaluation && evaluations.length > 0 && shareData && roundId && shareRoundId === roundId && profile?.roomCode === currentUrlRoom) {
      const matchId = roundId;
      setActivePodiumSession((prev) => {
        if (prev && prev.matchId === matchId) return prev;
        return {
          matchId,
          roomCode: currentUrlRoom,
          profileId: profile.id,
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
        roomCode: currentUrlRoom,
        roundId,
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
      savePersonalMatch(currentUrlRoom, profile.id, savedItem);
      setPersonalHistory(getPersonalMatchHistory(currentUrlRoom, profile.id));
    }
  }, [phase, myEvaluation, evaluations, shareData, shareRoundId, challenge, currentUrlRoom, roundId, profile?.id]);

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
  const ownPodium = activePodiumSession?.roomCode === currentUrlRoom && activePodiumSession?.profileId === profile?.id ? activePodiumSession : null;
  const isShowingPodium = Boolean(ownPodium) || (phase === 'PODIUM' && Boolean(myEvaluation));
  const activeEvals = ownPodium ? ownPodium.evaluations : evaluations;
  const activeMyEval = ownPodium ? ownPodium.myEvaluation : myEvaluation;
  const activeShare = ownPodium ? ownPodium.shareData : shareRoundId === roundId ? shareData : null;

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
        {connectionError && <p role="alert" className="mermas-card p-4 text-red-800">{connectionError}</p>}
        {errorMsg && <p role="alert" className="mermas-card p-4 text-red-800">{errorMsg}</p>}
        {!myRoomSlot && !roomIsOpen && <section className="mermas-card p-5 space-y-2"><h2 className="font-display text-xl">Entradas fechadas</h2><p>A sala {currentUrlRoom} não recebe novas participantes agora. Quem já entrou pode continuar a rodada. Aguarde a organização reabrir as entradas.</p></section>}
        {!myRoomSlot && roomIsOpen && !currentUrlRound && <section className="mermas-card p-5 space-y-2"><h2 className="font-display text-xl">Escaneie o QR da rodada</h2><p>Abra o telão da sala {currentUrlRoom} e escaneie o QR atual para entrar. Este link não contém o código da rodada.</p></section>}
        {!profile && <p className="text-sm text-[#6E4F7D]">Sua participação usa uma sessão privada neste navegador. Se o progresso antigo não aparecer, peça à organização a recuperação. Os dados e o histórico antigos foram preservados.</p>}
        {deviceId && <details className="mermas-card p-4 text-sm"><summary className="cursor-pointer min-h-11">Recuperar progresso anterior</summary><p className="mb-3">Mostre este código à administração e peça a verificação do vínculo anterior. Não crie outro perfil nesta sala antes da recuperação. O código identifica este navegador; não substitui sua sessão privada.</p><label className="block">Código de recuperação<input className="mermas-input w-full px-3 py-2" value={deviceId} readOnly onFocus={(event) => event.target.select()} /></label><button className="min-h-11 px-3 mt-2 rounded-xl border border-[#DDC7F8]" onClick={() => { void navigator.clipboard?.writeText(deviceId).catch(() => setErrorMsg('Não foi possível copiar. Selecione o código e copie manualmente.')); }}>Copiar código</button></details>}
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
            className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white shadow-[0_10px_28px_rgba(220,39,67,0.35)] border-2 border-white/40 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <InstagramLogoIcon className="w-5 h-5 text-white" />
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
            <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#dc2743] font-display text-xs font-bold shrink-0 shadow-md">
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

        {/* ALERTA DE KICK / EXPULSÃO PELO MODERADOR */}
        {kickedReason && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mermas-card p-4 border-red-300 bg-red-50 text-red-900 flex items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="text-xs font-quicksand">
                <strong className="font-bold block text-sm text-red-950">
                  Removido da sala pelo moderador
                </strong>
                <span className="text-red-800">{kickedReason}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setKickedReason(null)}
              className="px-3 py-1.5 rounded-xl bg-red-200 hover:bg-red-300 font-quicksand font-bold text-xs text-red-950 transition-colors shrink-0"
            >
              Entendido
            </button>
          </motion.div>
        )}

        {/* QR CODE EXPIRADO (QUANDO A RODADA JÁ ENCERROU OU QR É ANTIGO) */}
        {!isShowingPodium && isExpiredQr && !myRoomSlot && roomIsOpen && (
          <PlayExpiredQrView
            roomName={roomName}
            roomCode={currentUrlRoom}
            roundToken={currentUrlRound}
            profile={profile}
            myPowerTier={myPowerTier}
            myAchievements={myAchievements}
            expiredRoundData={expiredRoundData}
            onRefreshCheck={() => window.location.reload()}
            onViewPodium={
              expiredRoundData && profile && expiredRoundData.evaluations.some((evaluation) => evaluation.playerId === profile.id)
                ? () => {
                    const myEv =
                      expiredRoundData.evaluations.find((e) => e.playerId === profile.id);
                    if (myEv) {
                      const sorted = [...expiredRoundData.evaluations].sort(
                        (a, b) => b.totalScore - a.totalScore
                      );
                      const myRank = Math.max(
                        1,
                        sorted.findIndex((e) => e.playerId === myEv.playerId) + 1
                      );
                      const fallbackShare: ShareCardData = {
                        nickname: myEv.nickname,
                        avatarSrc: isCustomPhotoAvatar(myEv.avatar)
                          ? String(myEv.avatar)
                          : getAvatarMeta(myEv.avatar).src,
                        tierTitle: myPowerTier.title,
                        powerLevel: myPowerTier.level,
                        totalPwr: myPowerTier.powerScore,
                        rank: myRank,
                        totalPlayers: expiredRoundData.evaluations.length,
                        totalScore: myEv.totalScore,
                        subjectScore: myEv.subjectScore,
                        styleScore: myEv.styleScore,
                        detailsScore: myEv.detailsScore,
                        speedBonus: myEv.speedBonus,
                        isNewHighScore: myEv.isNewHighScore,
                        challengeTitle: expiredRoundData.challengeTitle,
                        challengeImageUrl: expiredRoundData.challengeImageUrl,
                        achievements: [],
                      };
                      setSelectedHistoryMatch({
                        id: expiredRoundData.roundId,
                        roomCode: currentUrlRoom,
                        roundId: expiredRoundData.roundId,
                        timestamp: new Date(expiredRoundData.finishedAt).getTime() || Date.now(),
                        challenge: {
                          id: expiredRoundData.roundId,
                          title: expiredRoundData.challengeTitle,
                          imageUrl: expiredRoundData.challengeImageUrl,
                        },
                        myEvaluation: myEv,
                        allEvaluations: expiredRoundData.evaluations,
                        myRank,
                        totalPlayers: expiredRoundData.evaluations.length,
                        shareData: fallbackShare,
                      });
                    }
                  }
                : undefined
            }
          />
        )}

        {/* ENTRADA / PERFIL DO JOGADOR (QUANDO QR VÁLIDO E NÃO ESTIVER NA SALA) */}
        {!isShowingPodium && !isExpiredQr && (Boolean(myRoomSlot) || (roomIsOpen && Boolean(currentUrlRound))) && (!myRoomSlot || isEditingProfile) && phase !== 'REVEALING' && (
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
            onLeaveRoom={() => leaveRoom()}
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
            history={personalHistory.filter((match) => match.roomCode === currentUrlRoom && match.myEvaluation.playerId === profile?.id)}
            onSelectMatch={setSelectedHistoryMatch}
          />
        )}
      </main>

      <PlayImageZoomModal />
      <PlayRankingModal />
      <PlayMatchHistoryModal
        match={selectedHistoryMatch?.roomCode === currentUrlRoom && selectedHistoryMatch?.myEvaluation.playerId === profile?.id ? selectedHistoryMatch : null}
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
