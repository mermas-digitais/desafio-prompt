import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useTVUiStore } from '../store/useTVUiStore';
import { getPromptWordCount } from '../helpers/formatters';
import { preloadChallengeImage } from '../helpers/imageHelpers';
import {
  playJoinSound,
  playBotSpawnSound,
  playCountdownBeep,
  playTypingPulseSound,
  playLockInSound,
  playHintUnlockSound,
  playUrgentTickSound,
  playTimeUpBuzzer,
  playVictoryFanfare,
  playWordRevealSparkleSound,
  playTimeMilestoneSound,
  playLayerCompleteSound,
  playAllLockedSound,
  playAiThinkingSound,
  fireCelebrationConfetti,
} from '../lib/soundEngine';
import type { RoomPlayer } from '../../shared/types';

export function useTVSoundChoreography() {
  const roomState = useGameStore((s) => s.roomState);
  const liveLockToast = useTVUiStore((s) => s.liveLockToast);
  const hintUnlockBanner = useTVUiStore((s) => s.hintUnlockBanner);
  const setLiveLockToast = useTVUiStore((s) => s.setLiveLockToast);
  const setHintUnlockBanner = useTVUiStore((s) => s.setHintUnlockBanner);

  const prevPhaseRef = useRef(roomState.phase);
  const prevPlayersRef = useRef<RoomPlayer[]>(roomState.players);
  const prevHintsCountRef = useRef(roomState.challenge?.unlockedHints.length || 0);
  const prevRevealedTokensRef = useRef(0);
  const prevCountdownRef = useRef(roomState.countdownLeft);
  const prevRoundTimeRef = useRef(roomState.roundTimeLeft);
  const prevTotalWordsRef = useRef(0);
  const prevSlotStageRef = useRef<Record<number, number>>({});

  // Pré-carrega a imagem do desafio assim que a sala entra em COUNTDOWN ou PLAYING
  useEffect(() => {
    if (roomState.challenge?.imageUrl) {
      preloadChallengeImage(roomState.challenge.imageUrl);
    }
  }, [roomState.challenge?.imageUrl]);

  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const currentPhase = roomState.phase;
    const prevPlayers = prevPlayersRef.current;

    // Detecta entrada de novos jogadores ou bots no lobby
    if (roomState.players.length > prevPlayers.length) {
      const addedPlayers = roomState.players.filter(
        (p) => !prevPlayers.some((old) => old.id === p.id)
      );
      const hasNewBot = addedPlayers.some((p) => p.isBot);
      if (hasNewBot) {
        playBotSpawnSound();
      } else {
        playJoinSound();
      }
    }

    // Detecta quem acabou de travar o prompt ou avançar de estágio durante PLAYING
    if (currentPhase === 'PLAYING') {
      let newlyLockedCount = 0;
      roomState.players.forEach((p) => {
        const oldPlayer = prevPlayers.find((old) => old.slot === p.slot);
        if (p.hasLockedPrompt && (!oldPlayer || !oldPlayer.hasLockedPrompt)) {
          newlyLockedCount += 1;
          playLockInSound();
          const sec = p.lockedAtRemainingSeconds ?? roomState.roundTimeLeft;
          setLiveLockToast(`${p.nickname} travou o prompt aos ${sec}s! A pressão aumentou!`);
        }

        // Som quando um participante completa uma camada de estruturação do prompt (5, 11, 16 palavras)
        const wc = getPromptWordCount(p.submittedPrompt);
        const stage = wc >= 16 ? 3 : wc >= 11 ? 2 : wc >= 5 ? 1 : 0;
        const prevStage = prevSlotStageRef.current[p.slot] || 0;
        if (stage > prevStage && !p.hasLockedPrompt) {
          playLayerCompleteSound(stage as 1 | 2 | 3);
        }
        prevSlotStageRef.current[p.slot] = stage;
      });

      // Se todos os 3 participantes da sala acabaram de travar seus prompts antes do tempo zerar
      if (
        newlyLockedCount > 0 &&
        roomState.players.length > 0 &&
        roomState.players.every((p) => p.hasLockedPrompt)
      ) {
        setTimeout(() => playAllLockedSound(), 180);
      }

      const currentTotalWords = roomState.players.reduce(
        (acc, p) => acc + getPromptWordCount(p.submittedPrompt),
        0
      );
      if (currentTotalWords > prevTotalWordsRef.current) {
        playTypingPulseSound();
      }
      prevTotalWordsRef.current = currentTotalWords;

      // Detecta desembaçamento progressivo de palavras do prompt original na TV
      const revealedCount =
        roomState.challenge?.maskedPromptTokens.filter((t) => t.isRevealed).length || 0;
      if (revealedCount > prevRevealedTokensRef.current && prevRevealedTokensRef.current > 0) {
        playWordRevealSparkleSound();
      }
      prevRevealedTokensRef.current = revealedCount;
    } else {
      prevTotalWordsRef.current = 0;
      prevRevealedTokensRef.current = 0;
      prevSlotStageRef.current = {};
    }

    prevPlayersRef.current = roomState.players;

    // Desbloqueio de nova dica na arena
    const hintsCount = roomState.challenge?.unlockedHints.length || 0;
    if (hintsCount > prevHintsCountRef.current && currentPhase === 'PLAYING') {
      playHintUnlockSound();
      const latestHint = roomState.challenge?.unlockedHints[hintsCount - 1];
      setHintUnlockBanner(latestHint || 'Nova dica desbloqueada na arena!');
    }
    prevHintsCountRef.current = hintsCount;

    // Contagem regressiva 3, 2, 1
    if (currentPhase === 'COUNTDOWN') {
      if (prevPhase !== 'COUNTDOWN' || roomState.countdownLeft !== prevCountdownRef.current) {
        playCountdownBeep(roomState.countdownLeft <= 1);
      }
    }
    prevCountdownRef.current = roomState.countdownLeft;

    if (currentPhase === 'PLAYING' && prevPhase === 'COUNTDOWN') {
      playCountdownBeep(true);
    }

    // Marcos de tempo (60s, 30s, 15s), tick urgente nos últimos 5s e buzzer ao zerar
    if (currentPhase === 'PLAYING' && roomState.roundTimeLeft !== prevRoundTimeRef.current) {
      if (
        roomState.roundTimeLeft === 60 ||
        roomState.roundTimeLeft === 30 ||
        roomState.roundTimeLeft === 15
      ) {
        playTimeMilestoneSound(roomState.roundTimeLeft);
      } else if (roomState.roundTimeLeft <= 5 && roomState.roundTimeLeft > 0) {
        playUrgentTickSound(roomState.roundTimeLeft);
      } else if (roomState.roundTimeLeft === 0 && prevRoundTimeRef.current > 0) {
        playTimeUpBuzzer();
      }
    }
    prevRoundTimeRef.current = roomState.roundTimeLeft;

    // Início da avaliação semântica por IA
    if (currentPhase === 'EVALUATING' && prevPhase !== 'EVALUATING') {
      playAiThinkingSound();
    }

    // Pódio final
    if (currentPhase === 'PODIUM' && prevPhase !== 'PODIUM') {
      playVictoryFanfare();
      fireCelebrationConfetti('high');
    }

    prevPhaseRef.current = currentPhase;
  }, [
    roomState.phase,
    roomState.players,
    roomState.countdownLeft,
    roomState.roundTimeLeft,
    roomState.challenge?.unlockedHints,
    roomState.challenge?.maskedPromptTokens,
    setLiveLockToast,
    setHintUnlockBanner,
  ]);

  useEffect(() => {
    if (!liveLockToast) return;
    const t = setTimeout(() => setLiveLockToast(null), 3800);
    return () => clearTimeout(t);
  }, [liveLockToast, setLiveLockToast]);

  useEffect(() => {
    if (!hintUnlockBanner) return;
    const t = setTimeout(() => setHintUnlockBanner(null), 3500);
    return () => clearTimeout(t);
  }, [hintUnlockBanner, setHintUnlockBanner]);
}
