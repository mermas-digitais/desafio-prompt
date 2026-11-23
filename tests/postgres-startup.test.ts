import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

const queries: string[] = [];
const rooms: string[] = [];
const query = async (config: string | { text: string }) => {
  const text = typeof config === 'string' ? config : config.text;
  queries.push(text);
  if (/INSERT INTO rooms/i.test(text)) rooms.push('MDX26');
  return { rows: /FROM "rooms"/i.test(text) ? rooms.map((code) => [code, code, true, null, new Date(), new Date()]) : [], rowCount: 0 };
};
mock.module('pg', { defaultExport: { Pool: class {
  query = query;
  async connect() { return { query, release() {} }; }
  async end() {}
} } });
const { AppDatabase } = await import('../src/server/db/index.js');

test('PostgreSQL schema startup does not recreate deleted rooms, including after restart', async () => {
  const oldUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'postgres://mock-only/never-connect';
  const db = new AppDatabase({ localFile: null });
  Object.assign(db, { useLocalDb: false, ensureDatabaseExists: async () => {}, seedPostgresIfNeeded: async () => {} });
  try {
    for (let restart = 0; restart < 2; restart++) {
      await db.init();
      assert.deepEqual(await db.getRooms(), []);
    }
    assert.ok(queries.some((text) => /CREATE TABLE IF NOT EXISTS rooms/i.test(text)));
    assert.ok(queries.every((text) => !/INSERT INTO rooms/i.test(text)));
  } finally {
    if (oldUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = oldUrl;
  }
});
