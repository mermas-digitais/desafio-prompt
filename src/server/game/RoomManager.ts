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
  private creating = new Set<string>();
  private mutating = new Set<string>();
  private deleting = new Set<string>();
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
    }

  }

  public getRoom(roomCode?: string): GameEngine | undefined {
    if (!roomCode) return this.getRoom(this.defaultRoomCode) ?? [...this.rooms.entries()].find(([code]) => !this.deleting.has(code))?.[1];
    const code = roomCode.toUpperCase().trim();
    if (this.deleting.has(code)) return undefined;
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
    if (this.mutating.has(code)) return { ok: false, error: 'Aguarde a operação em andamento nesta sala.' };
    const name = params.name?.trim() || engine.getState().roomName;
    this.mutating.add(code);
    try {
      await database.upsertRoom(code, name, true);
      engine.openRoom({ name });
      return { ok: true, state: engine.getState() };
    } finally { this.mutating.delete(code); }
  }

  public async closeRoom(roomCode: string): Promise<{ ok: boolean; error?: string }> {
    const code = (roomCode || this.defaultRoomCode).toUpperCase().trim();
    const engine = this.getRoom(code);
    if (!engine) return { ok: false };
    if (this.mutating.has(code)) return { ok: false, error: 'Aguarde a operação em andamento nesta sala.' };
    this.mutating.add(code);
    try {
      await database.setRoomStatus(code, false);
      engine.closeRoom();
      return { ok: true };
    } finally { this.mutating.delete(code); }
  }

  public async deleteRoom(roomCode: string): Promise<{ ok: true } | { ok: false; status: 404 | 409; error: string }> {
    const code = roomCode.toUpperCase().trim();
    const engine = this.getRoom(code);
    if (!engine) return { ok: false, status: 404, error: 'Sala não encontrada.' };
    if (this.mutating.has(code) || engine.isEvaluatingRound() || engine.isCommittingRound()) {
      return { ok: false, status: 409, error: 'Aguarde a avaliação, gravação ou operação em andamento e tente excluir novamente.' };
    }
    this.mutating.add(code);
    this.deleting.add(code);
    engine.pause();
    try {
      await database.deleteRoom(code);
      engine.dispose();
      this.rooms.delete(code);
      return { ok: true };
    } catch (error) {
      engine.resume();
      throw error;
    } finally {
      this.deleting.delete(code);
      this.mutating.delete(code);
    }
  }

  public async createRoom(params: {
    roomCode: string;
    name: string;
    isOpen?: boolean;
  }): Promise<{ ok: boolean; state?: GameRoomState; error?: string }> {
    const code = (params.roomCode || '').toUpperCase().trim();
    const name = (params.name || `Sala ${code}`).trim();
    const isOpen = typeof params.isOpen === 'boolean' ? params.isOpen : true;

    if (!this.validCode(code)) {
      return { ok: false, error: 'Código de sala inválido.' };
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
      await database.createRoom(code, name);
      if (!isOpen) await database.setRoomStatus(code, false);
      await engine.start();
      this.rooms.set(code, engine);
      return { ok: true, state: engine.getState() };
    } catch (err) {
      engine.dispose();
      throw err;
    } finally {
      this.creating.delete(code);
    }
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
      });
    }
    return list;
  }
}
