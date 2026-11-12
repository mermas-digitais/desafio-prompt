import type { Server as SocketIOServer } from 'socket.io';
import { GameEngine } from './GameEngine.js';
import { database } from '../db/index.js';
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
    const storedRooms = await database.getRooms();
    let hasDefault = false;

    for (const stored of storedRooms) {
      const code = stored.code.toUpperCase().trim();
      if (code === this.defaultRoomCode) hasDefault = true;

      const engine = new GameEngine(
        this.io,
        code,
        stored.name || (code === this.defaultRoomCode ? 'Arena MDX Principal' : `Sala ${code}`),
        stored.isOpen
      );
      await engine.start();
      this.rooms.set(code, engine);
    }

    if (!hasDefault) {
      const defaultEngine = new GameEngine(
        this.io,
        this.defaultRoomCode,
        'Arena MDX Principal',
        true
      );
      await defaultEngine.start();
      this.rooms.set(this.defaultRoomCode, defaultEngine);
      await database.upsertRoom(this.defaultRoomCode, 'Arena MDX Principal', true);
    }
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

  public async openRoom(params: {
    roomCode: string;
    name: string;
    password?: string;
  }): Promise<{ ok: boolean; state?: GameRoomState; error?: string }> {
    const code = (params.roomCode || this.defaultRoomCode).toUpperCase().trim();
    const { engine } = this.getOrCreateRoom(code, params.name, true);
    engine.openRoom({ name: params.name });
    await database.upsertRoom(code, params.name, true);
    return { ok: true, state: engine.getState() };
  }

  public async closeRoom(roomCode: string): Promise<{ ok: boolean }> {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    const engine = this.getRoom(code);
    if (!engine) return { ok: false };
    engine.closeRoom();
    await database.setRoomStatus(code, false);
    return { ok: true };
  }

  public async createRoom(params: {
    roomCode: string;
    name: string;
    isOpen?: boolean;
  }): Promise<{ ok: boolean; state: GameRoomState }> {
    const code = (params.roomCode || '').toUpperCase().trim();
    const name = (params.name || `Sala ${code}`).trim();
    const isOpen = typeof params.isOpen === 'boolean' ? params.isOpen : true;

    const { engine } = this.getOrCreateRoom(code, name, isOpen);
    if (isOpen) {
      engine.openRoom({ name });
    }
    await database.upsertRoom(code, name, isOpen);
    return { ok: true, state: engine.getState() };
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
