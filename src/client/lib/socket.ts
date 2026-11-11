import { useEffect } from 'react';
import {
  useGameStore,
  getSocket,
  getOrCreateDeviceId,
  type IdentifyResponse,
  type RegisterResponse,
  type JoinRoomResponse,
} from '../store/useGameStore';

export {
  getSocket,
  getOrCreateDeviceId,
  type IdentifyResponse,
  type RegisterResponse,
  type JoinRoomResponse,
};

export function useGameRoom() {
  const roomState = useGameStore((s) => s.roomState);
  const isConnected = useGameStore((s) => s.isConnected);
  const initSocketConnection = useGameStore((s) => s.initSocketConnection);
  const identifyDevice = useGameStore((s) => s.identifyDevice);
  const registerPlayer = useGameStore((s) => s.registerPlayer);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const leaveRoom = useGameStore((s) => s.leaveRoom);
  const sendTypingDraft = useGameStore((s) => s.sendTypingDraft);
  const submitPrompt = useGameStore((s) => s.submitPrompt);
  const startWithBotsNow = useGameStore((s) => s.startWithBotsNow);
  const resetRoom = useGameStore((s) => s.resetRoom);
  const clearRanking = useGameStore((s) => s.clearRanking);

  useEffect(() => {
    initSocketConnection();
  }, [initSocketConnection]);

  return {
    roomState,
    isConnected,
    identifyDevice,
    registerPlayer,
    joinRoom,
    leaveRoom,
    sendTypingDraft,
    submitPrompt,
    startWithBotsNow,
    resetRoom,
    clearRanking,
  };
}
