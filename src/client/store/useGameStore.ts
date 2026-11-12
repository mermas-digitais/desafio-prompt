import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import type {
  AvatarId,
  ExpiredRoundSummary,
  GameRoomState,
  PlayerProfile,
  PlayerSlot,
} from '../../shared/types';

export const DEFAULT_ROOM_STATE: GameRoomState = {
  roomCode: 'MDX26',
  roomName: 'Arena MDX Principal',
  isOpen: true,
  roundId: 'init-round',
  roundToken: 'rt-init',
  phase: 'IDLE',
  lobbyTimeLeft: 90,
  roundTimeLeft: 90,
  countdownLeft: 3,
  blurPx: 16,
  players: [],
  challenge: null,
  evaluations: [],
  currentRevealIndex: 0,
  revealStepTimer: 8,
  leaderboards: {
    general: [],
    points: [],
    wins: [],
    stats: {
      totalPlayers: 0,
      totalMatches: 0,
      highestScoreEver: 0,
    },
  },
};

export interface IdentifyResponse {
  ok: boolean;
  profile: PlayerProfile | null;
  state: GameRoomState;
}

export interface RegisterResponse {
  ok: boolean;
  profile?: PlayerProfile;
  error?: string;
  suggestions?: string[];
}

export interface JoinRoomResponse {
  ok: boolean;
  slot?: PlayerSlot;
  profile?: PlayerProfile;
  error?: string;
  expired?: boolean;
  roundData?: ExpiredRoundSummary;
  suggestions?: string[];
  state: GameRoomState;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'mdx26-ssr-device';
  const STORAGE_KEY = 'mdx26_device_id';
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      id = `mdx26-${crypto.randomUUID()}`;
    } else {
      id = `mdx26-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

let socketSingleton: Socket | null = null;
let socketBoundToStore = false;

export function getSocket(): Socket {
  if (!socketSingleton) {
    const url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
    socketSingleton = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 600,
    });
  }
  return socketSingleton;
}

interface GameStoreState {
  roomState: GameRoomState;
  isConnected: boolean;
  isSyncing: boolean;
  kickedReason: string | null;
  setRoomState: (nextState: GameRoomState) => void;
  setIsConnected: (connected: boolean) => void;
  setIsSyncing: (syncing: boolean) => void;
  setKickedReason: (reason: string | null) => void;
  initSocketConnection: () => void;
  joinSessionRoom: (roomCode: string) => void;
  openRoom: (params: {
    roomCode: string;
    name: string;
    password?: string;
  }) => Promise<{ ok: boolean; error?: string; state?: GameRoomState }>;
  closeRoom: (params: {
    roomCode?: string;
    password?: string;
  }) => Promise<{ ok: boolean; error?: string; state?: GameRoomState }>;
  kickPlayer: (params: {
    roomCode?: string;
    playerId: string;
    slot?: PlayerSlot;
    reason?: string;
    password?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  identifyDevice: (deviceId: string, roomCode?: string) => Promise<IdentifyResponse>;
  registerPlayer: (params: {
    deviceId: string;
    nickname: string;
    avatar: AvatarId;
    roomCode?: string;
  }) => Promise<RegisterResponse>;
  joinRoom: (params: {
    deviceId: string;
    nickname?: string;
    avatar?: AvatarId;
    roomCode?: string;
    roundToken?: string;
  }) => Promise<JoinRoomResponse>;
  leaveRoom: (deviceId: string, roomCode?: string) => Promise<{ ok: boolean }>;
  sendTypingDraft: (deviceId: string, draftPrompt: string, roomCode?: string) => void;
  submitPrompt: (
    deviceId: string,
    prompt: string,
    roomCode?: string,
    roundToken?: string
  ) => Promise<{ ok: boolean; state: GameRoomState; error?: string }>;
  startWithBotsNow: (roomCode?: string) => Promise<{ ok: boolean }>;
  resetRoom: (roomCode?: string) => Promise<{ ok: boolean }>;
  clearRanking: (password?: string, roomCode?: string) => Promise<{ ok: boolean; error?: string }>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  roomState: DEFAULT_ROOM_STATE,
  isConnected: false,
  isSyncing: false,
  kickedReason: null,

  setRoomState: (nextState) => {
    if (nextState && nextState.phase) {
      set({ roomState: nextState });
    }
  },

  setIsConnected: (connected) => set({ isConnected: connected }),

  setIsSyncing: (syncing) => set({ isSyncing: syncing }),

  setKickedReason: (reason) => set({ kickedReason: reason }),

  initSocketConnection: () => {
    if (typeof window === 'undefined' || socketBoundToStore) return;
    socketBoundToStore = true;

    const socket = getSocket();

    socket.on('connect', () => {
      set({ isConnected: true });
      const currentCode = get().roomState.roomCode || 'MDX26';
      socket.emit('room:join-session', { roomCode: currentCode }, (st: GameRoomState) => {
        if (st && st.phase) {
          set({ roomState: st });
        }
      });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('room:state', (nextState: GameRoomState) => {
      if (nextState && nextState.phase) {
        set({ roomState: nextState });
      }
    });

    socket.on('player:kicked', (payload: { reason?: string }) => {
      set({
        kickedReason: payload?.reason || 'Você foi removida da rodada pelo moderador da sala.',
      });
    });

    if (socket.connected) {
      set({ isConnected: true });
      const currentCode = get().roomState.roomCode || 'MDX26';
      socket.emit('room:request-state', { roomCode: currentCode }, (st: GameRoomState) => {
        if (st && st.phase) {
          set({ roomState: st });
        }
      });
    } else {
      fetch('/api/state')
        .then((r) => (r.ok ? r.json() : null))
        .then((data: GameRoomState | null) => {
          if (data && data.phase) {
            set({ roomState: data });
          }
        })
        .catch(() => {});
    }
  },

  joinSessionRoom: (roomCode: string) => {
    const socket = getSocket();
    const clean = (roomCode || 'MDX26').toUpperCase().trim();
    socket.emit('room:join-session', { roomCode: clean }, (st: GameRoomState) => {
      if (st && st.phase) {
        set({ roomState: st });
      }
    });
  },

  openRoom: (params) => {
    get().initSocketConnection();
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('moderator:open-room', params, (res: { ok: boolean; error?: string; state?: GameRoomState }) => {
        if (res?.state && res.state.phase) {
          set({ roomState: res.state, isSyncing: false });
        } else {
          set({ isSyncing: false });
        }
        resolve(res);
      });
    });
  },

  closeRoom: (params) => {
    get().initSocketConnection();
    const socket = getSocket();
    const targetRoom = params.roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit(
        'moderator:close-room',
        { ...params, roomCode: targetRoom },
        (res: { ok: boolean; error?: string; state?: GameRoomState }) => {
          if (res?.state && res.state.phase) {
            set({ roomState: res.state, isSyncing: false });
          } else {
            set({ isSyncing: false });
          }
          resolve(res);
        }
      );
    });
  },

  kickPlayer: (params) => {
    const socket = getSocket();
    const roomCode = params.roomCode || get().roomState.roomCode || 'MDX26';
    return new Promise((resolve) => {
      socket.emit('moderator:kick-player', { ...params, roomCode }, (res: { ok: boolean; error?: string }) => {
        resolve(res);
      });
    });
  },

  identifyDevice: (deviceId, roomCode) => {
    get().initSocketConnection();
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:identify', { deviceId, roomCode: targetRoom }, (res: IdentifyResponse) => {
        if (res?.state && res.state.phase) {
          set({ roomState: res.state, isSyncing: false });
        } else {
          set({ isSyncing: false });
        }
        resolve(res);
      });
    });
  },

  registerPlayer: (params) => {
    get().initSocketConnection();
    const socket = getSocket();
    const roomCode = params.roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:register', { ...params, roomCode }, (res: RegisterResponse) => {
        set({ isSyncing: false });
        resolve(res);
      });
    });
  },

  joinRoom: (params) => {
    get().initSocketConnection();
    const socket = getSocket();
    const roomCode = params.roomCode || get().roomState.roomCode || 'MDX26';
    const roundToken = params.roundToken || get().roomState.roundToken;
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:join-room', { ...params, roomCode, roundToken }, (res: JoinRoomResponse) => {
        if (res?.state && res.state.phase) {
          set({ roomState: res.state, isSyncing: false });
        } else {
          set({ isSyncing: false });
        }
        resolve(res);
      });
    });
  },

  leaveRoom: (deviceId, roomCode) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:leave-room', { deviceId, roomCode: targetRoom }, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  sendTypingDraft: (deviceId, draftPrompt, roomCode) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    socket.emit('player:typing', { deviceId, draftPrompt, roomCode: targetRoom });
  },

  submitPrompt: (deviceId, prompt, roomCode, roundToken) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    const token = roundToken || get().roomState.roundToken;
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit(
        'player:submit-prompt',
        { deviceId, prompt, roomCode: targetRoom, roundToken: token },
        (res: { ok: boolean; state: GameRoomState; error?: string }) => {
          if (res?.state && res.state.phase) {
            set({ roomState: res.state, isSyncing: false });
          } else {
            set({ isSyncing: false });
          }
          resolve(res);
        }
      );
    });
  },

  startWithBotsNow: (roomCode) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:start-with-bots', { roomCode: targetRoom }, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  resetRoom: (roomCode) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:reset', { roomCode: targetRoom }, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  clearRanking: (password, roomCode) => {
    const socket = getSocket();
    const targetRoom = roomCode || get().roomState.roomCode || 'MDX26';
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:clear-ranking', { password, roomCode: targetRoom }, (res: { ok: boolean; error?: string }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },
}));
