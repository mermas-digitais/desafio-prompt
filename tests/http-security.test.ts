import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { io as clientSocket, type Socket } from 'socket.io-client';
import { once } from 'node:events';

test('staff ownership, transfer and participant boundaries hold end to end', { timeout: 60000 }, async () => {
  const cwd = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'desafio-security-'));
  const adminPassword = crypto.randomBytes(16).toString('hex');
  Object.assign(process.env, { NODE_ENV: 'test', DATABASE_URL: '', SESSION_SECRET: crypto.randomBytes(32).toString('hex'), BOOTSTRAP_ADMIN_EMAIL: 'admin@example.test', BOOTSTRAP_ADMIN_PASSWORD: adminPassword });
  process.chdir(temp);
  const { createApplication } = await import('../src/server/index.js');
  const app = await createApplication();
  const sockets: Socket[] = [];
  try {
    await app.fastify.listen({ host: '127.0.0.1', port: 0 });
    const address = app.fastify.server.address() as { port: number };
    const base = `http://127.0.0.1:${address.port}`;
    const request = async (route: string, body?: unknown, cookie = '', method = body === undefined ? 'GET' : 'POST') => {
      const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0] || '', body: await response.json() as any };
    };
    const connect = async (cookie = '') => {
      const socket = clientSocket(base, { transports: ['websocket'], extraHeaders: { Cookie: cookie }, reconnection: false });
      sockets.push(socket);
      await once(socket, 'connect');
      return socket;
    };
    const ack = (socket: Socket, event: string, payload: unknown) => socket.timeout(3000).emitWithAck(event, payload) as Promise<any>;

    assert.equal((await request('/api/rooms/create', { roomCode: 'BLOCKED', name: 'Blocked' })).status, 401);
    const login = await request('/api/auth/login', { email: 'admin@example.test', password: adminPassword });
    assert.equal(login.status, 200);
    assert.ok(login.cookie);
    assert.equal(login.body.user.mustChangePassword, true);
    const crossOrigin = await fetch(base + '/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: login.cookie, Origin: 'https://untrusted.example' }, body: '{}' });
    assert.equal(crossOrigin.status, 403);
    assert.equal((await request('/api/rooms/create', { roomCode: 'BLOCKED', name: 'Blocked' }, login.cookie)).status, 409);
    const changed = await request('/api/auth/password', { currentPassword: adminPassword, newPassword: 'new-test-password-123' }, login.cookie);
    assert.equal(changed.status, 200);
    const adminCookie = changed.cookie;
    assert.equal((await request('/api/auth/me', undefined, login.cookie)).body.user, null);

    const moderatorIds: string[] = [];
    const moderatorCookies: string[] = [];
    for (const suffix of ['one', 'two']) {
      const created = await request('/api/users', { name: `Moderator ${suffix}`, email: `${suffix}@example.test`, password: 'temporary-pass-123' }, adminCookie);
      assert.equal(created.status, 201);
      moderatorIds.push(created.body.user.id);
      assert.equal(created.body.user.passwordHash, undefined);
      const initial = await request('/api/auth/login', { email: `${suffix}@example.test`, password: 'temporary-pass-123' });
      const next = await request('/api/auth/password', { currentPassword: 'temporary-pass-123', newPassword: `new-private-password-${suffix}` }, initial.cookie);
      assert.equal(next.status, 200);
      moderatorCookies.push(next.cookie);
    }
    const created = await request('/api/rooms/create', { roomCode: 'AUDITA', name: 'Arena A' }, moderatorCookies[0]);
    assert.equal(created.status, 201);
    assert.equal((await request('/api/rooms/create', { roomCode: 'AUDITA', name: 'Overwrite' }, moderatorCookies[1])).status, 409);
    assert.equal((await request('/api/users', { name: 'NoPrivilege', email: 'forbidden@example.test', password: 'temporary-pass-123' }, moderatorCookies[0])).status, 403);
    await request('/api/rooms/create', { roomCode: 'AUDITB', name: 'Arena B' }, moderatorCookies[1]);
    assert.equal((await request('/api/rooms/close', { roomCode: 'AUDITA' }, moderatorCookies[1])).status, 403);
    assert.equal((await request('/api/rooms/transfer', { roomCode: 'AUDITA', moderatorId: moderatorIds[1] }, moderatorCookies[0])).status, 200);
    assert.equal((await request('/api/rooms/close', { roomCode: 'AUDITA' }, moderatorCookies[0])).status, 403);
    assert.equal((await request('/api/rooms/close', { roomCode: 'AUDITA' }, moderatorCookies[1])).status, 200);
    await request('/api/rooms/open', { roomCode: 'AUDITA' }, moderatorCookies[1]);
    const before = (await request('/api/rooms')).body.rooms.length;
    assert.equal((await request('/api/state?room=GHOST')).status, 404);
    assert.equal((await request('/api/rooms')).body.rooms.length, before);

    const participant = await request('/api/player/session', {});
    const player = await connect(participant.cookie);
    const stranger = await connect();
    await ack(player, 'room:join-session', { roomCode: 'AUDITA' });
    const registered = await ack(player, 'player:register', { roomCode: 'AUDITA', nickname: 'Auditoria', avatar: 'ia', deviceId: 'fake-client-id' });
    assert.equal(registered.ok, true);
    assert.notEqual(registered.profile.deviceId, 'fake-client-id');
    assert.equal((await ack(player, 'player:join-room', { roomCode: 'AUDITA' })).ok, false);
    const state = (await request('/api/state?room=AUDITA')).body;
    assert.equal((await ack(player, 'player:join-room', { roomCode: 'AUDITA', roundToken: state.roundToken })).ok, true);
    const visible = (await request('/api/state?room=AUDITA')).body.players[0];
    assert.equal(visible.deviceId, undefined);
    assert.equal(visible.socketId, undefined);
    assert.equal(visible.submittedPrompt, undefined);
    assert.equal((await ack(stranger, 'room:reset', { roomCode: 'AUDITA' })).ok, false);
    assert.equal((await ack(stranger, 'room:start-with-bots', { roomCode: 'AUDITA' })).ok, false);
    assert.equal((await ack(stranger, 'player:leave-room', { roomCode: 'AUDITA', deviceId: participant.body.deviceId })).ok, false);
    assert.equal((await request('/api/state?room=AUDITA')).body.players.length, 1);

    const another = await ack(player, 'player:register', { roomCode: 'AUDITB', nickname: 'OutroPerfil', avatar: 'ia' });
    assert.notEqual(another.profile.id, registered.profile.id);
    const recovered = await ack(player, 'player:identify', { roomCode: 'AUDITA' });
    assert.equal(recovered.profile.id, registered.profile.id);
    const { database } = await import('../src/server/db/index.js');
    const legacy = await database.upsertPlayer({ deviceId: 'legacy-public-device', nickname: 'PerfilLegado', avatar: 'ia', roomCode: 'MDX26' });
    await database.recordPlayerRoundStats({ deviceId: 'legacy-public-device', roomCode: 'MDX26', roundScore: 650, isWinner: true });
    const recovery = { roomCode: 'MDX26', deviceId: participant.body.deviceId, confirm: true };
    assert.equal((await request(`/api/admin/players/${legacy.id}/rebind`, recovery, moderatorCookies[0])).status, 403);
    assert.equal((await request(`/api/admin/players/${legacy.id}/rebind`, recovery, adminCookie)).status, 200);
    const restored = await ack(player, 'player:identify', { roomCode: 'MDX26' });
    assert.equal(restored.profile.id, legacy.id);
    assert.equal(restored.profile.totalScore, 650);
    await request('/api/rooms/close', { roomCode: 'AUDITA' }, moderatorCookies[1]);
    const closed = (await request('/api/state?room=AUDITA')).body;
    assert.equal(closed.isOpen, false);
    assert.equal(closed.players.length, 1);
    assert.equal(closed.phase, 'LOBBY');

    for (let attempt = 0; attempt < 11; attempt += 1) {
      const denied = await request('/api/auth/login', { email: 'unknown@example.test', password: 'invalid-pass-123' });
      assert.equal(denied.status, attempt < 10 ? 401 : 429);
    }

    await request('/api/auth/logout', {}, moderatorCookies[1]);
    assert.equal((await request('/api/rooms/open', { roomCode: 'AUDITA' }, moderatorCookies[1])).status, 401);
  } finally {
    for (const socket of sockets) socket.disconnect();
    await app.close();
    process.chdir(cwd);
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
