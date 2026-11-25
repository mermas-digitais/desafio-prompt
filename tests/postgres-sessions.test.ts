import assert from 'node:assert/strict';
import { test } from 'node:test';
import crypto from 'node:crypto';
import { AppDatabase } from '../src/server/db/index.js';

test('real PostgreSQL arbitrates global participation, runtime ownership and simultaneous room results', { skip: !process.env.TEST_DATABASE_URL, timeout: 60000 }, async () => {
  const url = new URL(process.env.TEST_DATABASE_URL!);
  assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname), 'Only a loopback test database is permitted');
  assert.match(url.pathname, /^\/desafio_session_test_[a-z0-9_]+$/);
  const previous = process.env.DATABASE_URL;
  const previousExclusive = process.env.REQUIRE_EXCLUSIVE_RUNTIME;
  process.env.DATABASE_URL = url.toString(); process.env.NODE_ENV = 'test'; process.env.REQUIRE_EXCLUSIVE_RUNTIME = 'true';
  const a = new AppDatabase(), b = new AppDatabase();
  try {
    await a.init(); await b.init();
    assert.equal(a.isPostgresActive(), true); assert.equal(b.isPostgresActive(), true);
    await a.startGameRuntime(() => { throw new Error('Runtime lock connection lost'); });
    await assert.rejects(b.startGameRuntime(() => {}), /Another game runtime/);
    await a.createRoom('PGQA', 'Postgres QA');
    const profile = await a.upsertPlayer({ roomCode: 'PGQA', deviceId: 'one', nickname: 'One', avatar: 'ia' });
    const second = await a.upsertPlayer({ roomCode: 'PGQA', deviceId: 'two', nickname: 'Two', avatar: 'ia' });
    const sessions = [crypto.randomUUID(), crypto.randomUUID()];
    for (const id of sessions) await a.createGameSession({ id, roomCode: 'PGQA', name: id, createdBy: null });
    const claims = sessions.map((sessionId) => ({ id: crypto.randomUUID(), deviceId: 'one', profileId: profile.id, sessionId, roundToken: crypto.randomUUID() }));
    const acquired = await Promise.all([a.acquireParticipation(claims[0]), b.acquireParticipation(claims[1])]);
    assert.equal(acquired.filter(Boolean).length, 1);
    const winner = claims[acquired[0] ? 0 : 1];
    const loser = claims[acquired[0] ? 1 : 0];
    await b.releaseParticipation(loser);
    assert.equal((await a.getParticipation('one'))?.id, winner.id);
    await a.releaseParticipation(winner);
    assert.equal(await b.acquireParticipation(loser), true);
    await a.releaseParticipation(winner);
    assert.equal((await b.getParticipation('one'))?.id, loser.id);
    const rounds = [profile, second].map((player, index) => ({ roomCode: 'PGQA', sessionId: sessions[index], roundId: crypto.randomUUID(), roundToken: crypto.randomUUID(), challengeId: 'boi-cyberpunk', winnerPlayerId: player.id, players: [{ deviceId: player.deviceId, roundScore: (index + 1) * 100, isWinner: true }] }));
    await Promise.all([a.commitRound(rounds[0], () => []), b.commitRound(rounds[1], () => [])]);
    await b.commitRound(rounds[0], () => []);
    const boards = await a.getLeaderboards(100, 'PGQA');
    assert.equal(boards.stats.totalMatches, 2);
    assert.equal((await a.findPlayerByDeviceId('one', 'PGQA'))?.totalScore, 100);
    assert.equal((await a.findPlayerByDeviceId('two', 'PGQA'))?.totalScore, 200);
    await a.finishGameSession(loser.sessionId);
    assert.equal(await b.getParticipation('one'), null);
    await a.close();
    await b.startGameRuntime(() => {});
    assert.ok((await b.getGameSessions()).every((session) => session.status !== 'active'));
    assert.equal((await b.findPlayerByDeviceId('one', 'PGQA'))?.id, profile.id);
  } finally {
    await a.close(); await b.close();
    if (previous === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previous;
    if (previousExclusive === undefined) delete process.env.REQUIRE_EXCLUSIVE_RUNTIME; else process.env.REQUIRE_EXCLUSIVE_RUNTIME = previousExclusive;
  }
});
