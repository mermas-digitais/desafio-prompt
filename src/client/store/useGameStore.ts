import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import type { AvatarId, ExpiredRoundSummary, GameRoomState, PlayerProfile, PlayerSlot } from '../../shared/types';
import { api } from '../lib/api';
import { isRequestedRoom } from '../lib/sessionHelpers';

export const DEFAULT_ROOM_STATE: GameRoomState = {
  roomCode: 'MDX26', roomName: 'Arena MDX Principal', isOpen: false,
  roundId: '', roundToken: '', phase: 'IDLE', lobbyTimeLeft: 90, roundTimeLeft: 90,
  countdownLeft: 3, blurPx: 16, players: [], challenge: null, evaluations: [],
  currentRevealIndex: 0, revealStepTimer: 8,
  leaderboards: { general: [], points: [], wins: [], stats: { totalPlayers: 0, totalMatches: 0, highestScoreEver: 0 } },
};

interface CommandResponse { ok: boolean; error?: string; state?: GameRoomState }
export interface IdentifyResponse extends CommandResponse { profile: PlayerProfile | null }
export interface RegisterResponse extends CommandResponse { profile?: PlayerProfile; suggestions?: string[] }
export interface JoinRoomResponse extends RegisterResponse { slot?: PlayerSlot; expired?: boolean; roundData?: ExpiredRoundSummary }

let socketSingleton: Socket | null = null;
let socketBoundToStore = false;
let privateDeviceId = '';
let sessionRequest: Promise<string> | null = null;

export function getSocket(): Socket {
  if (!socketSingleton) socketSingleton = io(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001', {
    autoConnect: false, withCredentials: true, transports: ['websocket', 'polling'],
    reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 600,
  });
  return socketSingleton;
}

// Legacy local IDs are deliberately not read: public IDs cannot prove ownership.
export function getOrCreateDeviceId(): string { return privateDeviceId; }

export function ensurePlayerSession(): Promise<string> {
  if (privateDeviceId) return Promise.resolve(privateDeviceId);
  if (!sessionRequest) sessionRequest = api<{ deviceId: string }>('/api/player/session', {}).then(({ deviceId }) => {
    if (!deviceId) throw new Error('Sessão privada indisponível. Recarregue a página.');
    privateDeviceId = deviceId;
    const socket = getSocket();
    if (socket.connected) socket.disconnect().connect();
    return deviceId;
  }).finally(() => { sessionRequest = null; });
  return sessionRequest;
}

interface GameStoreState {
  roomState: GameRoomState;
  requestedRoomCode: string;
  isConnected: boolean;
  isSyncing: boolean;
  kickedReason: string | null;
  connectionError: string | null;
  setRoomState: (state: GameRoomState) => void;
  setIsConnected: (value: boolean) => void;
  setIsSyncing: (value: boolean) => void;
  setKickedReason: (value: string | null) => void;
  initSocketConnection: () => void;
  joinSessionRoom: (roomCode: string) => void;
  openRoom: (params: { roomCode: string; name: string }) => Promise<CommandResponse>;
  closeRoom: (params: { roomCode: string }) => Promise<CommandResponse>;
  kickPlayer: (params: { roomCode?: string; playerId: string; slot?: PlayerSlot; reason?: string }) => Promise<CommandResponse>;
  identifyDevice: (deviceId: string, roomCode?: string) => Promise<IdentifyResponse>;
  registerPlayer: (params: { deviceId: string; nickname: string; avatar: AvatarId; roomCode?: string; roundToken?: string }) => Promise<RegisterResponse>;
  joinRoom: (params: { deviceId: string; nickname?: string; avatar?: AvatarId; roomCode?: string; roundToken?: string }) => Promise<JoinRoomResponse>;
  leaveRoom: (deviceId: string, roomCode?: string) => Promise<CommandResponse>;
  sendTypingDraft: (deviceId: string, draftPrompt: string, roomCode?: string) => void;
  submitPrompt: (deviceId: string, prompt: string, roomCode?: string, roundToken?: string) => Promise<CommandResponse>;
  startWithBotsNow: (roomCode?: string) => Promise<CommandResponse>;
  resetRoom: (roomCode?: string) => Promise<CommandResponse>;
  clearRanking: (roomCode?: string) => Promise<CommandResponse>;
}

