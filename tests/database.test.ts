import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { drizzle } from 'drizzle-orm/node-postgres';
import type pg from 'pg';
import * as schema from '../src/server/db/schema.js';
import { AppDatabase } from '../src/server/db/index.js';
import { OFFICIAL_CHALLENGES } from '../src/server/db/challengesData.js';

const roundEvaluation = {
  playerId: 'player-id', nickname: 'Winner', avatar: 'menina-mdx', slot: 1,
  isBot: false, submittedPrompt: 'Final evaluated prompt', lockedAtRemainingSeconds: 12,
  subjectScore: 200, styleScore: 200, detailsScore: 200, speedBonus: 10,
  totalScore: 610, similarityPercent: 60, intentMatched: ['subject'], intentMissed: [],
  aiFeedback: 'Good!', evaluatorUsed: 'local', isWinner: true, isNewHighScore: true,
  deviceId: 'private-device', socketId: 'private-socket', profile: { deviceId: 'private-device' },
};

const fresh = () => new AppDatabase({ localFile: null });
const player = (db: AppDatabase, roomCode: string) => db.upsertPlayer({
  roomCode, deviceId: 'same-device', nickname: roomCode, avatar: 'menina-mdx',
});

test('device profiles and round stats stay in their room', async () => {
  const db = fresh();
  const a = await player(db, 'A');
  const b = await player(db, 'B');
  assert.notEqual(a.id, b.id);
  assert.equal(a.roomCode, 'A');
  await Promise.all(Array.from({ length: 10 }, () => db.recordPlayerRoundStats({
    deviceId: 'same-device', roomCode: 'A', roundScore: 10, isWinner: true,
  })));
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.totalScore, 100);
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.matchesPlayed, 10);
  assert.equal((await db.findPlayerByDeviceId('same-device', 'B'))?.totalScore, 0);
  assert.equal(await db.findPlayerByDeviceId('same-device'), null);
  await player(db, 'A');
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.id, a.id);
  assert.equal((await db.getLeaderboards(100, 'A')).stats.totalMatches, 0);
  await db.recordMatch({ roomCode: 'A', challengeId: 'x', winnerPlayerId: a.id, results: [] });
  assert.equal((await db.getLeaderboards(100, 'A')).stats.totalMatches, 1);
  await db.clearAllRankings('A');
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.totalScore, 0);
  assert.equal((await db.findPlayerByDeviceId('same-device', 'B'))?.id, b.id);
});

test('manual device rebind preserves profile and stats, requires exact room and never merges', async () => {
  const db = fresh();
  const original = await player(db, 'A');
  const otherRoom = await player(db, 'B');
  await db.recordPlayerRoundStats({ deviceId: original.deviceId, roomCode: 'A', roundScore: 75, isWinner: true });
  const before = await db.findPlayerByDeviceId(original.deviceId, 'A');
  assert.equal(await db.rebindPlayerDeviceId(original.id, 'B', 'private-code'), false);
  assert.deepEqual(await db.findPlayerByDeviceId(original.deviceId, 'A'), before);
  assert.equal(await db.rebindPlayerDeviceId(original.id, 'A', 'private-code'), true);
  assert.equal(await db.findPlayerByDeviceId(original.deviceId, 'A'), null);
  assert.deepEqual(await db.findPlayerByDeviceId('private-code', 'A'), { ...before, deviceId: 'private-code' });
  assert.deepEqual(await db.findPlayerByDeviceId(otherRoom.deviceId, 'B'), otherRoom);
  const conflict = await db.upsertPlayer({ roomCode: 'A', deviceId: 'occupied-code', nickname: 'Other', avatar: 'menina-mdx' });
  assert.equal(await db.rebindPlayerDeviceId(original.id, 'A', conflict.deviceId), false);
  assert.deepEqual(await db.findPlayerByDeviceId(conflict.deviceId, 'A'), conflict);
  assert.equal((await db.findPlayerByDeviceId('private-code', 'A'))?.totalScore, 75);
  assert.equal(await db.rebindPlayerDeviceId(original.id, 'A', 'private-code'), true);
  assert.equal(await db.rebindPlayerDeviceId('missing', 'A', 'unused'), false);
  assert.equal(await db.rebindPlayerDeviceId(otherRoom.id, 'B', 'private-code'), true);
  await assert.rejects(db.rebindPlayerDeviceId(original.id, 'A', ''));
});

