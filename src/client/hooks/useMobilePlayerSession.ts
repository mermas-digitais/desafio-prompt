import React, { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { usePlayerSessionStore } from '../store/usePlayerSessionStore';
import { DEFAULT_CREATIVE_SUGGESTIONS } from '../helpers/formatters';
import { resizeImageToSquareDataUrl } from '../helpers/imageHelpers';
import {
  playJoinSound,
  playLockInSound,
  playTypingPulseSound,
  playLayerCompleteSound,
  playUrgentTickSound,
  playRecordBreakerSound,
  playVictoryFanfare,
  playAchievementUnlockSound,
  playLevelUpPowerSound,
  fireCelebrationConfetti,
} from '../lib/soundEngine';
import {
  ACHIEVEMENTS_CATALOG,
  getCareerAchievements,
  getPlayerPowerTier,
  type AchievementId,
} from '../../shared/achievements';

export function useMobilePlayerSession() {
  const roomState = useGameStore((s) => s.roomState);
  const initSocketConnection = useGameStore((s) => s.initSocketConnection);
  const identifyDevice = useGameStore((s) => s.identifyDevice);
  const registerPlayer = useGameStore((s) => s.registerPlayer);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const leaveRoom = useGameStore((s) => s.leaveRoom);
  const sendTypingDraft = useGameStore((s) => s.sendTypingDraft);
  const submitPrompt = useGameStore((s) => s.submitPrompt);

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
    isLocallyUnlocked,
    isExpiredQr,
    expiredRoundData,
    setProfile,
    setNickname,
    setSelectedAvatar,
    setIsEditingProfile,
    setErrorMsg,
    setSuggestions,
    setIsSubmittingJoin,
    setPromptText,
    setIsLocallyUnlocked,
    setIsExpiredQr,
    setExpiredRoundData,
    syncFromServerProfile,
    resetRoundDraft,
  } = usePlayerSessionStore();

  const prevWordCountRef = useRef<number>(0);

  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const currentUrlRoom = (searchParams?.get('room') || 'MDX26').toUpperCase().trim();
  const currentUrlRound = (searchParams?.get('round') || '').trim();

  useEffect(() => {
    initSocketConnection();
    // Conecta o socket à sala indicada na URL
    useGameStore.getState().joinSessionRoom(currentUrlRoom);
  }, [initSocketConnection, currentUrlRoom]);

  // Valida o QR code / token de rodada via API
  useEffect(() => {
    if (currentUrlRound) {
      fetch(
        `/api/rounds/validate?room=${encodeURIComponent(currentUrlRoom)}&round=${encodeURIComponent(
          currentUrlRound
        )}`
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((res) => {
          if (res && res.status === 'EXPIRED') {
            setIsExpiredQr(true);
            if (res.roundData) setExpiredRoundData(res.roundData);
          } else if (res && res.status === 'ACTIVE') {
            setIsExpiredQr(false);
            setExpiredRoundData(null);
          }
        })
        .catch(() => {});
    }
  }, [currentUrlRoom, currentUrlRound, setIsExpiredQr, setExpiredRoundData]);

  // Identifica dispositivo automaticamente ao abrir /play
  useEffect(() => {
    identifyDevice(deviceId, currentUrlRoom).then((res) => {
      if (res?.ok && res.profile) {
        syncFromServerProfile(res.profile);
      }
    });
  }, [deviceId, currentUrlRoom, identifyDevice, syncFromServerProfile]);

  // Sincroniza estatísticas quando uma rodada termina ou reseta rascunho na contagem
  useEffect(() => {
    if (
      roomState.phase === 'REVEALING' ||
      roomState.phase === 'PODIUM' ||
      roomState.phase === 'IDLE'
    ) {
      identifyDevice(deviceId, currentUrlRoom).then((res) => {
        if (res?.ok && res.profile) {
          setProfile(res.profile);
        }
      });
    }
    if (roomState.phase === 'COUNTDOWN') {
      resetRoundDraft();
      prevWordCountRef.current = 0;
    }
  }, [roomState.phase, deviceId, currentUrlRoom, identifyDevice, setProfile, resetRoundDraft]);

  const myRoomSlot = roomState.players.find((p) => p.deviceId === deviceId);
  const myEvaluation = roomState.evaluations.find(
    (ev) => ev.slot === myRoomSlot?.slot || ev.nickname === profile?.nickname
  );

  // Tick musical suave nos últimos 5s da partida
  useEffect(() => {
    if (
      roomState.phase === 'PLAYING' &&
      myRoomSlot &&
      !myRoomSlot.hasLockedPrompt &&
      roomState.roundTimeLeft > 0 &&
      roomState.roundTimeLeft <= 5
    ) {
      playUrgentTickSound(roomState.roundTimeLeft);
    }
  }, [roomState.phase, roomState.roundTimeLeft, myRoomSlot]);

  // Celebração sonora de Subida de Título, Conquistas, Vitória ou Novo Recorde no celular
  useEffect(() => {
    if (roomState.phase === 'REVEALING' && myEvaluation) {
      if (myEvaluation.leveledUpTitle) {
        playLevelUpPowerSound();
      } else if (myEvaluation.roundAchievements && myEvaluation.roundAchievements.length > 0) {
        const firstId = myEvaluation.roundAchievements[0] as AchievementId;
        const rarity = ACHIEVEMENTS_CATALOG[firstId]?.rarity || 'raro';
        playAchievementUnlockSound(rarity);
      }
    }
    if (roomState.phase === 'PODIUM' && myEvaluation) {
      if (myEvaluation.isWinner) {
        playVictoryFanfare();
      } else if (myEvaluation.isNewHighScore || myEvaluation.totalScore > 750) {
        playRecordBreakerSound();
      }
    }
  }, [roomState.phase, myEvaluation]);

  const handlePhotoUploadChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const dataUrl = await resizeImageToSquareDataUrl(file);
        setSelectedAvatar(dataUrl);
      } catch {
        setErrorMsg('Não foi possível processar essa foto. Tente outra imagem.');
      } finally {
        e.target.value = '';
      }
    },
    [setSelectedAvatar, setErrorMsg]
  );

  const handleSaveOrJoin = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setErrorMsg(null);
      setIsSubmittingJoin(true);

      try {
        const regRes = await registerPlayer({
          deviceId,
          nickname: nickname.trim(),
          avatar: selectedAvatar,
        });

        if (!regRes.ok) {
          setErrorMsg(regRes.error || 'Escolha outro apelido para continuar.');
          setSuggestions(
            regRes.suggestions && regRes.suggestions.length > 0
              ? regRes.suggestions
              : DEFAULT_CREATIVE_SUGGESTIONS
          );
          setIsSubmittingJoin(false);
          return;
        }

        if (regRes.profile) {
          syncFromServerProfile(regRes.profile);
        }

        setIsEditingProfile(false);

        if (roomState.phase === 'IDLE' || roomState.phase === 'LOBBY') {
          const joinRes = await joinRoom({
            deviceId,
            nickname: regRes.profile?.nickname || nickname.trim(),
            avatar: selectedAvatar,
            roomCode: currentUrlRoom,
            roundToken: currentUrlRound,
          });

          if (!joinRes.ok) {
            if (joinRes.expired) {
              setIsExpiredQr(true);
              if (joinRes.roundData) setExpiredRoundData(joinRes.roundData);
              setErrorMsg(
                joinRes.error || 'Este QR Code expirou! A rodada foi finalizada no telão.'
              );
            } else {
              setErrorMsg(
                joinRes.error || 'A sala está cheia no momento. Aguarde a próxima rodada!'
              );
              if (joinRes.suggestions) setSuggestions(joinRes.suggestions);
            }
          } else {
            setIsExpiredQr(false);
            playJoinSound();
          }
        }
      } finally {
        setIsSubmittingJoin(false);
      }
    },
    [
      deviceId,
      nickname,
      selectedAvatar,
      currentUrlRoom,
      currentUrlRound,
      roomState.phase,
      registerPlayer,
      joinRoom,
      setErrorMsg,
      setSuggestions,
      setIsSubmittingJoin,
      setIsEditingProfile,
      setIsExpiredQr,
      setExpiredRoundData,
      syncFromServerProfile,
    ]
  );

  const handlePromptChange = useCallback(
    (val: string) => {
      const sliced = val.slice(0, 320);
      setPromptText(sliced);
      sendTypingDraft(deviceId, sliced, currentUrlRoom);

      const words = sliced.trim().split(/\s+/).filter(Boolean).length;
      const prevWords = prevWordCountRef.current;
      if (words > prevWords) {
        if (words === 5 && prevWords < 5) {
          playLayerCompleteSound(1);
        } else if (words === 11 && prevWords < 11) {
          playLayerCompleteSound(2);
        } else if (words === 16 && prevWords < 16) {
          playLayerCompleteSound(3);
        } else {
          playTypingPulseSound();
        }
      }
      prevWordCountRef.current = words;
    },
    [deviceId, currentUrlRoom, sendTypingDraft, setPromptText]
  );

  const handleLockPrompt = useCallback(async () => {
    if (!promptText.trim()) return;
    const res = await submitPrompt(deviceId, promptText.trim(), currentUrlRoom, currentUrlRound);
    if (res.ok) {
      setIsLocallyUnlocked(false);
      playLockInSound();
      fireCelebrationConfetti('normal');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  }, [deviceId, promptText, currentUrlRoom, currentUrlRound, submitPrompt, setIsLocallyUnlocked, setErrorMsg]);

  const handleLeaveCurrentRoom = useCallback(async () => {
    return leaveRoom(deviceId, currentUrlRoom);
  }, [deviceId, currentUrlRoom, leaveRoom]);

  const myPowerTier = getPlayerPowerTier(
    profile || { highScore: 0, totalScore: 0, winsCount: 0, matchesPlayed: 0 }
  );
  const myAchievements = getCareerAchievements(profile || {});
  const isLocked = Boolean(myRoomSlot?.hasLockedPrompt && !isLocallyUnlocked);

  return {
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
    leaveRoom: handleLeaveCurrentRoom,
    handlePhotoUploadChange,
    handleSaveOrJoin,
    handlePromptChange,
    handleLockPrompt,
  };
}
