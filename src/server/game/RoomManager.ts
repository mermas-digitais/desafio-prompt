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
  moderatorId: string | null;
}

export class RoomManager {
  private io: SocketIOServer;
  private rooms = new Map<string, GameEngine>();
  private defaultRoomCode = 'MDX26';
  private moderators = new Map<string, string | null>();
  private creating = new Set<string>();
  private readonly maxRooms = 100;

  private validCode(code: string): boolean {
    return /^[A-Z0-9_-]{1,12}$/.test(code);
  }

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public async init(): Promise<void> {
    const storedRooms = await database.getRooms();
    if (storedRooms.length > this.maxRooms) throw new Error('Limite de salas excedido.');

    for (const stored of storedRooms) {
      const code = stored.code.toUpperCase().trim();
      if (!this.validCode(code)) throw new Error('Código de sala inválido no banco.');

      const engine = new GameEngine(
        this.io,
        code,
        stored.name || (code === this.defaultRoomCode ? 'Arena MDX Principal' : `Sala ${code}`),
        stored.isOpen
      );
      await engine.start();
      this.rooms.set(code, engine);
      this.moderators.set(code, stored.moderatorId ?? null);
    }

  }

  public getRoom(roomCode?: string): GameEngine | undefined {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    return this.rooms.get(code);
  }

  public async openRoom(params: {
    roomCode: string;
    name: string;
    password?: string;
  }): Promise<{ ok: boolean; state?: GameRoomState; error?: string }> {
    const code = (params.roomCode || this.defaultRoomCode).toUpperCase().trim();
    const engine = this.getRoom(code);
    if (!engine) return { ok: false, error: 'Sala não encontrada.' };
    const name = params.name?.trim() || engine.getState().roomName;
    await database.upsertRoom(code, name, true);
    engine.openRoom({ name });
    return { ok: true, state: engine.getState() };
  }

  public async closeRoom(roomCode: string): Promise<{ ok: boolean }> {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    const engine = this.getRoom(code);
    if (!engine) return { ok: false };
    await database.setRoomStatus(code, false);
    engine.closeRoom();
    return { ok: true };
  }

  public async createRoom(params: {
    roomCode: string;
    name: string;
    isOpen?: boolean;
    moderatorId: string;
  }): Promise<{ ok: boolean; state?: GameRoomState; error?: string }> {
    const code = (params.roomCode || '').toUpperCase().trim();
    const name = (params.name || `Sala ${code}`).trim();
    const isOpen = typeof params.isOpen === 'boolean' ? params.isOpen : true;

    if (!this.validCode(code) || !params.moderatorId?.trim()) {
      return { ok: false, error: 'Código de sala ou responsável inválido.' };
    }
    if (this.rooms.has(code) || this.creating.has(code)) {
      return { ok: false, error: 'Esta sala já existe.' };
    }
    if (this.rooms.size + this.creating.size >= this.maxRooms) {
      return { ok: false, error: 'Limite de salas atingido.' };
    }
    this.creating.add(code);
    const engine = new GameEngine(this.io, code, name, isOpen);
    try {
      await database.createRoom(code, name, params.moderatorId);
      if (!isOpen) await database.setRoomStatus(code, false);
      await engine.start();
      this.rooms.set(code, engine);
      this.moderators.set(code, params.moderatorId);
      return { ok: true, state: engine.getState() };
    } catch (err) {
      engine.dispose();
      throw err;
    } finally {
      this.creating.delete(code);
    }
  }

  public getModeratorId(roomCode: string): string | null {
    return this.moderators.get(roomCode.toUpperCase().trim()) ?? null;
  }

  public async transferModeration(roomCode: string, moderatorId: string): Promise<{ ok: boolean }> {
    const code = roomCode.toUpperCase().trim();
    if (!this.rooms.has(code) || !moderatorId.trim()) return { ok: false };
    const persisted = await database.setRoomModerator(code, moderatorId);
    if (persisted === false) return { ok: false };
    this.moderators.set(code, moderatorId);
    return { ok: true };
  }

  public isEvaluatingRound(roomCode: string): boolean {
    return this.getRoom(roomCode)?.isEvaluatingRound() ?? false;
  }

  public isCommittingRound(roomCode: string): boolean {
    return this.getRoom(roomCode)?.isCommittingRound() ?? false;
  }

  public async refreshAllLeaderboards(): Promise<void> {
    await Promise.all([...this.rooms.values()].map((engine) => engine.refreshLeaderboards()));
  }

  public dispose(): void {
    for (const engine of this.rooms.values()) engine.dispose();
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
        moderatorId: this.getModeratorId(code),
      });
    }
    return list;
  }
}
