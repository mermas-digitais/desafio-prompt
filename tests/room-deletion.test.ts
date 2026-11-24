import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { once } from 'node:events';
import { io, type Socket } from 'socket.io-client';
import { drizzle } from 'drizzle-orm/node-postgres';
import type pg from 'pg';
import * as schema from '../src/server/db/schema.js';

// The server singleton captures cwd at import time; never bind it to the developer's .data.
const originalCwd = process.cwd();
const singletonDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'room-deletion-singleton-'));
process.chdir(singletonDirectory);
const { AppDatabase } = await import('../src/server/db/index.js');
process.chdir(originalCwd);
after(() => fs.rmSync(singletonDirectory, { recursive: true, force: true }));

test('room deletion atomically removes only its data and does not recreate the last room on reload', async () => {
  const base = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Temp', 'opencode') : os.tmpdir();
  fs.mkdirSync(base, { recursive: true });
  const temp = fs.mkdtempSync(path.join(base, 'delete-room-db-'));
  try {
    const file = path.join(temp, 'db.json');
    const db = new AppDatabase({ localFile: file });
    const staff = await db.createStaffUser({ email: 'staff@example.test', name: 'Staff', passwordHash: 'hash', role: 'admin', mustChangePassword: false });
    for (const roomCode of ['MDX26', 'B']) {
      await db.createRoom(roomCode, roomCode);
      await db.upsertPlayer({ roomCode, deviceId: 'same-device', nickname: roomCode, avatar: 'ia' });
      await db.recordMatch({ roomCode, challengeId: 'sample', winnerPlayerId: null, results: [] });
    }
    assert.equal(await db.deleteRoom('missing'), false);
    const originalSave = (db as any).saveLocalStore;
    (db as any).saveLocalStore = () => { throw new Error('disk full'); };
    await assert.rejects(db.deleteRoom('MDX26'), /disk full/);
    assert.ok(await db.findPlayerByDeviceId('same-device', 'MDX26'));
    assert.equal((await db.getLeaderboards(100, 'MDX26')).stats.totalMatches, 1);
    (db as any).saveLocalStore = originalSave;
    assert.equal(await db.deleteRoom('MDX26'), true);
    assert.equal(await db.findPlayerByDeviceId('same-device', 'MDX26'), null);
    assert.equal((await db.getLeaderboards(100, 'MDX26')).stats.totalMatches, 0);
    assert.ok(await db.findPlayerByDeviceId('same-device', 'B'));
    assert.equal((await db.getLeaderboards(100, 'B')).stats.totalMatches, 1);
    assert.equal((await db.getStaffUsers())[0].id, staff.id);
    assert.equal(await db.deleteRoom('B'), true);
    assert.deepEqual(await db.getRooms(), []);
    assert.deepEqual(await new AppDatabase({ localFile: file }).getRooms(), []);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test('PostgreSQL room deletion locks the room and rolls back dependent deletion on failure', async () => {
  for (const shouldFail of [false, true]) {
    const queries: string[] = [];
    const client = { query: async (config: string | { text: string }) => {
      const text = typeof config === 'string' ? config : config.text;
      queries.push(text);
      if (shouldFail && /^delete from "players"/i.test(text)) throw new Error('delete failed');
      return { rows: /^select/i.test(text) ? [['A']] : [], rowCount: 1 };
    }, release() {} };
    const db = new AppDatabase({ localFile: null });
    Object.assign(db, { useLocalDb: false, db: drizzle({ ...client, connect: async () => client } as unknown as pg.Pool, { schema }) });
    if (shouldFail) await assert.rejects(db.deleteRoom('A'), /delete failed/);
    else assert.equal(await db.deleteRoom('A'), true);
    assert.equal(queries[0], 'begin');
    assert.match(queries[1], /for update/i);
    assert.ok(queries.some((query) => /^delete from "matches"/i.test(query)));
    assert.equal(queries.at(-1), shouldFail ? 'rollback' : 'commit');
    assert.equal(queries.some((query) => /^delete from "rooms"/i.test(query)), !shouldFail);
  }
});

test('PostgreSQL registration locks the room and cannot write after its deletion', async () => {
  const queries: string[] = [];
  const client = { query: async (config: string | { text: string }) => {
    const text = typeof config === 'string' ? config : config.text;
    queries.push(text);
    return { rows: [], rowCount: 0 };
  }, release() {} };
  const db = new AppDatabase({ localFile: null });
  Object.assign(db, { useLocalDb: false, db: drizzle({ ...client, connect: async () => client } as unknown as pg.Pool, { schema }) });
  await assert.rejects(db.upsertPlayer({ roomCode: 'A', deviceId: 'pending', nickname: 'Pending', avatar: 'ia' }), /Room no longer exists/);
  assert.equal(queries[0], 'begin');
  assert.match(queries[1], /from "rooms".*for key share/i);
  assert.equal(queries.at(-1), 'rollback');
  assert.equal(queries.some((query) => /^insert/i.test(query)), false);
});

test('moderator deletes any room with exact confirmation; last-room deletion keeps service usable', { timeout: 60000 }, async () => {
  const root = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'delete-room-http-'));
  Object.assign(process.env, { NODE_ENV: 'test', DATABASE_URL: '', SESSION_SECRET: crypto.randomBytes(32).toString('hex'), BOOTSTRAP_ADMIN_EMAIL: 'admin@example.test', BOOTSTRAP_ADMIN_PASSWORD: 'initial-test-password' });
  process.chdir(temp);
  const { createApplication } = await import('../src/server/index.js');
  let app = await createApplication();
  const sockets: Socket[] = [];
  try {
    await app.fastify.listen({ host: '127.0.0.1', port: 0 });
    let base = `http://127.0.0.1:${(app.fastify.server.address() as { port: number }).port}`;
    const request = async (route: string, cookie = '', method = 'GET', body?: unknown) => {
      const response = await fetch(base + route, { method, headers: { Cookie: cookie, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0] || '', body: await response.json() as any };
    };
    const login = await request('/api/auth/login', '', 'POST', { email: 'admin@example.test', password: 'initial-test-password' });
    const admin = await request('/api/auth/password', login.cookie, 'POST', { currentPassword: 'initial-test-password', newPassword: 'new-test-password-123' });
    await request('/api/users', admin.cookie, 'POST', { name: 'Moderator', email: 'mod@example.test', password: 'initial-test-password' });
    const initial = await request('/api/auth/login', '', 'POST', { email: 'mod@example.test', password: 'initial-test-password' });
    assert.equal((await request('/api/rooms/MDX26?confirm=MDX26', initial.cookie, 'DELETE')).status, 409);
    const mod = await request('/api/auth/password', initial.cookie, 'POST', { currentPassword: 'initial-test-password', newPassword: 'new-test-password-123' });
    await request('/api/rooms/create', admin.cookie, 'POST', { roomCode: 'B', name: 'Other room' });
    const { database } = await import('../src/server/db/index.js');
    for (const roomCode of ['MDX26', 'B']) {
      await database.upsertPlayer({ roomCode, deviceId: 'same-device', nickname: 'Fixture', avatar: 'ia' });
      await database.recordMatch({ roomCode, challengeId: 'sample', winnerPlayerId: null, results: [] });
    }
    const observer = io(base, { transports: ['websocket'], reconnection: false });
    sockets.push(observer);
    await once(observer, 'connect');
    assert.equal((await request('/api/rooms/MDX26?confirm=MDX26', '', 'DELETE')).status, 401);
    assert.equal((await request('/api/rooms/MDX26', mod.cookie, 'DELETE')).status, 400);
    assert.equal((await request('/api/rooms/MDX26?confirm=B', mod.cookie, 'DELETE')).status, 400);
    const deletedEvent = once(observer, 'room:deleted');
    assert.equal((await request('/api/rooms/MDX26?confirm=MDX26', mod.cookie, 'DELETE')).status, 200);
    assert.equal((await deletedEvent)[0].roomCode, 'MDX26');
    assert.equal((await request('/api/state?room=MDX26')).status, 404);
    assert.equal((await request('/api/rooms/MDX26?confirm=MDX26', mod.cookie, 'DELETE')).status, 404);
    assert.equal(await database.findPlayerByDeviceId('same-device', 'MDX26'), null);
    assert.ok(await database.findPlayerByDeviceId('same-device', 'B'));
    const health = await request('/api/health');
    assert.equal(health.status, 200);
    assert.equal(health.body.roomCode, 'B');
    const sessionId = crypto.randomUUID();
    const createdSession = await request('/api/sessions', mod.cookie, 'POST', { roomCode: 'B', id: sessionId, name: 'TV B' });
    assert.equal(createdSession.status, 201);
    const joined = await observer.timeout(3000).emitWithAck('room:join-session', { roomCode: 'B', sessionId });
    assert.equal(joined.roomCode, 'B');
    assert.equal((await request('/api/rooms/B?confirm=B', mod.cookie, 'DELETE')).status, 200);
    assert.deepEqual((await request('/api/rooms')).body.rooms, []);
    assert.equal((await request('/api/health')).status, 200);
    assert.equal((await request('/api/state')).status, 404);
    for (const socket of sockets) socket.disconnect();
    await app.close();
    app = await createApplication();
    await app.fastify.listen({ host: '127.0.0.1', port: 0 });
    base = `http://127.0.0.1:${(app.fastify.server.address() as { port: number }).port}`;
    assert.deepEqual((await request('/api/rooms')).body.rooms, []);
    const emptyObserver = io(base, { transports: ['websocket'], reconnection: false });
    sockets.push(emptyObserver);
    await once(emptyObserver, 'connect');
    const missing = await emptyObserver.timeout(3000).emitWithAck('room:request-state', { roomCode: 'MDX26' });
    assert.equal(missing.ok, false);
    assert.equal((await request('/api/rooms/create', mod.cookie, 'POST', { roomCode: 'MDX26', name: 'New main room' })).status, 201);
    assert.equal((await request('/api/health')).status, 200);
    assert.equal(await database.findPlayerByDeviceId('same-device', 'MDX26'), null);
    assert.equal((await database.getLeaderboards(100, 'MDX26')).stats.totalMatches, 0);
  } finally {
    for (const socket of sockets) socket.disconnect();
    await app.close(); process.chdir(root); fs.rmSync(temp, { recursive: true, force: true });
  }
});
