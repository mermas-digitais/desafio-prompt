import crypto from 'node:crypto';
import type { Server as SocketIOServer } from 'socket.io';
import { GameEngine } from './GameEngine.js';
import { ChallengeDeck } from './ChallengeDeck.js';
import { database, type ActiveParticipation, type StoredRoomRecord } from '../db/index.js';
import type { GameRoomState, GameSessionMetadata, PlayerProfile } from '../../shared/types.js';
import { HttpError } from '../auth.js';

export interface RoomListItem {
  roomCode: string; roomName: string; isOpen: boolean; phase: string;
  playersCount: number; maxPlayers: number; roundToken: string; sessionsCount: number;
}

export class RoomManager {
  private rooms = new Map<string, StoredRoomRecord>();
  private sessions = new Map<string, GameEngine>();
  private decks = new Map<string, ChallengeDeck>();
  private mutating = new Set<string>();
  private deleting = new Set<string>();
  private closing = new Set<string>();
  private joining = new Map<string, string>();
  private claims = new Map<string, ActiveParticipation>();
  private usedSessionIds = new Set<string>();
  private refreshVersions = new Map<string, number>();
  private available = true;
  constructor(private io: SocketIOServer) {}

  async init(): Promise<void> {
    await database.startGameRuntime(() => { this.available = false; this.dispose(); });
    const rooms = await database.getRooms();
    if (rooms.length > 100) throw new Error('Limite de salas excedido.');
    for (const room of rooms) this.rooms.set(room.code, room);
    for (const session of await database.getGameSessions()) this.usedSessionIds.add(session.id);
  }
  getRoomInfo(code: string) { return this.rooms.get(code.toUpperCase().trim()); }
  isAvailable() { return this.available; }
  isMutating(code: string) { return this.mutating.has(code) || this.deleting.has(code) || !this.available; }
  getRoom(code?: string, sessionId?: string): GameEngine | undefined {
    if (!this.available) return undefined;
    if (sessionId) {
      const engine = this.sessions.get(sessionId);
      return engine && !this.closing.has(sessionId) && !this.deleting.has(engine.getState().roomCode) && (!code || engine.getState().roomCode === code) ? engine : undefined;
    }
    const candidates = [...this.sessions.values()].filter((engine) => (!code || engine.getState().roomCode === code) && !this.deleting.has(engine.getState().roomCode) && !this.closing.has(engine.sessionId));
    return candidates.length === 1 ? candidates[0] : undefined;
  }
  listSessions(roomCode?: string): GameSessionMetadata[] {
    return [...this.sessions.values()].filter((engine) => !roomCode || engine.getState().roomCode === roomCode).map((engine) => {
      const state = engine.getState();
      return { id: engine.sessionId, name: engine.sessionName, roomCode: state.roomCode, isOpen: state.isOpen, phase: state.phase, playersCount: state.players.length, roundToken: state.roundToken };
    });
  }
  async createSession(params: { id: string; roomCode: string; name: string; createdBy: string | null }) {
    const room = this.getRoomInfo(params.roomCode);
    if (!room || !this.available) return { ok: false, error: 'Sala indisponível.' };
    const existing = this.sessions.get(params.id);
    if (existing) return existing.getState().roomCode === room.code && existing.sessionName === params.name ? { ok: true, state: existing.getState() } : { ok: false, error: 'Identificador já utilizado.' };
    if (this.usedSessionIds.has(params.id) || this.mutating.has(room.code) || this.deleting.has(room.code)) return { ok: false, error: 'Aguarde a operação em andamento ou use um novo identificador.' };
    if (this.listSessions(room.code).length >= 2) return { ok: false, error: 'Esta sala já tem duas sessões ativas. Encerre uma antes de criar outra.' };
    this.mutating.add(room.code);
    let engine: GameEngine | undefined;
    try {
      await database.createGameSession(params);
      this.usedSessionIds.add(params.id);
      if (!this.decks.has(room.code)) this.decks.set(room.code, new ChallengeDeck());
      engine = new GameEngine(this.io, room.code, room.name, room.isOpen, params.id, params.name,
        () => this.decks.get(room.code)!.next(new Set([...this.sessions.values()].filter((session) => session.getState().roomCode === room.code).flatMap((session) => session.getState().challenge ? [session.getState().challenge!.id] : []))),
        () => this.refreshAllLeaderboards(room.code),
        (token, profileId) => this.releaseMembers(params.id, token, profileId));
      await engine.start();
      if (!this.available) throw new Error('O runtime foi interrompido durante a criação da sessão.');
      this.sessions.set(params.id, engine);
      return { ok: true, state: engine.getState() };
    } catch (error) {
      engine?.dispose();
      if (this.usedSessionIds.has(params.id)) await database.finishGameSession(params.id);
      throw error;
    } finally { this.mutating.delete(room.code); }
  }
  async joinSession(roomCode: string, sessionId: string, profile: PlayerProfile, socketId: string, roundToken?: string): Promise<Partial<ReturnType<GameEngine['joinRoom']>> & { joined: boolean; reason?: string }> {
    const engine = this.getRoom(roomCode, sessionId);
    if (!engine || this.mutating.has(roomCode)) return { joined: false, reason: 'Sessão indisponível. Atualize antes de tentar novamente.' };
    if (this.joining.has(profile.deviceId)) return { joined: false, reason: 'Uma entrada já está em andamento. Aguarde e tente novamente.' };
    this.joining.set(profile.deviceId, sessionId);
    try {
      const previous = await database.getParticipation(profile.deviceId);
      if (this.getRoom(roomCode, sessionId) !== engine || this.mutating.has(roomCode)) return { joined: false, reason: 'Esta sessão mudou. Atualize antes de entrar.' };
      if (previous) {
        const active = this.sessions.get(previous.sessionId);
        const state = active?.getState();
        if (state?.roundToken === previous.roundToken && state.players.some((player) => player.id === previous.profileId)) {
          if (previous.sessionId === sessionId) return engine.joinRoom(profile, socketId, roundToken);
          return { joined: false, reason: `Você já participa de uma partida em ${state.roomName} · ${active!.sessionName}. Volte para essa partida.` };
        }
        await database.releaseParticipation(previous);
        this.claims.delete(previous.id);
      }
      const claim = { id: crypto.randomUUID(), deviceId: profile.deviceId, profileId: profile.id, sessionId, roundToken: engine.getState().roundToken };
      if (!await database.acquireParticipation(claim)) return { joined: false, reason: 'Você já participa de outra partida ou esta sessão foi encerrada.' };
      this.claims.set(claim.id, claim);
      try {
        if (this.getRoom(roomCode, sessionId) !== engine || this.mutating.has(roomCode)) return { joined: false, reason: 'Esta sessão mudou. Atualize antes de entrar.' };
        return engine.joinRoom(profile, socketId, roundToken);
      } finally {
        if (this.getRoom(roomCode, sessionId) !== engine || !engine.getState().players.some((player) => player.id === profile.id)) { await database.releaseParticipation(claim); this.claims.delete(claim.id); }
      }
    } finally { this.joining.delete(profile.deviceId); }
  }
  private releaseMembers(sessionId: string, roundToken: string, profileId?: string): void {
    for (const claim of this.claims.values()) if (claim.sessionId === sessionId && claim.roundToken === roundToken && (!profileId || profileId === claim.profileId)) {
      void database.releaseParticipation(claim).then(() => this.claims.delete(claim.id)).catch((error) => console.error('Falha ao liberar participação; será revalidada na próxima entrada:', error));
    }
  }
  private busy(code: string): boolean {
    return this.listSessions(code).some((session) => this.closing.has(session.id) || this.sessions.get(session.id)!.isCommittingRound() || this.sessions.get(session.id)!.isEvaluatingRound() || [...this.joining.values()].includes(session.id));
  }
  async endSession(code: string, id: string) {
    const engine = this.getRoom(code, id);
    if (!engine) return { ok: false, error: 'Sessão não encontrada.' };
    if (engine.isEvaluatingRound() || engine.isCommittingRound() || [...this.joining.values()].includes(id) || this.mutating.has(code)) return { ok: false, error: 'Aguarde a avaliação, gravação ou entrada em andamento.' };
    this.closing.add(id); engine.pause();
    try {
      await database.finishGameSession(id);
      engine.dispose(); this.sessions.delete(id);
      for (const claim of this.claims.values()) if (claim.sessionId === id) this.claims.delete(claim.id);
      this.io.to(`session:${id}`).emit('session:ended', { roomCode: code, sessionId: id });
      this.io.in(`session:${id}`).socketsLeave(`session:${id}`);
      return { ok: true };
    } catch (error) { engine.resume(); throw error; }
    finally { this.closing.delete(id); }
  }
  async createRoom(params: { roomCode: string; name: string; isOpen?: boolean }) {
    const code = params.roomCode.toUpperCase().trim();
    if (!/^[A-Z0-9_-]{1,12}$/.test(code) || this.rooms.has(code) || this.mutating.has(code) || this.rooms.size + this.mutating.size >= 100) return { ok: false, error: 'Código inválido, sala existente ou limite de salas atingido.' };
    this.mutating.add(code);
    try {
      const room = await database.createRoom(code, params.name);
      if (params.isOpen === false) { await database.setRoomStatus(code, false); room.isOpen = false; }
      this.rooms.set(code, room);
      return { ok: true, room: this.listRooms().find((entry) => entry.roomCode === code) };
    } finally { this.mutating.delete(code); }
  }
  async openRoom(params: { roomCode: string; name: string; sessionId?: string }): Promise<{ ok: boolean; error?: string; state?: GameRoomState }> {
    const engine = this.getRoom(params.roomCode, params.sessionId);
    if (!engine || this.mutating.has(params.roomCode)) return { ok: false, error: 'Selecione uma sessão disponível.' };
    const room = this.getRoomInfo(params.roomCode)!;
    if (params.name !== room.name) {
      this.mutating.add(room.code);
      try {
        await database.upsertRoom(room.code, params.name, room.isOpen);
        room.name = params.name;
        for (const session of this.listSessions(room.code)) this.sessions.get(session.id)!.renameRoom(room.name);
      } finally { this.mutating.delete(room.code); }
    }
    engine.openRoom({}); return { ok: true, state: engine.getState() };
  }
  async closeRoom(code: string, sessionId?: string) {
    const engine = this.getRoom(code, sessionId);
    if (!engine || this.mutating.has(code)) return { ok: false, error: 'Selecione uma sessão disponível.' };
    engine.closeRoom(); return { ok: true, state: engine.getState() };
  }
  async withRoomMutation<T>(code: string | undefined, action: () => Promise<T>): Promise<T> {
    const codes = code ? [code] : [...this.rooms.keys()];
    if (codes.some((entry) => this.isMutating(entry) || this.busy(entry))) throw new HttpError(409, 'Aguarde as operações nas sessões antes da manutenção.');
    codes.forEach((entry) => this.mutating.add(entry));
    try { return await action(); } finally { codes.forEach((entry) => this.mutating.delete(entry)); }
  }
  async deleteRoom(code: string): Promise<{ ok: true } | { ok: false; status: 404 | 409; error: string }> {
    if (!this.rooms.has(code)) return { ok: false, status: 404, error: 'Sala não encontrada.' };
    if (this.busy(code) || this.mutating.has(code) || this.deleting.has(code)) return { ok: false, status: 409, error: 'Aguarde as operações nas sessões antes de excluir.' };
    const engines = [...this.sessions.values()].filter((engine) => engine.getState().roomCode === code);
    this.deleting.add(code); engines.forEach((engine) => engine.pause());
    try {
      await database.deleteRoom(code);
      engines.forEach((engine) => { engine.dispose(); this.sessions.delete(engine.sessionId); });
      this.rooms.delete(code); this.decks.delete(code); return { ok: true };
    } catch (error) { engines.forEach((engine) => engine.resume()); throw error; }
    finally { this.deleting.delete(code); }
  }
  isEvaluatingRound(code: string) { return this.listSessions(code).some((session) => this.sessions.get(session.id)!.isEvaluatingRound()); }
  isCommittingRound(code: string) { return this.listSessions(code).some((session) => this.sessions.get(session.id)!.isCommittingRound()); }
  async refreshAllLeaderboards(code?: string): Promise<void> {
    for (const room of this.listRooms().filter((entry) => !code || entry.roomCode === code)) {
      const version = (this.refreshVersions.get(room.roomCode) ?? 0) + 1;
      this.refreshVersions.set(room.roomCode, version);
      const boards = await database.getLeaderboards(100, room.roomCode);
      if (this.refreshVersions.get(room.roomCode) !== version) continue;
      for (const session of this.listSessions(room.roomCode)) this.sessions.get(session.id)!.setLeaderboards(boards);
      this.io.to(`room:${room.roomCode}`).emit('room:leaderboards', { roomCode: room.roomCode, leaderboards: boards });
    }
  }
  dispose(): void { for (const engine of this.sessions.values()) engine.dispose(); }
  listRooms(): RoomListItem[] {
    return [...this.rooms.values()].map((room) => {
      const sessions = this.listSessions(room.code);
      return { roomCode: room.code, roomName: room.name, isOpen: room.isOpen, phase: sessions.some((session) => session.phase !== 'IDLE') ? 'ACTIVE' : 'IDLE', playersCount: sessions.reduce((total, session) => total + session.playersCount, 0), maxPlayers: 5, roundToken: '', sessionsCount: sessions.length };
    });
  }
}
