import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getSocket } from '../store/useGameStore';
import { api } from '../lib/api';

export interface RoomMetadata {
  roomCode: string; roomName: string; moderatorId: string | null;
  isOpen: boolean; phase: string; playersCount: number; roundToken: string;
}

export function useRoomAccess(roomCode: string) {
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
  const canManage = Boolean(user && !user.mustChangePassword && room?.roomCode === roomCode && (user.role === 'admin' || room.moderatorId === user.id));
  return { user, room: room?.roomCode === roomCode ? room : null, canManage, refresh };
}
