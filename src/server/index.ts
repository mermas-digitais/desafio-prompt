import 'dotenv/config';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer } from 'socket.io';
import { database } from './db/index.js';
import { validateNickname } from './moderation/profanityFilter.js';
import { GameEngine } from './game/GameEngine.js';
import type { AvatarId, PlayerSlot } from '../shared/types.js';

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

function getLanIpAddresses(): { primaryIp: string; allIps: string[] } {
  const nets = os.networkInterfaces();
  const candidates: { ip: string; score: number }[] = [];

  for (const [name, interfaces] of Object.entries(nets)) {
    if (!interfaces) continue;
    for (const net of interfaces) {
      if (net.family === 'IPv4' && !net.internal) {
        const ip = net.address;
        if (ip.startsWith('169.254.')) continue;
        let score = 10;
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
          score += 40;
        } else if (lowerName.includes('ethernet') || lowerName.includes('eth') || lowerName.includes('en0')) {
          score += 20;
        }
        // Evita priorizar adaptadores virtuais (VirtualBox 192.168.56.x, Hotspot 192.168.137.x, WSL, Docker)
        if (
          ip.startsWith('192.168.56.') ||
          ip.startsWith('192.168.137.') ||
          lowerName.includes('vethernet') ||
          lowerName.includes('wsl') ||
          lowerName.includes('vbox') ||
          lowerName.includes('vmware') ||
          lowerName.includes('conexão local*') ||
          lowerName.includes('local area connection*')
        ) {
          score -= 35;
        }
        candidates.push({ ip, score });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const allIps = candidates.map((c) => c.ip);
  return {
    primaryIp: allIps[0] || 'localhost',
    allIps,
  };
}

async function bootstrap() {
  await database.init();

  const fastify = Fastify({
    logger: false,
  });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  const gameEngine = new GameEngine(io);
  await gameEngine.start();

  // ============================================================================
  // REST API Endpoints
  // ============================================================================

  fastify.get('/api/health', async () => {
    return {
      status: 'ok',
      service: 'desafio-prompt-mdx26',
      database: database.getDatabaseVersion(),
      spotifyPlaylistUrl:
        process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || '',
      aiProviders: {
        openaiConfigured: Boolean(
          process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sua-chave-aqui'
        ),
        groqConfigured: Boolean(
          process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'sua-chave-aqui'
        ),
        localFallback: true,
      },
      roomPhase: gameEngine.getState().phase,
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/api/config', async () => {
    const { primaryIp, allIps } = getLanIpAddresses();
    const rawPublicUrl = (
      process.env.PUBLIC_APP_URL ||
      process.env.VITE_PUBLIC_APP_URL ||
      ''
    ).trim();
    const publicAppUrl =
      rawPublicUrl && !/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(rawPublicUrl)
        ? rawPublicUrl.replace(/\/+$/, '')
        : '';

    return {
      spotifyPlaylistUrl:
        process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || '',
      roomCode: gameEngine.getState().roomCode,
      lanIp: primaryIp,
      allLanIps: allIps,
      publicAppUrl,
    };
  });

  const spotifyCache = new Map<
    string,
    {
      playlistTitle: string;
      coverUrl: string;
      tracks: Array<{
        uri: string;
        title: string;
        subtitle: string;
        duration: number;
        previewUrl: string;
      }>;
      fetchedAt: number;
    }
  >();

  const youtubeTrackCache = new Map<string, string[]>();

  fastify.get<{ Querystring: { url?: string } }>('/api/spotify-playlist', async (req) => {
    const rawUrl = (
      req.query?.url ||
      process.env.SPOTIFY_PLAYLIST_URL ||
      process.env.VITE_SPOTIFY_PLAYLIST_URL ||
      'https://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63'
    ).trim();

    let entityType = 'playlist';
    let entityId = '4uYdic4V50S6NQEEFYkW63';

    const uriMatch = rawUrl.match(/^spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/i);
    const urlMatch = rawUrl.match(
      /open\.spotify\.com\/(?:embed\/)?(?:intl-[a-zA-Z-]+\/)?(playlist|album|track|artist)\/([a-zA-Z0-9]+)/i
    );

    if (uriMatch) {
      entityType = uriMatch[1].toLowerCase();
      entityId = uriMatch[2];
    } else if (urlMatch) {
      entityType = urlMatch[1].toLowerCase();
      entityId = urlMatch[2];
    }

    const cacheKey = `${entityType}:${entityId}`;
    const cached = spotifyCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < 1000 * 60 * 30) {
      return {
        ok: true,
        entityUri: `spotify:${entityType}:${entityId}`,
        playlistTitle: cached.playlistTitle,
        coverUrl: cached.coverUrl,
        tracks: cached.tracks,
      };
    }

    try {
      const embedPageUrl = `https://open.spotify.com/embed/${entityType}/${entityId}`;
      const response = await fetch(embedPageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      });
      const html = await response.text();
      const idx = html.indexOf('__NEXT_DATA__');
      if (idx !== -1) {
        const startJson = html.indexOf('>', idx) + 1;
        const endJson = html.indexOf('</script>', startJson);
        if (startJson > 0 && endJson > startJson) {
          const parsed = JSON.parse(html.slice(startJson, endJson));
          const entity = parsed?.props?.pageProps?.state?.data?.entity;
          const playlistTitle = entity?.title || entity?.name || 'Trilha Sonora MDX';
          const images: Array<{ url?: string }> = Array.isArray(entity?.visualIdentity?.image)
            ? entity.visualIdentity.image
            : [];
          const coverUrl =
            images[1]?.url || images[0]?.url || images[images.length - 1]?.url || '';

          const rawTracks: Array<{
            uri?: string;
            title?: string;
            subtitle?: string;
            duration?: number;
            isPlayable?: boolean;
            audioPreview?: { url?: string };
          }> = Array.isArray(entity?.trackList) ? entity.trackList : [];

          const tracks = rawTracks
            .filter((t) => Boolean(t?.uri) && t.isPlayable !== false)
            .map((t) => ({
              uri: String(t.uri),
              title: String(t.title || 'Faixa'),
              subtitle: String(t.subtitle || ''),
              duration: Number(t.duration || 0),
              previewUrl: String(t.audioPreview?.url || ''),
            }));

          if (tracks.length > 0) {
            spotifyCache.set(cacheKey, {
              playlistTitle,
              coverUrl,
              tracks,
              fetchedAt: Date.now(),
            });
            return {
              ok: true,
              entityUri: `spotify:${entityType}:${entityId}`,
              playlistTitle,
              coverUrl,
              tracks,
            };
          }
        }
      }
    } catch {
      // Fallback caso offline ou bloqueio de rede
    }

    return {
      ok: false,
      entityUri: `spotify:${entityType}:${entityId}`,
      playlistTitle: 'Trilha Sonora MDX',
      coverUrl: '',
      tracks: [],
    };
  });

  // Resolve o ID de áudio completo no YouTube para tocar a faixa inteira sem o banner de 30s do Spotify
  fastify.get<{ Querystring: { q?: string } }>('/api/spotify-track-video', async (req) => {
    const query = (req.query?.q || '').trim();
    if (!query) {
      return { ok: false, videoIds: [] };
    }

    const cached = youtubeTrackCache.get(query.toLowerCase());
    if (cached && cached.length > 0) {
      return { ok: true, videoIds: cached };
    }

    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${query} official audio`
      )}`;
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
        },
      });
      const html = await res.text();
      const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
      const uniqueIds = [...new Set(matches)].slice(0, 4);
      if (uniqueIds.length > 0) {
        youtubeTrackCache.set(query.toLowerCase(), uniqueIds);
        return { ok: true, videoIds: uniqueIds };
      }
    } catch {
      // Ignora se sem internet externa
    }

    return { ok: false, videoIds: [] };
  });

  // ============================================================================
  // Rotas de Administração Protegidas por Senha (ADMIN_PASSWORD no .env)
  // ============================================================================

  const verifyAdminPassword = (provided?: string): boolean => {
    const expected = (process.env.ADMIN_PASSWORD || 'mdx2026').trim();
    return Boolean(provided && provided.trim() === expected);
  };

  fastify.post<{ Body: { password?: string } }>('/api/admin/login', async (req, reply) => {
    const isValid = verifyAdminPassword(req.body?.password);
    if (!isValid) {
      return reply.code(401).send({ ok: false, error: 'Senha administrativa incorreta.' });
    }
    return {
      ok: true,
      database: database.getDatabaseVersion(),
    };
  });

  fastify.get('/api/admin/ranking', async (req, reply) => {
    const headerPwd = req.headers['x-admin-password'] as string | undefined;
    if (!verifyAdminPassword(headerPwd)) {
      return reply.code(401).send({ ok: false, error: 'Não autorizado.' });
    }

    const [players, leaderboards] = await Promise.all([
      database.getAllPlayersForAdmin(),
      database.getLeaderboards(50),
    ]);

    return {
      ok: true,
      database: database.getDatabaseVersion(),
      players,
      stats: leaderboards.stats,
    };
  });

  fastify.post('/api/admin/clear-ranking', async (req, reply) => {
    const headerPwd = req.headers['x-admin-password'] as string | undefined;
    if (!verifyAdminPassword(headerPwd)) {
      return reply.code(401).send({ ok: false, error: 'Não autorizado.' });
    }

    await database.clearAllRankings();
    await gameEngine.refreshLeaderboards();

    const [players, leaderboards] = await Promise.all([
      database.getAllPlayersForAdmin(),
      database.getLeaderboards(50),
    ]);

    return {
      ok: true,
      players,
      stats: leaderboards.stats,
    };
  });

  fastify.delete<{ Params: { id: string } }>('/api/admin/players/:id', async (req, reply) => {
    const headerPwd = req.headers['x-admin-password'] as string | undefined;
    if (!verifyAdminPassword(headerPwd)) {
      return reply.code(401).send({ ok: false, error: 'Não autorizado.' });
    }

    const deleted = await database.deletePlayerById(req.params.id);
    await gameEngine.refreshLeaderboards();

    const [players, leaderboards] = await Promise.all([
      database.getAllPlayersForAdmin(),
      database.getLeaderboards(50),
    ]);

    return {
      ok: deleted,
      players,
      stats: leaderboards.stats,
    };
  });

  fastify.get('/api/leaderboards', async () => {
    return await database.getLeaderboards(20);
  });

  fastify.get('/api/state', async () => {
    return gameEngine.getState();
  });

  fastify.post<{ Body: { nickname?: string } }>('/api/validate-nickname', async (req) => {
    const raw = req.body?.nickname ?? '';
    return validateNickname(raw);
  });

  // ============================================================================
  // Socket.io Realtime Events
  // ============================================================================

  io.on('connection', (socket) => {
    // Envia estado imediato ao conectar (TV ou Mobile)
    socket.emit('room:state', gameEngine.getState());

    socket.on('room:request-state', (cb?: (state: unknown) => void) => {
      const state = gameEngine.getState();
      socket.emit('room:state', state);
      if (typeof cb === 'function') cb(state);
    });

    // 1. Identificar dispositivo (recuperar perfil salvo e High Score)
    socket.on(
      'player:identify',
      async (
        payload: { deviceId?: string },
        cb?: (res: { ok: boolean; profile: unknown; state: unknown }) => void
      ) => {
        try {
          const deviceId = (payload?.deviceId || '').trim();
          if (!deviceId) {
            const resp = { ok: false, profile: null, state: gameEngine.getState() };
            if (typeof cb === 'function') cb(resp);
            return;
          }

          const profile = await database.findPlayerByDeviceId(deviceId);
          // Se o jogador já estava na sala atual, reconecta o socketId
          if (profile) {
            const currentRoomPlayer = gameEngine
              .getState()
              .players.find((p) => p.deviceId === deviceId);
            if (currentRoomPlayer) {
              gameEngine.joinRoom(profile, socket.id);
            }
          }

          const resp = { ok: true, profile, state: gameEngine.getState() };
          socket.emit('player:identified', resp);
          if (typeof cb === 'function') cb(resp);
        } catch (err) {
          console.error('❌ [Socket] Erro em player:identify:', err);
          if (typeof cb === 'function') {
            cb({ ok: false, profile: null, state: gameEngine.getState() });
          }
        }
      }
    );

    // 2. Registrar / atualizar apelido e avatar (com filtro de nomes impróprios)
    socket.on(
      'player:register',
      async (
        payload: { deviceId?: string; nickname?: string; avatar?: AvatarId },
        cb?: (res: {
          ok: boolean;
          profile?: unknown;
          error?: string;
          suggestions?: string[];
        }) => void
      ) => {
        try {
          const deviceId = (payload?.deviceId || '').trim();
          const rawNickname = payload?.nickname || '';
          const avatar: AvatarId = payload?.avatar || 'menina-mdx';

          if (!deviceId) {
            const res = { ok: false, error: 'Dispositivo não identificado.' };
            socket.emit('player:register-result', res);
            if (typeof cb === 'function') cb(res);
            return;
          }

          const validation = validateNickname(rawNickname);
          if (!validation.valid) {
            const res = {
              ok: false,
              error: validation.reason || 'Apelido inválido.',
              suggestions: validation.suggestions,
            };
            socket.emit('player:register-result', res);
            if (typeof cb === 'function') cb(res);
            return;
          }

          const profile = await database.upsertPlayer({
            deviceId,
            nickname: validation.sanitized,
            avatar,
            isBot: false,
          });

          await gameEngine.refreshLeaderboards();

          const res = { ok: true, profile };
          socket.emit('player:register-result', res);
          if (typeof cb === 'function') cb(res);
        } catch (err) {
          console.error('❌ [Socket] Erro em player:register:', err);
          const res = { ok: false, error: 'Erro interno ao registrar jogadora.' };
          if (typeof cb === 'function') cb(res);
        }
      }
    );

    // 3. Entrar na sala (ocupa Slot 1..5 e dispara contador de 1m30s do Lobby)
    socket.on(
      'player:join-room',
      async (
        payload: { deviceId?: string; nickname?: string; avatar?: AvatarId },
        cb?: (res: {
          ok: boolean;
          slot?: PlayerSlot;
          profile?: unknown;
          error?: string;
          suggestions?: string[];
          state: unknown;
        }) => void
      ) => {
        try {
          const deviceId = (payload?.deviceId || '').trim();
          if (!deviceId) {
            const res = {
              ok: false,
              error: 'DeviceId obrigatório.',
              state: gameEngine.getState(),
            };
            if (typeof cb === 'function') cb(res);
            return;
          }

          let profile = await database.findPlayerByDeviceId(deviceId);

          // Se enviou nickname junto ou ainda não tinha perfil salvo, valida e cria/atualiza
          if (payload?.nickname) {
            const validation = validateNickname(payload.nickname);
            if (!validation.valid) {
              const res = {
                ok: false,
                error: validation.reason,
                suggestions: validation.suggestions,
                state: gameEngine.getState(),
              };
              socket.emit('player:join-result', res);
              if (typeof cb === 'function') cb(res);
              return;
            }
            profile = await database.upsertPlayer({
              deviceId,
              nickname: validation.sanitized,
              avatar: payload.avatar || profile?.avatar || 'menina-mdx',
              isBot: false,
            });
          }

          if (!profile) {
            const res = {
              ok: false,
              error: 'Registre seu apelido antes de entrar na partida!',
              state: gameEngine.getState(),
            };
            socket.emit('player:join-result', res);
            if (typeof cb === 'function') cb(res);
            return;
          }

          const joinOutcome = gameEngine.joinRoom(profile, socket.id);
          const res = {
            ok: joinOutcome.joined,
            slot: joinOutcome.slot,
            profile,
            error: joinOutcome.reason,
            state: joinOutcome.state,
          };

          socket.emit('player:join-result', res);
          if (typeof cb === 'function') cb(res);
        } catch (err) {
          console.error('❌ [Socket] Erro em player:join-room:', err);
          if (typeof cb === 'function') {
            cb({
              ok: false,
              error: 'Erro ao entrar na sala.',
              state: gameEngine.getState(),
            });
          }
        }
      }
    );

    // 4. Sair da sala (suporta player:leave-room e player:Leave-room)
    const handleLeaveRoom = (payload: { deviceId?: string }, cb?: (res: { ok: boolean }) => void) => {
      const deviceId = (payload?.deviceId || '').trim();
      if (deviceId) {
        gameEngine.leaveRoom(deviceId);
      }
      if (typeof cb === 'function') cb({ ok: true });
    };

    socket.on('player:leave-room', handleLeaveRoom);
    socket.on('player:Leave-room', handleLeaveRoom);

    // 5. Indicador de digitação ao vivo + rascunho em tempo real
    socket.on('player:typing', (payload: { deviceId?: string; draftPrompt?: string }) => {
      const deviceId = (payload?.deviceId || '').trim();
      if (!deviceId) return;
      gameEngine.setPlayerTyping(deviceId, payload?.draftPrompt || '');
    });

    // 6. Enviar e travar palpite de prompt
    socket.on(
      'player:submit-prompt',
      (
        payload: { deviceId?: string; prompt?: string },
        cb?: (res: { ok: boolean; state: unknown }) => void
      ) => {
        const deviceId = (payload?.deviceId || '').trim();
        const prompt = payload?.prompt || '';
        const outcome = gameEngine.submitPlayerPrompt(deviceId, prompt);
        const res = { ok: outcome.accepted, state: outcome.state };
        socket.emit('player:prompt-locked', res);
        if (typeof cb === 'function') cb(res);
      }
    );

    // 7. Atalho para preencher vagas restantes com Bot Mermã imediatamente
    const handleStartWithBots = (_payload?: unknown, cb?: (res: { ok: boolean }) => void) => {
      gameEngine.fillBotsAndStartNow();
      if (typeof cb === 'function') cb({ ok: true });
    };

    socket.on('room:start-with-bots', handleStartWithBots);
    socket.on('room:fill-bots-now', handleStartWithBots);

    // 8. Resetar sala para IDLE
    socket.on('room:reset', (_payload?: unknown, cb?: (res: { ok: boolean }) => void) => {
      gameEngine.resetToIdle();
      if (typeof cb === 'function') cb({ ok: true });
    });

    // 9. Limpar Ranking Geral (protegido por ADMIN_PASSWORD)
    socket.on(
      'room:clear-ranking',
      async (
        payload?: { password?: string },
        cb?: (res: { ok: boolean; error?: string }) => void
      ) => {
        if (!verifyAdminPassword(payload?.password)) {
          if (typeof cb === 'function') {
            cb({ ok: false, error: 'Apenas administradores podem limpar o ranking (/admin).' });
          }
          return;
        }
        await database.clearAllRankings();
        await gameEngine.refreshLeaderboards();
        if (typeof cb === 'function') cb({ ok: true });
      }
    );

    socket.on('disconnect', () => {
      gameEngine.handleDisconnect(socket.id);
    });
  });

  // ============================================================================
  // Produção: Servir arquivos estáticos do Vite SPA (dist/public)
  // ============================================================================

  const publicDistPath = path.resolve(process.cwd(), 'dist', 'public');
  if (fs.existsSync(publicDistPath)) {
    await fastify.register(fastifyStatic, {
      root: publicDistPath,
      prefix: '/',
      wildcard: false,
    });

    fastify.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/') || req.url.startsWith('/socket.io/')) {
        reply.code(404).send({ error: 'Endpoint não encontrado' });
        return;
      }
      reply.sendFile('index.html');
    });
  }

  await fastify.listen({ port: PORT, host: HOST });
  console.log(`🚀 [MDX STEAM 2026] Servidor Desafio de Prompt rodando em http://${HOST}:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('❌ Falha crítica ao iniciar o servidor:', err);
  process.exit(1);
});
