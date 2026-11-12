import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ensurePlayerSession, useGameStore } from '../store/useGameStore';
import { selectOwnEvaluation, selectOwnPlayer } from '../lib/sessionHelpers';
import { useSearch } from '@tanstack/react-router';
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
  const isConnected = useGameStore((s) => s.isConnected);
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

  const search = useSearch({ strict: false }) as { room?: string; round?: string };
  const currentUrlRoom = (search.room || 'MDX26').toUpperCase().trim();
  const currentUrlRound = (search.round || '').trim();

  useEffect(() => {
    let active = true;
    usePlayerSessionStore.setState({ profile: null, promptText: '', isLocallyUnlocked: false, isExpiredQr: false, expiredRoundData: null, isEditingProfile: false, isZoomOpen: false, isRankingModalOpen: false, errorMsg: null });
    ensurePlayerSession().then(async (id) => {
      if (!active) return;
      usePlayerSessionStore.setState({ deviceId: id });
      useGameStore.getState().joinSessionRoom(currentUrlRoom);
      const response = await identifyDevice(id, currentUrlRoom);
      if (!active) return;
      if (response.ok && response.profile) syncFromServerProfile(response.profile);
      else setProfile(null);
    }).catch((error) => { if (active) setErrorMsg(error instanceof Error ? error.message : 'Não foi possível iniciar sua sessão privada. Recarregue a página.'); });
    return () => { active = false; };
  }, [currentUrlRoom, identifyDevice, syncFromServerProfile, setProfile, setErrorMsg]);

  // Valida o QR code / token de rodada via API
  useEffect(() => {
    const controller = new AbortController();
    if (currentUrlRound) {
      fetch(
        `/api/rounds/validate?room=${encodeURIComponent(currentUrlRoom)}&round=${encodeURIComponent(
          currentUrlRound
        )}`, { signal: controller.signal }
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((res) => {
          if (res && res.status === 'ROOM_CLOSED') {
            setErrorMsg('As entradas desta sala estão fechadas. Quem já participa pode continuar.');
          } else if (res && res.status === 'EXPIRED') {
            setIsExpiredQr(true);
            if (res.roundData) setExpiredRoundData(res.roundData);
          } else if (res && res.status === 'ACTIVE') {
            setIsExpiredQr(false);
            setExpiredRoundData(null);
          }
        })
        .catch((error) => { if (!controller.signal.aborted) setErrorMsg('Não foi possível validar o QR. Confira a conexão e recarregue.'); });
    }
    return () => controller.abort();
  }, [currentUrlRoom, currentUrlRound, setIsExpiredQr, setExpiredRoundData, setErrorMsg]);

  // Sincroniza estatísticas quando uma rodada termina ou reseta rascunho na contagem
  useEffect(() => {
    if (!deviceId || !isConnected || roomState.roomCode !== currentUrlRoom) return;
    let active = true;
    identifyDevice(deviceId, currentUrlRoom).then((res) => {
      if (active && res?.ok) setProfile(res.profile || null);
      else if (active && res.error) setErrorMsg(res.error);
    }).catch((error) => { if (active) setErrorMsg(error.message); });
    if (roomState.phase === 'COUNTDOWN') {
      resetRoundDraft();
      prevWordCountRef.current = 0;
    }
    return () => { active = false; };
  }, [roomState.phase, roomState.roomCode, isConnected, deviceId, currentUrlRoom, identifyDevice, setProfile, resetRoundDraft, setErrorMsg]);

  const roomProfile = profile?.roomCode === currentUrlRoom ? profile : null;
  const myRoomSlot = selectOwnPlayer(roomState, roomProfile);
  const myEvaluation = selectOwnEvaluation(roomState, roomProfile);

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
        if (!currentUrlRound && !myRoomSlot) { setErrorMsg('Scanneie o QR Code da rodada no telão para entrar nesta sala.'); return; }
        const regRes = await registerPlayer({
          deviceId,
          roomCode: currentUrlRoom,
          roundToken: currentUrlRound,
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
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.');
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
      myRoomSlot,
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
    // Only an already identified participant may resume without a fresh QR URL.
    const token = currentUrlRound || (myRoomSlot ? roomState.roundToken : '');
    if (!token) { setErrorMsg('Escaneie o QR atual do telão antes de enviar um palpite.'); return; }
    const res = await submitPrompt(deviceId, promptText.trim(), currentUrlRoom, token);
    if (res.ok) {
      setIsLocallyUnlocked(false);
      playLockInSound();
      fireCelebrationConfetti('normal');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  }, [deviceId, promptText, currentUrlRoom, currentUrlRound, myRoomSlot, roomState.roundToken, submitPrompt, setIsLocallyUnlocked, setErrorMsg]);

  const handleLeaveCurrentRoom = useCallback(async () => {
    return leaveRoom(deviceId, currentUrlRoom);
  }, [deviceId, currentUrlRoom, leaveRoom]);

  const myPowerTier = useMemo(() => getPlayerPowerTier(
    roomProfile || { highScore: 0, totalScore: 0, winsCount: 0, matchesPlayed: 0 }
  ), [roomProfile]);
  const myAchievements = useMemo(() => getCareerAchievements(roomProfile || {}), [roomProfile]);
  const isLocked = Boolean(myRoomSlot?.hasLockedPrompt && !isLocallyUnlocked);

  return {
    deviceId,
    profile: roomProfile,
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
