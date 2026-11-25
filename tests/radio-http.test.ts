import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { once } from 'node:events';
import { io, type Socket } from 'socket.io-client';

test('global radio crosses room subscriptions; only staff can persist a validated playlist', { timeout: 60000 }, async () => {
  const cwd = process.cwd(), temp = fs.mkdtempSync(path.join(os.tmpdir(), 'radio-http-'));
  Object.assign(process.env, { NODE_ENV: 'test', DATABASE_URL: '', SESSION_SECRET: crypto.randomBytes(32).toString('hex'), BOOTSTRAP_ADMIN_EMAIL: 'radio@example.test', BOOTSTRAP_ADMIN_PASSWORD: 'initial-password-qa' });
  process.chdir(temp);
  const { createApplication } = await import('../src/server/index.js');
  const catalog = {
    async playlist(url: string) { return { url, title: url.includes('/album/') ? 'Changed playlist' : 'Initial playlist', coverUrl: '', tracks: [{ uri: 'one', title: 'One', artist: 'QA' }] }; },
    async media() { return { videoId: 'abcdefghijk', durationSec: 300 }; },
  };
  let app = await createApplication({ radioCatalog: catalog });
  const sockets: Socket[] = [];
  try {
    await app.fastify.listen({ host: '127.0.0.1', port: 0 });
    let base = `http://127.0.0.1:${(app.fastify.server.address() as { port: number }).port}`;
    const request = async (route: string, cookie = '', body?: unknown, method = body ? 'POST' : 'GET', origin?: string) => {
      const response = await fetch(base + route, { method, headers: { Cookie: cookie, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(origin ? { Origin: origin } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
      return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0] || '', body: await response.json() as any };
    };
    const state = (await request('/api/radio')).body;
    await app.radio.start();
    assert.ok(state.epoch);
    assert.equal(app.roomManager.listSessions().length, 0, 'radio does not create a game');
    const current = (await request('/api/radio')).body;
    const changedUrl = 'https://open.spotify.com/album/4uYdic4V50S6NQEEFYkW63';
    const edit = { url: changedUrl, epoch: current.epoch, revision: current.revision };
    assert.equal((await request('/api/radio/playlist', '', edit, 'PUT')).status, 401);
    const initial = await request('/api/auth/login', '', { email: 'radio@example.test', password: 'initial-password-qa' });
    assert.equal((await request('/api/radio/playlist', initial.cookie, edit, 'PUT')).status, 409);
    const password = await request('/api/auth/password', initial.cookie, { currentPassword: 'initial-password-qa', newPassword: 'new-private-password-qa' });
    await request('/api/users', password.cookie, { name: 'Radio Mod', email: 'mod@example.test', password: 'temporary-password-qa' });
    const modLogin = await request('/api/auth/login', '', { email: 'mod@example.test', password: 'temporary-password-qa' });
    const mod = await request('/api/auth/password', modLogin.cookie, { currentPassword: 'temporary-password-qa', newPassword: 'new-mod-password-qa' });
    await request('/api/rooms/create', mod.cookie, { roomCode: 'B', name: 'Other room' });
    for (const roomCode of ['MDX26', 'B']) {
      const socket = io(base, { transports: ['websocket'], reconnection: false }); sockets.push(socket);
      await once(socket, 'connect');
      await socket.timeout(3000).emitWithAck('room:watch', { roomCode });
      const snapshot = await socket.timeout(3000).emitWithAck('radio:subscribe');
      assert.equal(snapshot.track.videoId, current.track.videoId);
      assert.equal(snapshot.startedAt, current.startedAt);
    }
    const events = sockets.map((socket) => once(socket, 'radio:state'));
    assert.equal((await request('/api/radio/playlist', mod.cookie, edit, 'PUT', 'https://untrusted.example')).status, 403);
    const changed = await request('/api/radio/playlist', mod.cookie, edit, 'PUT');
    assert.equal(changed.status, 200);
    for (const event of await Promise.all(events)) {
      assert.equal(event[0].revision, changed.body.revision);
      assert.equal(event[0].playlistTitle, 'Changed playlist');
      assert.equal(event[0].startedAt, changed.body.startedAt);
    }
    assert.equal((await request('/api/radio/playlist', mod.cookie, edit, 'PUT')).status, 409, 'stale control cannot replace a newer playlist');
    const badUrl = await request('/api/radio/playlist', mod.cookie, { ...edit, epoch: changed.body.epoch, revision: changed.body.revision, url: 'https://127.0.0.1/private' }, 'PUT');
    assert.equal(badUrl.status, 400);
    assert.equal(app.radio.snapshot().playlistUrl, changedUrl);
    assert.equal((await request('/api/radio/pause', '', {}, 'POST')).status, 404, 'no shared pause endpoint');
    const { database } = await import('../src/server/db/index.js');
    assert.equal(await database.getRadioPlaylistUrl(), changedUrl);
    sockets.forEach((socket) => socket.disconnect());
    await app.close();
    app = await createApplication({ radioCatalog: catalog });
    await app.radio.start();
    assert.equal(app.radio.snapshot().playlistUrl, changedUrl, 'playlist selection survives restart');
    assert.notEqual(app.radio.snapshot().epoch, current.epoch, 'new runtime rejects old revisions');
  } finally {
    sockets.forEach((socket) => socket.disconnect()); await app.close(); process.chdir(cwd); fs.rmSync(temp, { recursive: true, force: true });
  }
});
