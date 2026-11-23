import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import type { PlayerProfile } from '../src/shared/types.js';

const boards = { general: [], points: [], wins: [], stats: { totalPlayers: 0, totalMatches: 0, highestScoreEver: 0 } };
let evaluate: (...args: any[]) => Promise<any[]> = async () => [];
const db = {
  getLeaderboards: mock.fn(async () => boards),
  getRooms: mock.fn(async (): Promise<any[]> => []),
  createRoom: mock.fn(async (..._args: any[]) => {}),
  upsertRoom: mock.fn(async (..._args: any[]) => {}),
  setRoomStatus: mock.fn(async (..._args: any[]) => {}),
  deleteRoom: mock.fn(async (..._args: any[]) => true),
  recordPlayerRoundStats: mock.fn(async (..._args: any[]) => ({ newHighScore: false, updatedProfile: null })),
  recordMatch: mock.fn(async (..._args: any[]) => {}),
  commitRound: mock.fn(async (params: any, enrich: (updates: Map<string, any>) => any[]) => enrich(new Map(params.players.map((player: any) => [player.deviceId, { newHighScore: false, updatedProfile: null }])))),
};
mock.module('../src/server/db/index.ts', { namedExports: { database: db } });
mock.module('../src/server/ai/promptEvaluator.ts', { namedExports: { evaluateRoundPrompts: (...args: any[]) => evaluate(...args) } });
const { GameEngine } = await import('../src/server/game/GameEngine.js');
const { RoomManager } = await import('../src/server/game/RoomManager.js');
const { OFFICIAL_CHALLENGES } = await import('../src/server/db/challengesData.js');
const profile = (id = 'one'): PlayerProfile => ({ id, deviceId: `private-${id}`, nickname: id, avatar: 'ia', highScore: 0, totalScore: 0, matchesPlayed: 0, winsCount: 0 });
function fixture(code = 'MDX26') {
  const events: any[] = [];
  const io = { to: (target: string) => ({ emit: (event: string, data: any) => events.push({ target, event, data }) }), emit: (...args: any[]) => events.push({ global: args }) };
  return { engine: new GameEngine(io as any, code), io, events };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

test('public state redacts private identities, drafts and hidden challenge words; emits only to room', () => {
  const { engine, events } = fixture();
  engine.joinRoom(profile(), 'private-socket', engine.getState().roundToken);
  (engine as any).startCountdown();
  (engine as any).startPlaying();
  engine.setPlayerTyping(profile().deviceId, 'private draft');
  const state = engine.getState();
  for (const key of ['deviceId', 'socketId', 'submittedPrompt']) assert.equal(key in state.players[0], false);
  assert.ok(state.challenge!.maskedPromptTokens.every((token) => token.isRevealed || token.text === ''));
  assert.ok(events.every((event) => event.target === 'MDX26'));
});

test('mandatory fresh token, closed entries preserve round and allow existing reconnect; reopening is idempotent', () => {
  const { engine } = fixture();
  assert.equal(engine.joinRoom(profile(), 'socket').joined, false);
  const token = engine.getState().roundToken;
  assert.equal(engine.joinRoom(profile(), 'socket', token).joined, true);
  (engine as any).startCountdown();
  engine.closeRoom();
  assert.equal(engine.getState().phase, 'COUNTDOWN');
  assert.equal(engine.getState().roundToken, token);
  assert.equal(engine.joinRoom(profile('two'), 'socket2', token).joined, false);
  assert.equal(engine.joinRoom(profile(), 'reconnected', token).joined, true);
  engine.openRoom({ name: 'Renamed' });
  engine.openRoom({});
  assert.equal(engine.getState().roundToken, token);
  engine.resetToIdle();
  assert.equal(engine.joinRoom(profile(), 'socket', token).joined, false);
});

test('kicking last human does not rotate token or allow reentry until explicit new round', () => {
  const { engine } = fixture();
  const token = engine.getState().roundToken;
  engine.joinRoom(profile(), 'socket', token);
  engine.kickPlayer('one');
  assert.equal(engine.getState().roundToken, token);
  assert.equal(engine.joinRoom(profile(), 'socket', token).joined, false);
  engine.joinRoom(profile('two'), 'socket2', token);
  engine.leaveRoom(profile('two').deviceId);
  assert.equal(engine.joinRoom(profile(), 'socket', engine.getState().roundToken).joined, false);
  engine.resetToIdle();
  assert.equal(engine.joinRoom(profile(), 'socket', engine.getState().roundToken).joined, true);
});

test('lobby cancellation removes every participant, invalidates QR and preserves other rooms and scores', () => {
  const { engine, events } = fixture('A');
  const other = fixture('B').engine;
  const player = { ...profile('one'), totalScore: 900 };
  engine.joinRoom(player, 'socket1', engine.getState().roundToken);
  engine.joinRoom(profile('two'), 'socket2', engine.getState().roundToken);
  other.joinRoom(profile('other'), 'socket3', other.getState().roundToken);
  const token = engine.getState().roundToken;
  const commits = db.commitRound.mock.callCount();
  assert.equal(engine.cancelLobby('stale').ok, false);
  assert.equal(engine.getState().players.length, 2);
  assert.equal(engine.cancelLobby(token).ok, true);
  assert.equal(engine.getState().phase, 'IDLE');
  assert.deepEqual(engine.getState().players, []);
  assert.deepEqual(engine.getState().evaluations, []);
  assert.notEqual(engine.getState().roundToken, token);
  assert.equal(engine.joinRoom(player, 'socket1', token).joined, false);
  assert.equal(engine.validateRoundToken(token).roundData, undefined);
  const kicked = events.filter((event) => event.event === 'player:kicked');
  assert.deepEqual(kicked.map((event) => event.target), ['socket1', 'socket2']);
  assert.ok(kicked.every((event) => event.data.roomCode === 'A' && event.data.reason.includes('cancelada')));
  assert.equal(other.getState().players.length, 1);
  assert.equal(player.totalScore, 900);
  assert.equal(db.commitRound.mock.callCount(), commits);
  assert.equal(engine.joinRoom(player, 'socket1', engine.getState().roundToken).joined, true);
});

test('lobby cancellation refuses idle, countdown and every in-game phase without changing the round', () => {
  for (const phase of ['IDLE', 'COUNTDOWN', 'PLAYING', 'EVALUATING', 'REVEALING', 'PODIUM']) {
    const { engine, events } = fixture();
    (engine as any).phase = phase;
    const token = engine.getState().roundToken;
    assert.equal(engine.cancelLobby(token).ok, false);
    assert.equal(engine.getState().roundToken, token);
    assert.equal(engine.getState().phase, phase);
    assert.deepEqual(events, []);
  }
});

test('prompt hints reveal at most one word at 60s and three at 30s, full prompt only after evaluation', () => {
  const { engine } = fixture();
  for (const challenge of OFFICIAL_CHALLENGES) {
    (engine as any).currentChallenge = challenge;
    (engine as any).phase = 'PLAYING';
    let previous: number[] = [];
    for (const [time, limit] of [[90, 0], [61, 0], [60, 1], [31, 1], [30, 3], [1, 3], [0, 3]]) {
      (engine as any).roundTimeLeft = time;
      const view = engine.getState().challenge!;
      const revealed = view.maskedPromptTokens.flatMap((token, index) => token.isRevealed ? [index] : []);
      assert.equal(revealed.length, limit, `${challenge.id} has the wrong hint budget at ${time}s`);
      assert.ok(previous.every((index) => revealed.includes(index)), 'hints must not move or disappear');
      assert.ok(view.maskedPromptTokens.every((token) => token.isRevealed || token.text === ''));
      assert.equal(view.fullPrompt, undefined);
      previous = revealed;
    }
    (engine as any).phase = 'EVALUATING';
    assert.ok(engine.getState().challenge!.maskedPromptTokens.filter((token) => token.isRevealed).length <= 3);
    for (const phase of ['REVEALING', 'PODIUM']) {
      (engine as any).phase = phase;
      assert.ok(engine.getState().challenge!.maskedPromptTokens.every((token) => token.isRevealed));
      assert.equal(engine.getState().challenge!.fullPrompt, challenge.fullPrompt);
    }
  }
});

test('reset invalidates delayed AI evaluation before any persistence', async () => {
  const { engine } = fixture();
  const gate = deferred<any[]>();
  evaluate = async () => gate.promise;
  engine.joinRoom(profile(), 'socket', engine.getState().roundToken);
  (engine as any).startCountdown();
  const before = db.commitRound.mock.callCount();
  const pending = (engine as any).transitionToEvaluating();
  engine.resetToIdle();
  const token = engine.getState().roundToken;
  gate.resolve([]);
  await pending;
  assert.equal(engine.getState().phase, 'IDLE');
  assert.equal(engine.getState().roundToken, token);
  assert.equal(db.commitRound.mock.callCount(), before);
});

test('rooms need no owner; duplicate and invalid creation rejected; failed writes preserve state', async () => {
  const { io } = fixture();
  const manager = new RoomManager(io as any);
  try {
    await manager.createRoom({ roomCode: 'ROOM1', name: 'One' });
    assert.deepEqual(db.createRoom.mock.calls.at(-1)!.arguments, ['ROOM1', 'One']);
    assert.equal('moderatorId' in manager.listRooms()[0], false);
    assert.equal((await manager.createRoom({ roomCode: 'ROOM1', name: 'Overwrite' })).ok, false);
    assert.equal((await manager.createRoom({ roomCode: 'TOO-LONG-CODE-123', name: 'Bad' })).ok, false);
    assert.equal((await manager.openRoom({ roomCode: 'UNKNOWN', name: 'Unknown' })).ok, false);
    db.upsertRoom.mock.mockImplementationOnce(async () => { throw new Error('write failed'); });
    await assert.rejects(manager.openRoom({ roomCode: 'ROOM1', name: 'Not persisted' }));
    assert.equal(manager.getRoom('ROOM1')!.getState().roomName, 'One');
    db.setRoomStatus.mock.mockImplementationOnce(async () => { throw new Error('write failed'); });
    await assert.rejects(manager.closeRoom('ROOM1'));
    assert.equal(manager.getRoom('ROOM1')!.getState().isOpen, true);
  } finally {
    manager.dispose();
  }
});

for (const boundary of ['commitRound', 'getLeaderboards'] as const) {
  test(`reset during ${boundary} cannot publish stale state or continue persistence`, async () => {
    const { engine } = fixture('ROOM1');
    const player = profile();
    const gate = deferred<any>();
    const entered = deferred<void>();
    evaluate = async () => [{ playerId: player.id, slot: 1, nickname: 'one', isBot: false, submittedPrompt: 'locked prompt', totalScore: 0, subjectScore: 0, styleScore: 0, detailsScore: 0, speedBonus: 0, lockedAtRemainingSeconds: 0, isWinner: true }];
    db[boundary].mock.mockImplementationOnce(async (...args: any[]) => {
      if (boundary === 'commitRound') {
        assert.equal(args[0].roomCode, 'ROOM1');
        assert.deepEqual(args[0].players, [{ deviceId: player.deviceId, roundScore: 0, isWinner: true }]);
        assert.equal(args[0].roundId, engine.getState().roundId);
        assert.equal(args[0].roundToken, engine.getState().roundToken);
      }
      entered.resolve();
      return gate.promise;
    });
    engine.joinRoom(player, 'socket', engine.getState().roundToken);
    (engine as any).startCountdown();
    const pending = (engine as any).transitionToEvaluating();
    await entered.promise;
    assert.equal(engine.isCommittingRound(), true);
    engine.resetToIdle();
    engine.joinRoom(profile('new'), 'socket-new', engine.getState().roundToken);
    const currentRound = engine.getState().roundId;
    gate.resolve(boundary === 'getLeaderboards' ? boards : []);
    await pending;
    assert.equal(engine.isCommittingRound(), false);
    assert.equal(engine.getState().phase, 'LOBBY');
    assert.equal(engine.getState().roundId, currentRound);
    assert.deepEqual(engine.getState().evaluations, []);
    assert.equal(engine.getState().players[0].id, 'new');
    assert.equal(db.recordMatch.mock.callCount(), 0);
    assert.equal(db.recordPlayerRoundStats.mock.callCount(), 0);
  });
}

test('stale evaluation rejection cannot reset a new round or unlock its evaluation', async () => {
  const { engine } = fixture();
  const oldGate = deferred<any[]>();
  const newGate = deferred<any[]>();
  evaluate = async () => oldGate.promise;
  (engine as any).startCountdown();
  const oldPending = (engine as any).transitionToEvaluating();
  assert.equal(engine.isCommittingRound(), false);
  engine.resetToIdle();
  evaluate = async () => newGate.promise;
  (engine as any).startCountdown();
  const newPending = (engine as any).transitionToEvaluating();
  oldGate.reject(new Error('old evaluation failed'));
  await oldPending;
  assert.equal(engine.isEvaluatingRound(), true);
  assert.equal(engine.getState().phase, 'EVALUATING');
  newGate.resolve([]);
  await newPending;
  assert.equal(engine.getState().phase, 'REVEALING');
});

test('archive holds last 100 rounds, and disposal clears timer', async () => {
  const { engine } = fixture();
  const tokens: string[] = [];
  for (let i = 0; i < 102; i += 1) {
    tokens.push(engine.getState().roundToken);
    (engine as any).evaluations = [{ nickname: 'one', totalScore: i }];
    engine.resetToIdle();
  }
  assert.equal((engine as any).completedRounds.size, 100);
  assert.equal(engine.validateRoundToken(tokens[0]).roundData, undefined);
  assert.equal(engine.validateRoundToken(tokens[101]).roundData?.winnerScore, 101);
  await engine.start();
  engine.dispose();
  assert.equal((engine as any).tickInterval, null);
});

test('initialization ignores legacy owner; total room count and concurrent duplicates stay bounded', async () => {
  const { io } = fixture();
  const manager = new RoomManager(io as any);
  db.getRooms.mock.mockImplementationOnce(async () => [{ code: 'MDX26', name: 'Stored', isOpen: false, moderatorId: 'stored-owner' }]);
  try {
    await manager.init();
    assert.equal('moderatorId' in manager.listRooms()[0], false);
    const pending = manager.createRoom({ roomCode: 'RACE', name: 'Race' });
    assert.equal((await manager.createRoom({ roomCode: 'RACE', name: 'Race2' })).ok, false);
    await pending;
    for (let i = 0; i < 98; i += 1) {
      assert.equal((await manager.createRoom({ roomCode: `R${i}`, name: 'Bounded' })).ok, true);
    }
    assert.equal((await manager.createRoom({ roomCode: 'OVERFLOW', name: 'Overflow' })).ok, false);
    assert.equal(manager.listRooms().length, 100);
  } finally {
    manager.dispose();
  }
});

test('closing entries during evaluation preserves the valid result', async () => {
  const { engine } = fixture();
  const gate = deferred<any[]>();
  evaluate = async () => gate.promise;
  (engine as any).startCountdown();
  const token = engine.getState().roundToken;
  const pending = (engine as any).transitionToEvaluating();
  engine.closeRoom();
  gate.resolve([]);
  await pending;
  assert.equal(engine.getState().isOpen, false);
  assert.equal(engine.getState().roundToken, token);
  assert.equal(engine.getState().phase, 'REVEALING');
  assert.equal(engine.isCommittingRound(), false);
});

test('database creation collisions never publish an engine', async () => {
  const { io } = fixture();
  const manager = new RoomManager(io as any);
  db.createRoom.mock.mockImplementationOnce(async () => { throw new Error('Room already exists'); });
  await assert.rejects(manager.createRoom({ roomCode: 'COLLISION', name: 'Collision' }));
  assert.equal(manager.getRoom('COLLISION'), undefined);
  assert.equal((manager as any).creating.size, 0);
  manager.dispose();
});

test('deletion blocks evaluation, persistence and edits; failed deletion resumes the same round', async () => {
  const { io, events } = fixture();
  const manager = new RoomManager(io as any);
  try {
    await manager.createRoom({ roomCode: 'A', name: 'A' });
    const engine = manager.getRoom('A')!;
    const token = engine.getState().roundToken;
    for (const flag of ['isEvaluating', 'committingRounds']) {
      (engine as any)[flag] = 1;
      assert.equal((await manager.deleteRoom('A')).ok, false);
      (engine as any)[flag] = 0;
    }
    const edit = deferred<void>();
    db.setRoomStatus.mock.mockImplementationOnce(async () => edit.promise);
    const closing = manager.closeRoom('A');
    assert.equal((await manager.deleteRoom('A')).ok, false);
    edit.resolve();
    await closing;
    const deletion = deferred<boolean>();
    db.deleteRoom.mock.mockImplementationOnce(async () => deletion.promise);
    const pending = manager.deleteRoom('A');
    assert.equal(manager.getRoom('A'), undefined);
    assert.equal((await manager.openRoom({ roomCode: 'A', name: 'Changed' })).ok, false);
    assert.equal((await manager.createRoom({ roomCode: 'A', name: 'Changed' })).ok, false);
    assert.equal((engine as any).tickInterval, null);
    await (engine as any).tick();
    deletion.reject(new Error('disk full'));
    await assert.rejects(pending, /disk full/);
    assert.equal(manager.getRoom('A'), engine);
    assert.equal(engine.getState().roundToken, token);
    assert.ok((engine as any).tickInterval);
    engine.joinRoom(profile(), 'socket', token);
    const refresh = deferred<typeof boards>();
    db.getLeaderboards.mock.mockImplementationOnce(async () => refresh.promise);
    const refreshing = engine.refreshLeaderboards();
    assert.equal((await manager.deleteRoom('A')).ok, true);
    const count = events.length;
    refresh.resolve(boards);
    await refreshing;
    engine.broadcastState();
    engine.resume();
    assert.equal(events.length, count);
    assert.equal((engine as any).tickInterval, null);
    assert.deepEqual(engine.getState().players, []);
    assert.equal((engine as any).completedRounds.size, 0);
    assert.equal(manager.getRoom(), undefined);
    assert.deepEqual(manager.listRooms(), []);
  } finally { manager.dispose(); }
});

test('atomic round enrichment matches profile IDs and publishes updated room scores only after commit', async () => {
  const { engine } = fixture('ROOM1');
  const first = { ...profile('first'), nickname: 'Same', totalScore: 100 };
  const second = { ...profile('second'), nickname: 'Same', totalScore: 300 };
  engine.joinRoom(first, 'socket1', engine.getState().roundToken);
  engine.joinRoom(second, 'socket2', engine.getState().roundToken);
  const result = (playerId: string, slot: number, score: number) => ({ playerId, slot, nickname: 'Same', isBot: false, totalScore: score, subjectScore: score, styleScore: 0, detailsScore: 0, speedBonus: 0, lockedAtRemainingSeconds: 0, isWinner: playerId === 'first' });
  evaluate = async () => [result('second', 1, 200), result('first', 2, 500)];
  const enriched = deferred<any[]>();
  const commit = deferred<void>();
  db.commitRound.mock.mockImplementationOnce(async (params: any, enrich: (updates: Map<string, any>) => any[]) => {
    assert.deepEqual(params.players, [
      { deviceId: second.deviceId, roundScore: 200, isWinner: false },
      { deviceId: first.deviceId, roundScore: 500, isWinner: true },
    ]);
    const evaluations = enrich(new Map([
      [first.deviceId, { newHighScore: true, updatedProfile: { ...first, totalScore: 600, highScore: 500, matchesPlayed: 1, winsCount: 1 } }],
      [second.deviceId, { newHighScore: false, updatedProfile: { ...second, totalScore: 500, highScore: 200, matchesPlayed: 1 } }],
    ]));
    enriched.resolve(evaluations);
    await commit.promise;
    return evaluations;
  });
  (engine as any).startCountdown();
  const pending = (engine as any).transitionToEvaluating();
  const evaluations = await enriched.promise;
  assert.equal(evaluations.find((ev) => ev.playerId === 'first').isNewHighScore, true);
  assert.equal(evaluations.find((ev) => ev.playerId === 'second').isNewHighScore, false);
  assert.equal(engine.getState().players.find((p) => p.id === 'first')!.totalScore, 100);
  assert.deepEqual(engine.getState().evaluations, []);
  commit.resolve();
  await pending;
  assert.equal(engine.getState().players.find((p) => p.id === 'first')!.totalScore, 600);
  assert.equal(engine.getState().players.find((p) => p.id === 'second')!.totalScore, 500);
  assert.deepEqual(engine.getState().evaluations, evaluations);
  assert.equal(engine.getState().phase, 'REVEALING');
  assert.equal(db.recordPlayerRoundStats.mock.callCount(), 0);
  assert.equal(db.recordMatch.mock.callCount(), 0);
});