async function command<T extends CommandResponse>(event: string, payload: object): Promise<T> {
  const store = useGameStore.getState();
  store.initSocketConnection();
  store.setIsSyncing(true);
  return new Promise((resolve) => {
    getSocket().timeout(10000).emit(event, payload, (error: Error | null, response?: T) => {
      store.setIsSyncing(false);
      const result = error || !response ? { ok: false, error: 'Servidor não respondeu. Confira a conexão e atualize antes de repetir a ação.' } as T : response;
      if (result.state) useGameStore.getState().setRoomState(result.state);
      resolve(result);
    });
  });
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  roomState: DEFAULT_ROOM_STATE, requestedRoomCode: 'MDX26', isConnected: false,
  isSyncing: false, kickedReason: null, connectionError: null,
  setRoomState: (state) => { if (isRequestedRoom(state, get().requestedRoomCode)) set({ roomState: state }); },
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setKickedReason: (kickedReason) => set({ kickedReason }),
  initSocketConnection: () => {
    if (typeof window === 'undefined') return;
    const socket = getSocket();
    if (!socketBoundToStore) {
      socketBoundToStore = true;
      socket.on('connect', () => {
        set({ isConnected: true, connectionError: null });
        get().joinSessionRoom(get().requestedRoomCode);
      });
      socket.on('disconnect', () => set({ isConnected: false }));
      socket.on('connect_error', () => set({ connectionError: 'Sem conexão com a sala. Tentando reconectar…' }));
      socket.on('operation:error', (response: { error?: string }) => set({ connectionError: response.error || 'Ação recusada. Atualize a sala.' }));
      socket.on('room:state', (state: GameRoomState) => get().setRoomState(state));
      socket.on('player:kicked', (payload: { reason?: string; roomCode?: string }) => {
        if (!payload.roomCode || payload.roomCode === get().requestedRoomCode) set({ kickedReason: payload.reason || 'Você foi removida desta rodada.' });
      });
    }
    if (!socket.connected) socket.connect();
  },
  joinSessionRoom: (roomCode) => {
    const clean = roomCode.toUpperCase().trim();
    if (clean !== get().requestedRoomCode) set({ requestedRoomCode: clean, roomState: { ...DEFAULT_ROOM_STATE, roomCode: clean, roomName: clean }, kickedReason: null });
    get().initSocketConnection();
    getSocket().timeout(10000).emit('room:join-session', { roomCode: clean }, (error: Error | null, state?: GameRoomState & { error?: string }) => {
      if (get().requestedRoomCode !== clean) return;
      if (error) set({ connectionError: 'Sala não respondeu. Confira o código e tente recarregar.' });
      else if (state?.error) set({ connectionError: state.error });
      else if (state) { get().setRoomState(state); set({ connectionError: null }); }
    });
  },
  openRoom: (params) => command('moderator:open-room', params),
  closeRoom: (params) => command('moderator:close-room', params),
  kickPlayer: (params) => command('moderator:kick-player', { ...params, roomCode: params.roomCode || get().requestedRoomCode }),
  identifyDevice: async (_deviceId, roomCode) => {
    await ensurePlayerSession();
    return command<IdentifyResponse>('player:identify', { roomCode: roomCode || get().requestedRoomCode });
  },
  registerPlayer: async ({ deviceId: _deviceId, ...params }) => {
    await ensurePlayerSession();
    return command('player:register', { ...params, roomCode: params.roomCode || get().requestedRoomCode });
  },
  joinRoom: async ({ deviceId: _deviceId, ...params }) => {
    await ensurePlayerSession();
    return command('player:join-room', { ...params, roomCode: params.roomCode || get().requestedRoomCode });
  },
  leaveRoom: (_deviceId, roomCode) => command('player:leave-room', { roomCode: roomCode || get().requestedRoomCode }),
  sendTypingDraft: (_deviceId, draftPrompt, roomCode) => {
    const socket = getSocket();
    if (!socket.connected) return;
    socket.timeout(10000).volatile.emit('player:typing', { draftPrompt, roomCode: roomCode || get().requestedRoomCode }, (error: Error | null, response?: CommandResponse) => {
      if (error || response?.ok === false) set({ connectionError: response?.error || 'Não foi possível sincronizar o rascunho. Verifique a conexão.' });
    });
  },
  submitPrompt: (_deviceId, prompt, roomCode, roundToken) => command('player:submit-prompt', { prompt, roomCode: roomCode || get().requestedRoomCode, roundToken }),
  startWithBotsNow: (roomCode) => command('room:start-with-bots', { roomCode: roomCode || get().requestedRoomCode }),
  resetRoom: (roomCode) => command('room:reset', { roomCode: roomCode || get().requestedRoomCode }),
  clearRanking: (roomCode) => command('room:clear-ranking', { roomCode: roomCode || get().requestedRoomCode, confirm: true }),
}));
