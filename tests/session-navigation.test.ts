import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canControlSession, parseTVMode, safeControlReturnTo, sessionPhaseLabel } from '../src/client/lib/sessionNavigation';

test('watch is the safe default even for authenticated organization accounts', () => {
  for (const mode of [undefined, '', 'watch', 'unknown', 'CONTROL']) {
    assert.equal(parseTVMode(mode), 'watch');
    assert.equal(canControlSession(mode, { mustChangePassword: false }), false);
  }
  assert.equal(canControlSession('control', null), false);
  assert.equal(canControlSession('control', { mustChangePassword: true }), false);
  assert.equal(canControlSession('control', { mustChangePassword: false }), true);
  assert.equal(sessionPhaseLabel.IDLE, 'Aguardando participantes');
});

test('login return target permits only an explicit local session control route', () => {
  const route = '/tv?room=MDX26&session=12345678-abcd-1234-1234-123456789abc&mode=control';
  assert.equal(safeControlReturnTo(route), route);
  for (const value of [undefined, '//evil.example/tv', `https://evil.example${route}`, '/admin', '/tv?room=MDX26&mode=control', route.replace('control', 'watch'), route.replace('MDX26', '../admin'), route.replace('12345678-abcd-1234-1234-123456789abc', 'invalid')]) assert.equal(safeControlReturnTo(value), undefined);
});
