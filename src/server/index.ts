import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? '.env' : ['.env', '.env.local'], override: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' });
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer } from 'socket.io';
import { z } from 'zod';
import { database } from './db/index.js';
import { validateNickname } from './moderation/profanityFilter.js';
import { RoomManager } from './game/RoomManager.js';
import { AuthService, HttpError, requestError } from './auth.js';
import { registerMusicRoutes } from './musicRoutes.js';
import type { StaffUser } from '../shared/types.js';

const roomCodeSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{1,12}$/);
const roomInput = z.object({ roomCode: roomCodeSchema });
const roomQuery = z.object({ room: roomCodeSchema.optional() });
const avatarSchema = z.string().max(300000).refine((s) => ['menina-mdx', 'ia', 'robo', 'game', 'codigo', 'lampada', 'ciencia', 'selo'].includes(s) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s), 'Avatar inválido.');

function getLanAddresses(): { primaryIp: string; allIps: string[] } {
  const candidates: Array<{ ip: string; score: number }> = [];
  for (const [name, interfaces] of Object.entries(os.networkInterfaces())) {
    for (const net of interfaces || []) {
      if (net.family !== 'IPv4' || net.internal || net.address.startsWith('169.254.')) continue;
      let score = /wi-fi|wlan|wireless/i.test(name) ? 50 : /ethernet|eth|en0/i.test(name) ? 30 : 10;
      if (/vethernet|wsl|vbox|vmware|conexão local\*|local area connection\*/i.test(name) || /^192\.168\.(56|137)\./.test(net.address)) score -= 35;
      candidates.push({ ip: net.address, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  return { primaryIp: candidates[0]?.ip || 'localhost', allIps: candidates.map((c) => c.ip) };
}

export async function createApplication() {
  if (process.env.NODE_ENV === 'production' && (process.env.SESSION_SECRET || '').trim().length < 32) throw new Error('Configure SESSION_SECRET antes de iniciar a aplicação em produção.');
  await database.init();
  const auth = new AuthService();
  await auth.init();
  const fastify = Fastify({ logger: false, bodyLimit: 512000 });
  fastify.setErrorHandler((error, _req, reply) => {
    const result = requestError(error);
    if (result.statusCode === 500) console.error('[API] Falha interna:', error);
    reply.code(result.statusCode).send({ ok: false, error: result.error, ...(result.code ? { code: result.code } : {}) });
  });
  await fastify.register(cors, {
    origin: false,
    credentials: true,
  });
  auth.registerRoutes(fastify);
  const io = new SocketIOServer(fastify.server, {
    maxHttpBufferSize: 512000,
    transports: ['websocket', 'polling'],
    allowRequest: (req, cb) => cb(null, auth.originAllowed(req.headers.origin, req.headers.host)),
    cors: { origin: process.env.PUBLIC_APP_URL || false, credentials: true },
  });
  const roomManager = new RoomManager(io);
  await roomManager.init();

  const getEngine = (raw?: string) => {
    const code = roomCodeSchema.parse(raw || 'MDX26');
    const engine = roomManager.getRoom(code);
    if (!engine) throw new HttpError(404, 'Esta sala não existe. Abra uma sala disponível na página inicial.');
    return engine;
  };
  const authorizeRoom = async (headers: { cookie?: string }, raw: string): Promise<StaffUser> => {
    const user = await auth.requireUser(headers);
    const code = roomCodeSchema.parse(raw);
    getEngine(code);
    if (user.role !== 'admin' && roomManager.getModeratorId(code) !== user.id) throw new HttpError(403, 'Somente o moderador responsável pode controlar esta sala.');
    return user;
  };
  const roomsUpdated = () => io.emit('rooms:updated', roomManager.listRooms());
  const refreshRooms = async () => {
    for (const room of roomManager.listRooms()) await getEngine(room.roomCode).refreshLeaderboards();
    roomsUpdated();
  };
  const cancelRooms = (code?: string) => {
    const affected = roomManager.listRooms().filter((room) => !code || room.roomCode === code);
    if (affected.some((room) => roomManager.isCommittingRound(room.roomCode))) throw new HttpError(409, 'Aguarde a gravação do resultado antes de reiniciar ou fazer manutenção.');
    for (const room of affected) getEngine(room.roomCode).resetToIdle();
  };

  fastify.get<{ Querystring: { room?: string } }>('/api/health', async (req) => {
    const engine = getEngine(roomQuery.parse(req.query).room);
    const state = engine.getState();
    return { status: 'ok', service: 'desafio-prompt-mdx26', database: database.getDatabaseVersion(), spotifyPlaylistUrl: process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || '', aiProviders: { openaiConfigured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sua-chave-aqui'), groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'sua-chave-aqui'), localFallback: true }, roomPhase: state.phase, roomCode: state.roomCode, roomName: state.roomName, isOpen: state.isOpen, timestamp: new Date().toISOString() };
  });
  fastify.get<{ Querystring: { room?: string } }>('/api/config', async (req) => {
    const isProd = process.env.NODE_ENV === 'production';
    const { primaryIp, allIps } = getLanAddresses();
    const raw = (process.env.PUBLIC_APP_URL || process.env.VITE_PUBLIC_APP_URL || (isProd ? 'https://dprompt.mermasdigitais.com.br' : '')).trim();
    const validPublic = raw && !/localhost|127\.0\.0\.1|0\.0\.0\.0|^https?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/|$)/i.test(raw);
    const state = getEngine(roomQuery.parse(req.query).room).getState();
    return { spotifyPlaylistUrl: process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || '', roomCode: state.roomCode, roomName: state.roomName, isOpen: state.isOpen, roundToken: state.roundToken, lanIp: isProd ? '' : primaryIp, allLanIps: isProd ? [] : allIps, publicAppUrl: validPublic ? raw.replace(/\/+$/, '') : isProd ? 'https://dprompt.mermasdigitais.com.br' : '' };
  });
  registerMusicRoutes(fastify);

  fastify.get<{ Querystring: { room?: string } }>('/api/admin/ranking', async (req) => {
    const user = await auth.requireUser(req.headers);
    const target = roomQuery.parse(req.query).room;
    if (target) await authorizeRoom(req.headers, target);
    else if (user.role !== 'admin') throw new HttpError(403, 'Selecione uma sala sob sua moderação.');
    const [players, leaderboards] = await Promise.all([database.getAllPlayersForAdmin(target), database.getLeaderboards(100, target)]);
    return { ok: true, database: database.getDatabaseVersion(), roomCode: target || 'ALL', players: players.map(({ deviceId: _device, ...p }) => p), stats: leaderboards.stats };
  });
  fastify.post('/api/admin/clear-ranking', async (req) => {
    const input = z.object({ roomCode: roomCodeSchema.optional(), confirm: z.literal(true) }).parse(req.body);
    if (input.roomCode) await authorizeRoom(req.headers, input.roomCode);
    else await auth.requireAdmin(req.headers);
    cancelRooms(input.roomCode);
    await database.clearAllRankings(input.roomCode);
    await refreshRooms();
    const [players, leaderboards] = await Promise.all([database.getAllPlayersForAdmin(input.roomCode), database.getLeaderboards(100, input.roomCode)]);
    return { ok: true, roomCode: input.roomCode || 'ALL', players: players.map(({ deviceId: _device, ...p }) => p), stats: leaderboards.stats };
  });
  fastify.delete<{ Params: { id: string }; Querystring: { room?: string; confirm?: string } }>('/api/admin/players/:id', async (req) => {
    const id = z.string().uuid().parse(req.params.id);
    const target = roomQuery.parse(req.query).room;
    if (req.query.confirm !== 'true') throw new HttpError(400, 'Confirme a exclusão do participante.');
    const user = await auth.requireUser(req.headers);
    if (!target && user.role !== 'admin') throw new HttpError(403, 'Selecione explicitamente uma sala sob sua moderação.');
    const all = await database.getAllPlayersForAdmin(target);
    const player = all.find((p) => p.id === id);
    if (!player) throw new HttpError(404, 'Participante não encontrado nesta sala.');
    if (user.role !== 'admin') await authorizeRoom(req.headers, player.roomCode);
    cancelRooms(player.roomCode);
    const deleted = await database.deletePlayerById(id);
    await refreshRooms();
    const [players, leaderboards] = await Promise.all([database.getAllPlayersForAdmin(target), database.getLeaderboards(100, target)]);
    return { ok: deleted, players: players.map(({ deviceId: _device, ...p }) => p), stats: leaderboards.stats };
  });
  fastify.post<{ Params: { id: string } }>('/api/admin/players/:id/rebind', async (req) => {
    await auth.requireAdmin(req.headers);
    const id = z.string().uuid().parse(req.params.id);
    const input = roomInput.extend({ deviceId: z.string().regex(/^player-[0-9a-f-]{36}$/), confirm: z.literal(true) }).parse(req.body);
    getEngine(input.roomCode);
    const target = (await database.getAllPlayersForAdmin(input.roomCode)).find((p) => p.id === id);
    if (!target) throw new HttpError(404, 'Perfil não encontrado nesta sala.');
    if (getEngine(input.roomCode).getState().phase !== 'IDLE') throw new HttpError(409, 'Aguarde o fim da rodada para recuperar este perfil.');
    const recovered = await database.rebindPlayerDeviceId(id, input.roomCode, input.deviceId);
    if (!recovered) throw new HttpError(409, 'O dispositivo já possui outro perfil nesta sala. Nenhuma conta foi mesclada.');
    await refreshRooms();
    return { ok: true };
  });
  fastify.get<{ Querystring: { room?: string } }>('/api/leaderboards', async (req) => {
    const room = roomQuery.parse(req.query).room;
    if (room) getEngine(room);
    return database.getLeaderboards(100, room);
  });
  fastify.get<{ Querystring: { room?: string } }>('/api/state', async (req) => getEngine(roomQuery.parse(req.query).room).getState());
  fastify.get('/api/rooms', async () => ({ ok: true, rooms: roomManager.listRooms() }));
  fastify.get('/api/metrics/global', async () => ({ ok: true, stats: await database.getGlobalStats() }));

  fastify.post('/api/rooms/create', async (req, reply) => {
    const user = await auth.requireUser(req.headers);
    const input = roomInput.extend({ name: z.string().trim().min(2).max(120) }).parse(req.body);
    if (roomManager.getRoom(input.roomCode)) throw new HttpError(409, 'Este código já pertence a outra sala.');
    const result = await roomManager.createRoom({ ...input, moderatorId: user.id });
    if (!result.ok) throw new HttpError(409, result.error || 'Não foi possível criar esta sala.');
    roomsUpdated();
    reply.code(201);
    return result;
  });
  fastify.post('/api/rooms/open', async (req) => {
    const input = roomInput.extend({ name: z.string().trim().min(2).max(120).optional() }).parse(req.body);
    await authorizeRoom(req.headers, input.roomCode);
    const result = await roomManager.openRoom({ roomCode: input.roomCode, name: input.name || getEngine(input.roomCode).getState().roomName });
    roomsUpdated();
    return result;
  });
  fastify.post('/api/rooms/close', async (req) => {
    const input = roomInput.parse(req.body);
    await authorizeRoom(req.headers, input.roomCode);
    await roomManager.closeRoom(input.roomCode);
    roomsUpdated();
    return { ok: true, state: getEngine(input.roomCode).getState() };
  });
  fastify.post('/api/rooms/transfer', async (req) => {
    const input = roomInput.extend({ moderatorId: z.string().uuid() }).parse(req.body);
    await authorizeRoom(req.headers, input.roomCode);
    if (!await database.findStaffUserById(input.moderatorId)) throw new HttpError(404, 'Operador não encontrado.');
    const result = await roomManager.transferModeration(input.roomCode, input.moderatorId);
    if (!result.ok) throw new HttpError(409, 'Não foi possível transferir a moderação.');
    roomsUpdated();
    return result;
  });
  fastify.get<{ Querystring: { room?: string; round?: string } }>('/api/rounds/validate', async (req) => {
    const input = roomQuery.extend({ round: z.string().max(180).optional() }).parse(req.query);
    const engine = getEngine(input.room);
    const result = engine.validateRoundToken(input.round);
    if (input.round && !result.valid && !result.roundData) {
      const summary = await database.getRoundSummary(engine.getState().roomCode, input.round, engine.getState().roomName);
      if (summary) return { ...result, roundData: summary };
    }
    return result;
  });
  fastify.post('/api/validate-nickname', async (req) => validateNickname(z.object({ nickname: z.string().max(200) }).parse(req.body).nickname));

  io.on('connection', (socket) => {
    let currentRoom = 'MDX26';
    socket.join(currentRoom);
    socket.emit('room:state', getEngine(currentRoom).getState());
    let windowAt = Date.now();
    let eventCount = 0;
    const on = <T extends z.ZodTypeAny>(event: string, schema: T, handler: (input: z.infer<T>) => unknown | Promise<unknown>) => {
      socket.on(event, async (payload: unknown, callback?: (result: any) => void) => {
        try {
          if (Date.now() - windowAt > 1000) { windowAt = Date.now(); eventCount = 0; }
          if (++eventCount > 40) throw new HttpError(429, 'Muitas ações em sequência. Aguarde um instante.');
          const input = schema.parse(payload ?? {});
          const result = await handler(input);
          if (typeof callback === 'function') callback(result);
        } catch (error) {
          const result = requestError(error);
          if (result.statusCode === 500) console.error(`[Socket] ${event}:`, error);
          if (typeof callback === 'function') callback({ ok: false, error: result.error, code: result.code });
          else socket.emit('operation:error', { ok: false, error: result.error });
        }
      });
    };
    const targetInput = z.object({ roomCode: roomCodeSchema.optional() });
    const targetCode = (code?: string) => roomCodeSchema.parse(code || currentRoom);
    const switchRoom = (code: string) => {
      const engine = getEngine(code);
      if (currentRoom !== code) {
        getEngine(currentRoom).handleDisconnect(socket.id);
        socket.leave(currentRoom);
        currentRoom = code;
        socket.join(code);
      }
      return engine;
    };
    on('room:join-session', targetInput, (input) => switchRoom(targetCode(input.roomCode)).getState());
    on('room:request-state', targetInput, (input) => getEngine(targetCode(input.roomCode)).getState());
    on('player:identify', targetInput, async (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      const code = targetCode(input.roomCode);
      const engine = switchRoom(code);
      const profile = await database.findPlayerByDeviceId(deviceId, code);
      if (profile && engine.getState().players.some((p) => p.id === profile.id)) engine.joinRoom(profile, socket.id);
      return { ok: true, profile, state: engine.getState() };
    });
    on('player:register', targetInput.extend({ nickname: z.string().max(200), avatar: avatarSchema.optional() }), async (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      const code = targetCode(input.roomCode);
      const engine = getEngine(code);
      const validation = validateNickname(input.nickname);
      if (!validation.valid) return { ok: false, error: validation.reason, suggestions: validation.suggestions };
      const profile = await database.upsertPlayer({ deviceId, nickname: validation.sanitized, avatar: input.avatar || 'menina-mdx', roomCode: code, isBot: false });
      await engine.refreshLeaderboards();
      return { ok: true, profile };
    });
    on('player:join-room', targetInput.extend({ nickname: z.string().max(200).optional(), avatar: avatarSchema.optional(), roundToken: z.string().max(180).optional() }), async (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      const code = targetCode(input.roomCode);
      const engine = switchRoom(code);
      let profile = await database.findPlayerByDeviceId(deviceId, code);
      const existing = profile && engine.getState().players.some((p) => p.id === profile!.id);
      if (!existing) {
        const validation = engine.validateRoundToken(input.roundToken);
        if (!validation.valid) return { ok: false, error: validation.status === 'ROOM_CLOSED' ? 'As entradas desta sala estão fechadas.' : 'Escaneie o QR Code atual do telão.', expired: validation.status === 'EXPIRED', roundData: validation.roundData, state: engine.getState() };
      }
      if (!profile && input.nickname) {
        const validation = validateNickname(input.nickname);
        if (!validation.valid) return { ok: false, error: validation.reason, suggestions: validation.suggestions, state: engine.getState() };
        profile = await database.upsertPlayer({ deviceId, nickname: validation.sanitized, avatar: input.avatar || 'menina-mdx', roomCode: code, isBot: false });
      }
      if (!profile) return { ok: false, error: 'Cadastre seu apelido nesta sala antes de jogar.', state: engine.getState() };
      const outcome = engine.joinRoom(profile, socket.id, input.roundToken);
      return { ok: outcome.joined, profile, slot: outcome.slot, error: outcome.reason, expired: outcome.expired, roundData: outcome.roundData, state: outcome.state };
    });
    for (const event of ['player:leave-room', 'player:Leave-room']) on(event, targetInput, (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      const engine = getEngine(targetCode(input.roomCode));
      engine.leaveRoom(deviceId);
      return { ok: true, state: engine.getState() };
    });
    on('player:typing', targetInput.extend({ draftPrompt: z.string().max(320) }), (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      getEngine(targetCode(input.roomCode)).setPlayerTyping(deviceId, input.draftPrompt);
      return { ok: true };
    });
    on('player:submit-prompt', targetInput.extend({ prompt: z.string().trim().min(1).max(320), roundToken: z.string().min(1).max(180) }), (input) => {
      const deviceId = auth.requireDevice(socket.request.headers);
      const engine = getEngine(targetCode(input.roomCode));
      if (input.roundToken !== engine.getState().roundToken) throw new HttpError(409, 'Esta rodada já terminou. Escaneie o QR Code atual.');
      const outcome = engine.submitPlayerPrompt(deviceId, input.prompt);
      return { ok: outcome.accepted, state: outcome.state, ...(!outcome.accepted ? { error: 'Não foi possível enviar o palpite nesta rodada.' } : {}) };
    });
    for (const event of ['room:start-with-bots', 'room:fill-bots-now']) on(event, targetInput, async (input) => {
      const code = targetCode(input.roomCode);
      await authorizeRoom(socket.request.headers, code);
      const engine = getEngine(code);
      if (!engine.getState().isOpen) throw new HttpError(409, 'Reabra as entradas antes de iniciar uma nova rodada.');
      engine.fillBotsAndStartNow();
      return { ok: true, state: engine.getState() };
    });
    on('room:reset', targetInput, async (input) => {
      const code = targetCode(input.roomCode);
      await authorizeRoom(socket.request.headers, code);
      cancelRooms(code);
      roomsUpdated();
      return { ok: true, state: getEngine(code).getState() };
    });
    on('moderator:open-room', roomInput.extend({ name: z.string().trim().min(2).max(120).optional() }), async (input) => {
      await authorizeRoom(socket.request.headers, input.roomCode);
      const result = await roomManager.openRoom({ roomCode: input.roomCode, name: input.name || getEngine(input.roomCode).getState().roomName });
      roomsUpdated();
      return result;
    });
    on('moderator:close-room', roomInput, async (input) => {
      await authorizeRoom(socket.request.headers, input.roomCode);
      await roomManager.closeRoom(input.roomCode);
      roomsUpdated();
      return { ok: true, state: getEngine(input.roomCode).getState() };
    });
    on('moderator:kick-player', targetInput.extend({ playerId: z.string().min(1).max(100), reason: z.string().max(200).optional() }), async (input) => {
      const code = targetCode(input.roomCode);
      await authorizeRoom(socket.request.headers, code);
      if (roomManager.isCommittingRound(code)) throw new HttpError(409, 'Aguarde a gravação do resultado para remover participantes.');
      return { ok: getEngine(code).kickPlayer(input.playerId, input.reason).kicked };
    });
    on('room:clear-ranking', targetInput.extend({ confirm: z.literal(true) }), async (input) => {
      const code = targetCode(input.roomCode);
      await authorizeRoom(socket.request.headers, code);
      cancelRooms(code);
      await database.clearAllRankings(code);
      await refreshRooms();
      return { ok: true };
    });
    socket.on('disconnect', () => roomManager.getRoom(currentRoom)?.handleDisconnect(socket.id));
  });

  const publicPath = path.resolve('dist', 'public');
  if (fs.existsSync(publicPath)) {
    await fastify.register(fastifyStatic, { root: publicPath, prefix: '/', wildcard: false });
    fastify.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/') || req.url.startsWith('/socket.io/')) return reply.code(404).send({ ok: false, error: 'Endpoint não encontrado.' });
      return reply.sendFile('index.html');
    });
  }
  return { fastify, io, roomManager, auth, close: async () => { roomManager.dispose(); await new Promise<void>((resolve) => io.close(() => resolve())); await fastify.close(); } };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  createApplication().then(async ({ fastify }) => {
    const host = process.env.HOST || '0.0.0.0';
    const port = Number(process.env.PORT || 3001);
    await fastify.listen({ host, port });
    console.log(`🚀 [MDX STEAM 2026] Servidor Desafio de Prompt rodando em http://${host}:${port}`);
  }).catch((error) => { console.error('❌ Falha crítica ao iniciar o servidor:', error); process.exitCode = 1; });
}
