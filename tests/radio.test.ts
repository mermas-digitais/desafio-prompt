import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizePlaylistUrl, RadioStation, type RadioCatalog } from '../src/server/radio/RadioStation.js';
import { radioPosition, type RadioState } from '../src/shared/radio.js';

const url = 'https://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63';
const catalog: RadioCatalog = {
  async playlist(url) { return { url, title: 'Radio', coverUrl: '', tracks: [{ uri: 'one', title: 'One', artist: 'Artist' }, { uri: 'two', title: 'Two', artist: 'Artist' }] }; },
  async media(track) { return { videoId: track.uri === 'one' ? 'abcdefghijk' : 'lmnopqrstuv', durationSec: 120 }; },
};

test('radio uses one server clock, advances once without viewers and serializes playlist edits', async () => {
  let now = 1000, saved = '', loads = 0;
  const events: RadioState[] = [];
  const station = new RadioStation({ catalog: { ...catalog, async playlist(url) { loads++; return catalog.playlist(url); } }, defaultUrl: url, readUrl: async () => null, saveUrl: async (url) => { saved = url; }, publish: (state) => events.push(state), now: () => now });
  try {
    await Promise.all([station.start(), station.start(), station.start()]);
    assert.equal(loads, 1);
    const first = station.snapshot();
    now += 45000;
    assert.equal(radioPosition(station.snapshot(), now), 45);
    assert.equal(station.snapshot().track!.videoId, first.track!.videoId);
    now += 76000;
    await Promise.all([station.tick(), station.tick()]);
    assert.notEqual(station.snapshot().track!.uri, first.track!.uri);
    assert.equal(events.length, 3); // playing, loading, playing
    const state = station.snapshot();
    const nextUrl = url.replace('playlist/', 'album/');
    const results = await Promise.allSettled([station.changePlaylist(nextUrl, state.epoch, state.revision), station.changePlaylist(url, state.epoch, state.revision)]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(saved, nextUrl);
    await assert.rejects(station.changePlaylist(url, 'old-runtime', station.snapshot().revision), /rádio mudou/);
  } finally { station.close(); }
});

test('playlist preparation or persistence failure keeps the playing station intact', async () => {
  let fail = false;
  const station = new RadioStation({ catalog, defaultUrl: url, readUrl: async () => null, saveUrl: async () => { if (fail) throw new Error('disk full'); }, publish() {} });
  try {
    await station.start(); const before = station.snapshot(); fail = true;
    await assert.rejects(station.changePlaylist(url, before.epoch, before.revision), /disk full/);
    const after = station.snapshot();
    assert.equal(after.revision, before.revision); assert.deepEqual(after.track, before.track);
    assert.equal(after.startedAt, before.startedAt);
    await assert.rejects(station.changePlaylist('http://127.0.0.1/private', before.epoch, before.revision), /link HTTPS/);
    assert.equal(station.snapshot().revision, before.revision);
  } finally { station.close(); }
});

test('radio validates provider URLs and does not accept arbitrary network targets', () => {
  assert.equal(normalizePlaylistUrl(`${url}?si=tracking`), url);
  assert.equal(normalizePlaylistUrl('spotify:playlist:4uYdic4V50S6NQEEFYkW63'), url);
  for (const input of ['http://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63', 'https://open.spotify.com.evil/playlist/4uYdic4V50S6NQEEFYkW63', 'https://open.spotify.com@localhost/playlist/4uYdic4V50S6NQEEFYkW63', 'https://127.0.0.1/private', 'not a link']) assert.throws(() => normalizePlaylistUrl(input));
});

test('close or runtime loss during preparation cannot publish or save a new station', async () => {
  let done!: (media: { videoId: string; durationSec: number }) => void;
  const pending = new Promise<{ videoId: string; durationSec: number }>((resolve) => { done = resolve; });
  const events: RadioState[] = [];
  let active = true, saves = 0;
  const station = new RadioStation({ catalog: { ...catalog, media: async () => pending }, defaultUrl: url, readUrl: async () => null, saveUrl: async () => { saves++; }, publish: (state) => events.push(state), active: () => active });
  const start = station.start();
  active = false;
  done({ videoId: 'abcdefghijk', durationSec: 100 });
  await start;
  assert.equal(events.length, 0); assert.equal(saves, 0);
  await assert.rejects(station.changePlaylist(url, station.snapshot().epoch, 0), /indisponível/);
  station.close();
});

test('nextTrack, previousTrack and seek update the shared station clock and track history', async () => {
  let now = 5000;
  const station = new RadioStation({ catalog, defaultUrl: url, readUrl: async () => null, saveUrl: async () => {}, publish() {}, now: () => now });
  try {
    await station.start();
    const first = station.snapshot();
    const sought = station.seek(45, first.epoch, first.revision);
    assert.equal(radioPosition(sought, now), 45);
    assert.equal(sought.revision, first.revision + 1);
    const second = await station.nextTrack(sought.epoch, sought.revision);
    assert.notEqual(second.track!.uri, first.track!.uri);
    const back = await station.previousTrack(second.epoch, second.revision);
    assert.equal(back.track!.uri, first.track!.uri);
    assert.equal(radioPosition(back, now), 0);
  } finally { station.close(); }
});
