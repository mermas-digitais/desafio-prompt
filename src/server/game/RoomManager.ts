import type { Server as SocketIOServer } from 'socket.io';
import { GameEngine } from './GameEngine.js';
import type { GameRoomState } from '../../shared/types.js';

export interface RoomListItem {
  roomCode: string;
  roomName: string;
  isOpen: boolean;
  phase: string;
  playersCount: number;
  maxPlayers: number;
  roundToken: string;
}

export class RoomManager {
  private io: SocketIOServer;
  private rooms = new Map<string, GameEngine>();
  private defaultRoomCode = 'MDX26';

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public async init(): Promise<void> {
    // Inicializa a sala padrão da Arena MDX Principal aberta por padrão
    const defaultEngine = new GameEngine(
      this.io,
      this.defaultRoomCode,
      'Arena MDX Principal',
      true
    );
    await defaultEngine.start();
    this.rooms.set(this.defaultRoomCode, defaultEngine);
  }

  public getRoom(roomCode?: string): GameEngine | undefined {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    return this.rooms.get(code);
  }

  public getOrCreateRoom(
    roomCode?: string,
    name?: string,
    isOpen = false
  ): { engine: GameEngine; isNew: boolean } {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    let engine = this.rooms.get(code);
    if (engine) {
      if (name) {
        engine.openRoom({ name });
      }
      return { engine, isNew: false };
    }

    const roomName = name || (code === this.defaultRoomCode ? 'Arena MDX Principal' : `Sala ${code}`);
    engine = new GameEngine(this.io, code, roomName, isOpen);
    engine.start().catch((err) => {
      console.error(`❌ [RoomManager] Falha ao iniciar sala ${code}:`, err);
    });
    this.rooms.set(code, engine);
    return { engine, isNew: true };
  }

  public openRoom(params: {
    roomCode: string;
    name: string;
    password?: string;
  }): { ok: boolean; state?: GameRoomState; error?: string } {
    const code = (params.roomCode || this.defaultRoomCode).toUpperCase().trim();
    const { engine } = this.getOrCreateRoom(code, params.name, true);
    engine.openRoom({ name: params.name });
    return { ok: true, state: engine.getState() };
  }

  public closeRoom(roomCode: string): { ok: boolean } {
    const engine = this.getRoom(roomCode);
    if (!engine) return { ok: false };
    engine.closeRoom();
    return { ok: true };
  }

  public listRooms(): RoomListItem[] {
    const list: RoomListItem[] = [];
    for (const [code, engine] of this.rooms.entries()) {
      const state = engine.getState();
      list.push({
        roomCode: code,
        roomName: state.roomName,
        isOpen: state.isOpen,
        phase: state.phase,
        playersCount: state.players.length,
        maxPlayers: 5,
        roundToken: state.roundToken,
      });
    }
    return list;
  }
}
