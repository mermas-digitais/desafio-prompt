import assert from 'node:assert/strict';
import { test } from 'node:test';
import { useRadioStore } from '../src/client/store/useRadioStore';
import { radioPosition, type RadioState } from '../src/shared/radio';
import { jsonObjectAfter, youtubeMedia } from '../src/server/radio/SpotifyCatalog';

const state: RadioState = { epoch: 'runtime-a', revision: 5, serverNow: 4000, status: 'playing', playlistUrl: 'url', playlistTitle: 'QA', coverUrl: '', track: { uri: 'one', title: 'One', artist: 'QA', videoId: 'abcdefghijk', durationSec: 180 }, startedAt: 1000, error: null };

test('local pause and mute never mutate the shared song or timeline; resume targets the live position', () => {
  const previous = useRadioStore.getState();
  try {
    useRadioStore.setState({ station: null, paused: false, muted: false });
    useRadioStore.getState().apply(state);
    useRadioStore.getState().togglePause();
    assert.equal(useRadioStore.getState().paused, true);
    useRadioStore.getState().toggleMute();
    assert.equal(useRadioStore.getState().muted, true);
    assert.equal(useRadioStore.getState().station, state);
    useRadioStore.getState().togglePause();
    assert.equal(useRadioStore.getState().paused, false);
    assert.equal(radioPosition(useRadioStore.getState().station!, 61000), 60);
    assert.equal(radioPosition(state, 0), 0);
    assert.equal(radioPosition(state, 999999), 180);
  } finally { useRadioStore.setState(previous); }
});

test('late snapshots and previous-runtime events cannot roll back radio state', () => {
  const previous = useRadioStore.getState();
  try {
    useRadioStore.setState({ station: null });
    useRadioStore.getState().apply(state);
    useRadioStore.getState().apply({ ...state, revision: 4 }, undefined, true);
    assert.equal(useRadioStore.getState().station, state);
    useRadioStore.getState().apply({ ...state, epoch: 'old-runtime', revision: 99 });
    assert.equal(useRadioStore.getState().station, state);
    const next = { ...state, epoch: 'runtime-b', revision: 1 };
    useRadioStore.getState().apply(next, undefined, true);
    assert.equal(useRadioStore.getState().station, next);
  } finally { useRadioStore.setState(previous); }
});

test('provider extraction parses JSON safely, selects finite media and rejects truncated input', () => {
  const payload = { contents: [{ videoRenderer: { videoId: 'liveVideo00', title: 'Live without duration' } }, { videoRenderer: { videoId: 'abcdefghijk', lengthText: { simpleText: '3:42' } } }, { videoRenderer: { videoId: 'lmnopqrstuv', lengthText: { simpleText: '4:00' } } }], quoted: 'a } with " quote' };
  const parsed = jsonObjectAfter(`var ytInitialData = ${JSON.stringify(payload)}; other script`, 'ytInitialData');
  assert.deepEqual(parsed, payload);
  assert.deepEqual(youtubeMedia(parsed), { videoId: 'abcdefghijk', durationSec: 222 });
  assert.equal(youtubeMedia({ videoRenderer: { videoId: 'abcdefghijk', lengthText: { simpleText: '999:99:99' } } }), null);
  assert.throws(() => jsonObjectAfter('var ytInitialData = {"broken":', 'ytInitialData'));
  assert.throws(() => jsonObjectAfter('no data', 'ytInitialData'));
});
