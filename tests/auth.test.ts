import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hashPassword, verifyPassword, readCookies, signDevice, verifyDevice } from '../src/server/auth.js';

test('password hashes use independent salts and never store plaintext', async () => {
  const first = await hashPassword('test-only-password');
  const second = await hashPassword('test-only-password');
  assert.notEqual(first, second);
  assert.ok(!first.includes('test-only-password'));
  assert.equal(await verifyPassword('test-only-password', first), true);
  assert.equal(await verifyPassword('wrong', first), false);
  assert.equal(await verifyPassword('anything', 'malformed'), false);
});

test('device cookies cannot be replaced with a publicly known identity', () => {
  const signed = signDevice('private-device', 'test-signing-key');
  assert.equal(verifyDevice(signed, 'test-signing-key'), 'private-device');
  assert.equal(verifyDevice(signed.replace('private-device', 'another-device'), 'test-signing-key'), null);
  assert.equal(verifyDevice(signed, 'other-key'), null);
  assert.equal(verifyDevice('public-device-id', 'test-signing-key'), null);
});

test('malformed cookies do not crash authentication', () => {
  const cookies = readCookies('valid=one; broken=%ZZ; empty=; odd');
  assert.equal(cookies.valid, 'one');
  assert.equal(cookies.empty, '');
  assert.equal(cookies.broken, undefined);
});
