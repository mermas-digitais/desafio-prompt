import assert from 'node:assert/strict';
import test from 'node:test';
import type { GameRoomState, PlayerProfile, PlayerRoundEvaluation, PublicRoomPlayer } from '../src/shared/types';
import { isRequestedRoom, personalHistoryKey, selectOwnEvaluation, selectOwnPlayer } from '../src/client/lib/sessionHelpers';
import { DEFAULT_ROOM_STATE, ensurePlayerSession, getOrCreateDeviceId, getSocket, useGameStore } from '../src/client/store/useGameStore';
import { getPersonalMatchHistory, savePersonalMatch, type SavedPersonalMatch } from '../src/client/lib/personalMatchHistory';

test('only requested room state can replace current state, including delayed acknowledgements', () => {
  const roomA = { ...DEFAULT_ROOM_STATE, roomCode: 'A' };
  const roomB = { ...DEFAULT_ROOM_STATE, roomCode: 'B' };
  useGameStore.setState({ requestedRoomCode: 'A', roomState: roomA });
  useGameStore.getState().setRoomState(roomB);
  assert.equal(useGameStore.getState().roomState, roomA);
  assert.equal(useGameStore.getState().requestedRoomCode, 'A');
  useGameStore.setState({ requestedRoomCode: 'B', roomState: roomB });
  useGameStore.getState().setRoomState(roomA);
  assert.equal(useGameStore.getState().roomState, roomB);
  assert.equal(isRequestedRoom(undefined, 'B'), false);
});

test('personal slot/evaluation use profile ID, never same nickname, old device ID or slot', () => {
  const profile = { id: 'mine', nickname: 'Same', deviceId: 'legacy', roomCode: 'A' } as PlayerProfile;
  const otherPlayer = { id: 'other', nickname: 'Same', slot: 1 } as PublicRoomPlayer;
  const ownPlayer = { id: 'mine', nickname: 'Same', slot: 2 } as PublicRoomPlayer;
  const otherEvaluation = { playerId: 'other', nickname: 'Same', slot: 2 } as PlayerRoundEvaluation;
  const ownEvaluation = { playerId: 'mine', nickname: 'Same', slot: 1 } as PlayerRoundEvaluation;
  const state = { ...DEFAULT_ROOM_STATE, players: [otherPlayer, ownPlayer], evaluations: [otherEvaluation, ownEvaluation] } as GameRoomState;
  assert.equal(selectOwnPlayer(state, profile), ownPlayer);
  assert.equal(selectOwnEvaluation(state, profile), ownEvaluation);
  assert.equal(selectOwnEvaluation({ evaluations: [otherEvaluation] }, profile), undefined);
  assert.equal(selectOwnPlayer(state, null), undefined);
});

test('history isolates room and profile, deduplicates server round IDs and preserves legacy storage', () => {
  const storage = new Map<string, string>();
  const legacyKey = 'mdx26_personal_match_history_legacy';
  storage.set(legacyKey, '[{"id":"legacy-history"}]');
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) } });
  try {
    const match = { id: 'server-round-1', roundId: 'server-round-1', roomCode: 'A', myEvaluation: { playerId: 'mine' } } as SavedPersonalMatch;
    savePersonalMatch('A', 'mine', match);
    savePersonalMatch('A', 'mine', match);
    assert.equal(getPersonalMatchHistory('A', 'mine').length, 1);
    assert.deepEqual(getPersonalMatchHistory('B', 'mine'), []);
    assert.deepEqual(getPersonalMatchHistory('A', 'other'), []);
    savePersonalMatch('B', 'mine', match);
    assert.deepEqual(getPersonalMatchHistory('B', 'mine'), []);
    assert.equal(storage.get(legacyKey), '[{"id":"legacy-history"}]');
    assert.notEqual(personalHistoryKey('A_B', 'C'), personalHistoryKey('A', 'B_C'));
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage); else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('private player identity is issued by server before a socket connects, never claimed from legacy storage', async () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldFetch = globalThis.fetch;
  let calls = 0;
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin: 'http://localhost:1' }, localStorage: { getItem: () => { throw new Error('Legacy identity must not be read'); } } } });
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, '/api/player/session');
    assert.equal(options?.method, 'POST');
    assert.equal(options?.body, '{}');
    return new Response(JSON.stringify({ ok: true, deviceId: 'server-private-session' }), { status: 200 });
  };
  try {
    assert.equal(getOrCreateDeviceId(), '');
    assert.equal(getSocket().connected, false);
    const [first, second] = await Promise.all([ensurePlayerSession(), ensurePlayerSession()]);
    assert.equal(first, 'server-private-session'); assert.equal(second, first);
    assert.equal(calls, 1);
    assert.equal(getSocket().connected, false);
    assert.equal(getOrCreateDeviceId(), first);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
  }
});