test('PostgreSQL rebind changes identity only and rejects unique conflicts', async () => {
  let query = '';
  let failure: unknown;
  const pool = { query: async (config: { text: string }) => {
    query = config.text;
    if (failure) throw failure;
    return { rows: [['00000000-0000-4000-8000-000000000001']] };
  } } as unknown as pg.Pool;
  const db = fresh();
  Object.assign(db, { useLocalDb: false, db: drizzle(pool, { schema }) });
  const id = '00000000-0000-4000-8000-000000000001';
  assert.equal(await db.rebindPlayerDeviceId(id, 'A', 'private'), true);
  assert.match(query, /set "device_id" = .*"updated_at" = /);
  assert.doesNotMatch(query, /"total_score"|"high_score"|"matches_played"|"wins_count"/);
  assert.match(query, /where \("players"\."id" = .* and "players"\."room_code" = /);
  failure = Object.assign(new Error('duplicate'), { code: '23505' });
  assert.equal(await db.rebindPlayerDeviceId(id, 'A', 'occupied'), false);
  failure = new Error('connection lost');
  await assert.rejects(db.rebindPlayerDeviceId(id, 'A', 'private'));
});

test('staff hashes stay private, sessions expire and password changes revoke them', async () => {
  const db = fresh();
  const user = await db.createStaffUser({ email: ' ADMIN@EXAMPLE.COM ', name: 'Admin', role: 'admin', passwordHash: 'scrypt-hash', mustChangePassword: true });
  assert.equal(user.email, 'admin@example.com');
  assert.equal('passwordHash' in user, false);
  assert.equal((await db.findStaffUserByEmail('ADMIN@example.com'))?.passwordHash, 'scrypt-hash');
  await assert.rejects(db.createStaffUser({ ...user, passwordHash: 'other' }));
  await db.createStaffSession({ tokenHash: 'hash', userId: user.id, expiresAt: new Date(Date.now() + 60_000).toISOString() });
  assert.equal((await db.getStaffSession('hash'))?.id, user.id);
  await db.createStaffSession({ tokenHash: 'expired', userId: user.id, expiresAt: new Date(0).toISOString() });
  assert.equal(await db.getStaffSession('expired'), null);
  await db.updateStaffPassword(user.id, 'new-hash');
  assert.equal(await db.getStaffSession('hash'), null);
  assert.equal((await db.findStaffUserById(user.id))?.mustChangePassword, false);
  assert.equal('passwordHash' in (await db.getStaffUsers())[0], false);
  await db.createStaffSession({ tokenHash: 'delete-me', userId: user.id, expiresAt: new Date(Date.now() + 60_000).toISOString() });
  await db.deleteStaffSession('delete-me');
  assert.equal(await db.getStaffSession('delete-me'), null);
});

test('rate limits count unknown identities and reset expired windows', async () => {
  const db = fresh();
  assert.equal(await db.consumeAuthAttempt('unknown', 2, 1_000), true);
  assert.equal(await db.consumeAuthAttempt('unknown', 2, 1_000), true);
  assert.equal(await db.consumeAuthAttempt('unknown', 2, 1_000), false);
  assert.equal(await db.consumeAuthAttempt('other', 2, 1_000), true);
  assert.equal(await db.consumeAuthAttempt('expired', 1, 1), true);
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(await db.consumeAuthAttempt('expired', 1, 1), true);
});

test('room owner survives edits and can be transferred without changing players', async () => {
  const db = fresh();
  const user = await db.createStaffUser({ email: 'm@example.com', name: 'M', role: 'moderator', passwordHash: 'hash', mustChangePassword: false });
  await db.upsertRoom('A', 'Arena', true, user.id);
  await db.upsertRoom('A', 'Renamed', false);
  assert.equal((await db.getRooms()).find((r) => r.code === 'A')?.moderatorId, user.id);
  await db.upsertRoom('B', 'Unowned');
  await db.assignUnownedRooms(user.id);
  assert.equal((await db.getRooms()).find((r) => r.code === 'B')?.moderatorId, user.id);
  assert.equal(await db.setRoomModerator('A', null), true);
  assert.equal(await db.setRoomModerator('missing', user.id), false);
  await assert.rejects(db.setRoomModerator('A', 'unknown'));
  const next = await db.createStaffUser({ email: 'next@example.com', name: 'Next', role: 'moderator', passwordHash: 'hash', mustChangePassword: false });
  assert.equal(await db.setRoomModerator('A', next.id), true);
  assert.equal((await db.getRooms()).find((r) => r.code === 'A')?.moderatorId, next.id);
  await assert.rejects(db.createRoom('A', 'Overwrite', user.id));
  assert.equal((await db.getRooms()).find((r) => r.code === 'A')?.name, 'Renamed');
  assert.equal((await db.createRoom('C', 'New', user.id)).moderatorId, user.id);
});

test('PostgreSQL stats use row locks and atomic room-scoped increments', async () => {
  const queries: string[] = [];
  const date = new Date().toISOString();
  const row = ['00000000-0000-4000-8000-000000000001', 'A', 'same-device', 'A', 'menina-mdx', 10, 10, 1, 1, false, date, date];
  const client = {
    query: async (config: string | { text: string }) => {
      const text = typeof config === 'string' ? config : config.text;
      queries.push(text);
      return { rows: text.startsWith('select') || text.startsWith('update') ? [row] : [], rowCount: 1 };
    },
    release: () => {},
  };
  const pool = { ...client, connect: async () => client } as unknown as pg.Pool;
  const db = fresh();
  Object.assign(db, { useLocalDb: false, db: drizzle(pool, { schema }) });
  await db.recordPlayerRoundStats({ roomCode: 'A', deviceId: 'same-device', roundScore: 10, isWinner: true });
  assert.match(queries.join('\n'), /for update/);
  const update = queries.find((q) => q.startsWith('update'))!;
  assert.match(update, /"total_score" = "players"\."total_score" \+ /);
  assert.match(update, /"matches_played" = "players"\."matches_played" \+ 1/);
  assert.match(update, /"wins_count" = "players"\."wins_count" \+ /);
  assert.match(update, /where \("players"\."device_id" = .* and "players"\."room_code" = /);
  assert.equal(queries[0], 'begin');
  assert.equal(queries.at(-1), 'commit');
});

test('local migration backs up legacy rows and persists sessions and limits', async () => {
  const base = path.join(process.env.LOCALAPPDATA ?? process.cwd(), 'Temp', 'opencode');
  fs.mkdirSync(base, { recursive: true });
  const directory = fs.mkdtempSync(path.join(base, 'db-security-test-'));
  const file = path.join(directory, 'local-db.json');
  try {
    const legacy = { players: [{ id: 'legacy-id', deviceId: 'legacy', nickname: 'Legacy', avatar: 'menina-mdx', highScore: 20, totalScore: 80, matchesPlayed: 4, winsCount: 1, isBot: false }], matches: [], rooms: [{ code: 'MDX26', name: 'Old', isOpen: false }] };
    const original = JSON.stringify(legacy);
    fs.writeFileSync(file, original);
    const db = new AppDatabase({ localFile: file });
    const profile = await db.findPlayerByDeviceId('legacy');
    assert.equal(profile?.id, 'legacy-id');
    assert.equal(profile?.totalScore, 80);
    assert.equal(profile?.roomCode, 'MDX26');
    const backup = fs.readdirSync(directory).find((name) => name.endsWith('.bak'))!;
    assert.equal(fs.readFileSync(path.join(directory, backup), 'utf8'), original);
    const staff = await db.createStaffUser({ email: 'a@b.com', name: 'A', role: 'admin', passwordHash: 'hash', mustChangePassword: true });
    await db.createStaffSession({ tokenHash: 'token-hash', userId: staff.id, expiresAt: new Date(Date.now() + 60_000).toISOString() });
    assert.equal(await db.consumeAuthAttempt('missing-user', 1, 60_000), true);
    const reloaded = new AppDatabase({ localFile: file });
    assert.equal((await reloaded.getStaffSession('token-hash'))?.id, staff.id);
    assert.equal(await reloaded.consumeAuthAttempt('missing-user', 1, 60_000), false);
    assert.equal((await reloaded.getRooms())[0].isOpen, false);
    fs.writeFileSync(file, '{broken');
    assert.throws(() => new AppDatabase({ localFile: file }));
    assert.equal(fs.readFileSync(file, 'utf8'), '{broken');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('production without DATABASE_URL fails closed without touching disk', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', "import { AppDatabase } from './src/server/db/index.ts'; await new AppDatabase().init();"], {
    env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: '' }, encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL is required in production/);
});

test('round summaries survive reopening, remain room-scoped and never expose private fields', async () => {
  const base = path.join(process.env.LOCALAPPDATA ?? process.cwd(), 'Temp', 'opencode');
  fs.mkdirSync(base, { recursive: true });
  const directory = fs.mkdtempSync(path.join(base, 'db-round-summary-test-'));
  const file = path.join(directory, 'local-db.json');
  try {
    const db = new AppDatabase({ localFile: file });
    const params = { roomCode: 'A', challengeId: OFFICIAL_CHALLENGES[0].id, winnerPlayerId: 'player-id', roundId: 'round-id', roundToken: 'expired-token', results: [roundEvaluation] };
    await db.recordMatch(params);
    await db.recordMatch({ ...params, results: [] });
    assert.equal((await db.getLeaderboards(100, 'A')).stats.totalMatches, 1);
    const reloaded = new AppDatabase({ localFile: file });
    const summary = await reloaded.getRoundSummary('A', 'expired-token', 'Arena A');
    assert.equal(summary?.roundId, 'round-id');
    assert.equal(summary?.roundToken, 'expired-token');
    assert.equal(summary?.roomCode, 'A');
    assert.equal(summary?.roomName, 'Arena A');
    assert.equal(summary?.challengeTitle, OFFICIAL_CHALLENGES[0].title);
    assert.equal(summary?.challengeImageUrl, OFFICIAL_CHALLENGES[0].imageUrl);
    assert.equal(summary?.winnerNickname, 'Winner');
    assert.equal(summary?.winnerScore, 610);
    assert.ok(Number.isFinite(Date.parse(summary!.finishedAt)));
    assert.equal(summary?.evaluations[0].submittedPrompt, 'Final evaluated prompt');
    assert.doesNotMatch(JSON.stringify(summary), /private-device|private-socket|deviceId|socketId|profile/);
    assert.equal(await reloaded.getRoundSummary('B', 'expired-token', 'Arena B'), null);
    assert.equal(await reloaded.getRoundSummary('A', 'wrong-token', 'Arena A'), null);
    await reloaded.recordMatch({ ...params, roomCode: 'B' });
    assert.equal((await reloaded.getRoundSummary('B', 'expired-token', 'Arena B'))?.roomCode, 'B');
    const stored = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const badJson of ['{bad', '{}', '[null]']) {
      stored.matches[0].resultsJson = badJson;
      fs.writeFileSync(file, JSON.stringify(stored));
      assert.equal(await new AppDatabase({ localFile: file }).getRoundSummary('A', 'expired-token', 'Arena A'), null);
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('commitRound rolls back every profile on failure and commits a token once', async () => {
  const db = fresh();
  await db.upsertRoom('A', 'Arena');
  await player(db, 'A');
  const params = {
    roomCode: 'A', roundId: 'round', roundToken: 'token', challengeId: OFFICIAL_CHALLENGES[0].id,
    winnerPlayerId: null, players: [{ deviceId: 'same-device', roundScore: 10, isWinner: true }],
  };
  const before = await db.findPlayerByDeviceId('same-device', 'A');
  await assert.rejects(db.commitRound({ ...params, players: [...params.players, { deviceId: 'missing', roundScore: 10, isWinner: false }] }, () => []));
  assert.deepEqual(await db.findPlayerByDeviceId('same-device', 'A'), before);
  await assert.rejects(db.commitRound(params, () => { throw new Error('enrichment failed'); }));
  assert.deepEqual(await db.findPlayerByDeviceId('same-device', 'A'), before);
  assert.equal((await db.getLeaderboards(100, 'A')).stats.totalMatches, 0);
  let callbacks = 0;
  const evaluations = await db.commitRound(params, (updates) => {
    callbacks++;
    assert.equal(updates.get('same-device')?.updatedProfile?.totalScore, 10);
    assert.equal(updates.get('same-device')?.newHighScore, true);
    return [{ ...roundEvaluation, slot: 1, evaluatorUsed: 'local' }];
  });
  const repeated = await db.commitRound(params, () => { callbacks++; throw new Error('duplicate callback'); });
  assert.deepEqual(repeated, evaluations);
  assert.equal(callbacks, 1);
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.totalScore, 10);
  assert.equal((await db.findPlayerByDeviceId('same-device', 'A'))?.matchesPlayed, 1);
  assert.equal((await db.getLeaderboards(100, 'A')).stats.totalMatches, 1);
  assert.equal((await db.getRoundSummary('A', 'token', 'Arena'))?.roundId, 'round');
});

test('old verified passwords cannot create sessions or overwrite a new password', async () => {
  const db = fresh();
  const user = await db.createStaffUser({ email: 'race@example.test', name: 'Race', role: 'admin', passwordHash: 'old-hash', mustChangePassword: false });
  const verified = (await db.findStaffUserById(user.id))!;
  await db.updateStaffPassword(user.id, 'new-hash');
  assert.equal(await db.createStaffSession({ tokenHash: 'stale-login', userId: user.id, expiresAt: new Date(Date.now() + 60000).toISOString(), expectedPasswordHash: verified.passwordHash }), false);
  assert.equal(await db.getStaffSession('stale-login'), null);
  assert.equal(await db.updateStaffPassword(user.id, 'overwritten', verified.passwordHash), false);
  assert.equal((await db.findStaffUserById(user.id))!.passwordHash, 'new-hash');
  assert.equal(await db.createStaffSession({ tokenHash: 'fresh-login', userId: user.id, expiresAt: new Date(Date.now() + 60000).toISOString(), expectedPasswordHash: 'new-hash' }), true);
  assert.equal((await db.getStaffSession('fresh-login'))?.id, user.id);
});
