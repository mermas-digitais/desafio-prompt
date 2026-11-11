import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import type {
  AvatarId,
  GameRoomState,
  PlayerProfile,
  PlayerSlot,
} from '../../shared/types';

export const DEFAULT_ROOM_STATE: GameRoomState = {
  roomCode: 'MDX26',
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
  setRoomState: (nextState: GameRoomState) => void;
  setIsConnected: (connected: boolean) => void;
  setIsSyncing: (syncing: boolean) => void;
  initSocketConnection: () => void;
  identifyDevice: (deviceId: string) => Promise<IdentifyResponse>;
  registerPlayer: (params: {
    deviceId: string;
    nickname: string;
    avatar: AvatarId;
  }) => Promise<RegisterResponse>;
  joinRoom: (params: {
    deviceId: string;
    nickname?: string;
    avatar?: AvatarId;
  }) => Promise<JoinRoomResponse>;
  leaveRoom: (deviceId: string) => Promise<{ ok: boolean }>;
  sendTypingDraft: (deviceId: string, draftPrompt: string) => void;
  submitPrompt: (
    deviceId: string,
    prompt: string
  ) => Promise<{ ok: boolean; state: GameRoomState }>;
  startWithBotsNow: () => Promise<{ ok: boolean }>;
  resetRoom: () => Promise<{ ok: boolean }>;
  clearRanking: () => Promise<{ ok: boolean }>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  roomState: DEFAULT_ROOM_STATE,
  isConnected: false,
  isSyncing: false,

  setRoomState: (nextState) => {
    if (nextState && nextState.phase) {
      set({ roomState: nextState });
    }
  },

  setIsConnected: (connected) => set({ isConnected: connected }),

  setIsSyncing: (syncing) => set({ isSyncing: syncing }),

  initSocketConnection: () => {
    if (typeof window === 'undefined' || socketBoundToStore) return;
    socketBoundToStore = true;

    const socket = getSocket();

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('room:request-state', (st: GameRoomState) => {
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

    if (socket.connected) {
      set({ isConnected: true });
      socket.emit('room:request-state', (st: GameRoomState) => {
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

  identifyDevice: (deviceId) => {
    get().initSocketConnection();
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:identify', { deviceId }, (res: IdentifyResponse) => {
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
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:register', params, (res: RegisterResponse) => {
        set({ isSyncing: false });
        resolve(res);
      });
    });
  },

  joinRoom: (params) => {
    get().initSocketConnection();
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:join-room', params, (res: JoinRoomResponse) => {
        if (res?.state && res.state.phase) {
          set({ roomState: res.state, isSyncing: false });
        } else {
          set({ isSyncing: false });
        }
        resolve(res);
      });
    });
  },

  leaveRoom: (deviceId) => {
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('player:leave-room', { deviceId }, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  sendTypingDraft: (deviceId, draftPrompt) => {
    const socket = getSocket();
    socket.emit('player:typing', { deviceId, draftPrompt });
  },

  submitPrompt: (deviceId, prompt) => {
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit(
        'player:submit-prompt',
        { deviceId, prompt },
        (res: { ok: boolean; state: GameRoomState }) => {
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

  startWithBotsNow: () => {
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:start-with-bots', {}, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  resetRoom: () => {
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:reset', {}, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },

  clearRanking: () => {
    const socket = getSocket();
    set({ isSyncing: true });
    return new Promise((resolve) => {
      socket.emit('room:clear-ranking', {}, (res: { ok: boolean }) => {
        set({ isSyncing: false });
        resolve(res || { ok: true });
      });
    });
  },
}));
