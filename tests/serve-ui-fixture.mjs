import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const tempRoot = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Temp', 'opencode') : os.tmpdir();
fs.mkdirSync(tempRoot, { recursive: true });
const data = fs.mkdtempSync(path.join(tempRoot, 'desafio-ui-'));
Object.assign(process.env, {
  NODE_ENV: 'test', DATABASE_URL: '', PUBLIC_APP_URL: '',
  OPENAI_API_KEY: '', GROQ_API_KEY: '',
  SESSION_SECRET: 'local-ui-fixture-only-not-production-123456',
  BOOTSTRAP_ADMIN_EMAIL: 'ui-review@example.test', BOOTSTRAP_ADMIN_PASSWORD: 'review-only-password',
});
process.chdir(data);
const { createApplication } = await import('../src/server/index.ts');
const { database } = await import('../src/server/db/index.ts');
const { hashPassword } = await import('../src/server/auth.ts');
const app = await createApplication({ radioCatalog: {
  async playlist(url) { return { url, title: 'Rádio QA (sem provedor externo)', coverUrl: '', tracks: [{ uri: 'qa-one', title: 'Faixa QA', artist: 'Fixture local' }] }; },
  async media() { return { videoId: 'abcdefghijk', durationSec: 180 }; },
} });
assert.equal(database.isPostgresActive(), false, 'UI fixture must never connect to PostgreSQL');
const admin = (await database.getStaffUsers())[0];
await database.updateStaffPassword(admin.id, await hashPassword('review-only-password'));
await database.createStaffUser({ name: 'Ana · Organização', email: 'ana@example.test', role: 'moderator', passwordHash: await hashPassword('review-only-password'), mustChangePassword: false });
await app.roomManager.createRoom({ roomCode: 'PALCO2', name: 'Palco secundário' });
for (const [nickname, score] of [['Beatriz', 850], ['Camila', 670], ['Júlia', 540]]) {
  const player = await database.upsertPlayer({ deviceId: `preview-${nickname}`, nickname, avatar: 'menina-mdx', roomCode: 'MDX26' });
  await database.recordPlayerRoundStats({ deviceId: player.deviceId, roomCode: 'MDX26', roundScore: score, isWinner: score === 850 });
}
await app.roomManager.refreshAllLeaderboards();
await app.fastify.listen({ host: '127.0.0.1', port: 3017 });
const vite = await createServer({ root, configFile: path.join(root, 'vite.config.ts'), server: { host: '127.0.0.1', port: 5187, strictPort: true, proxy: {
  '/api': { target: 'http://127.0.0.1:3017', changeOrigin: false },
  '/socket.io': { target: 'http://127.0.0.1:3017', changeOrigin: false, ws: true },
} } });
await vite.listen();
console.log('UI fixture: http://127.0.0.1:5187 · only temporary local data');
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await vite.close();
  await app.close();
  process.chdir(root);
  fs.rmSync(data, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
process.on('SIGINT', () => { void stop(); });
process.on('SIGTERM', () => { void stop(); });
