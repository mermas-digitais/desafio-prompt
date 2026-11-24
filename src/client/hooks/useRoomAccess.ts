import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getSocket, useGameStore } from '../store/useGameStore';
import { api } from '../lib/api';
import { useSearch } from '@tanstack/react-router';
import { canControlSession } from '../lib/sessionNavigation';

export interface RoomMetadata {
  roomCode: string; roomName: string;
  isOpen: boolean; phase: string; playersCount: number; roundToken: string;
  sessionsCount?: number;
}

export function useRoomAccess(roomCode: string) {
  const search = useSearch({ strict: false }) as { mode?: string };
  const state = useGameStore((store) => store.roomState);
  const user = useAuthStore((state) => state.user);
  const refreshMe = useAuthStore((state) => state.refresh);
  const [room, setRoom] = useState<RoomMetadata | null>(null);
  const refresh = useCallback(async () => {
    const { rooms } = await api<{ rooms: RoomMetadata[] }>('/api/rooms');
    setRoom(rooms.find((entry) => entry.roomCode === roomCode) || null);
  }, [roomCode]);
  useEffect(() => {
    setRoom(null);
    void refreshMe().catch(() => {});
    void refresh().catch(() => setRoom(null));
    const update = () => { void refresh().catch(() => setRoom(null)); void refreshMe().catch(() => {}); };
    const socket = getSocket();
    socket.on('rooms:updated', update);
    const timer = setInterval(update, 10000);
    return () => { socket.off('rooms:updated', update); clearInterval(timer); };
  }, [refresh, refreshMe]);
  const canManage = canControlSession(search.mode, user) && room?.roomCode === roomCode;
  const currentRoom = room?.roomCode === roomCode ? room : null;
  return { user, room: currentRoom && state.roomCode === roomCode && state.sessionId ? { ...currentRoom, isOpen: state.isOpen, phase: state.phase, roundToken: state.roundToken } : currentRoom, canManage, refresh };
}
