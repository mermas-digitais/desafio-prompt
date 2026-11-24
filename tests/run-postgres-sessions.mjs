// Test binaries live outside this repo: npm install --prefix <tools> embedded-postgres@18.6.0-beta.19
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import pg from 'pg';

const root = fileURLToPath(new URL('../', import.meta.url));
if (!process.argv[2]) throw new Error('Pass the temporary tools directory containing embedded-postgres.');
const platform = process.platform === 'win32' ? 'windows' : process.platform;
const binaryRoot = path.resolve(process.argv[2], `node_modules/@embedded-postgres/${platform}-${process.arch}`);
const pkg = JSON.parse(fs.readFileSync(path.join(binaryRoot, 'package.json'), 'utf8'));
const { initdb, pg_ctl } = await import(pathToFileURL(path.join(binaryRoot, pkg.exports)).href);
const parent = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Temp', 'opencode') : os.tmpdir();
fs.mkdirSync(parent, { recursive: true });
const data = fs.mkdtempSync(path.join(parent, 'session-pg-'));
const dbDir = path.join(data, 'db');
const listener = net.createServer();
await new Promise((resolve) => listener.listen(0, '127.0.0.1', resolve));
const port = listener.address().port;
await new Promise((resolve) => listener.close(resolve));
const password = crypto.randomBytes(24).toString('hex');
const name = `desafio_session_test_${crypto.randomBytes(5).toString('hex')}`;
const pwFile = path.join(data, 'password');
fs.writeFileSync(pwFile, password, { mode: 0o600 });
// PostgreSQL children inherit Windows pipe handles; wait for exit, with no captured pipes.
const run = (file, args) => new Promise((resolve, reject) => {
  const child = spawn(file, args, { stdio: 'ignore', windowsHide: true });
  child.once('error', reject);
  child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${path.basename(file)} exited with ${code}`)));
});
let started = false;
try {
  await run(initdb, ['-D', dbDir, '-U', 'postgres', `--pwfile=${pwFile}`, '--auth=scram-sha-256', '--locale=C', '--encoding=UTF8']);
  fs.unlinkSync(pwFile);
  await run(pg_ctl, ['start', '-D', dbDir, '-l', path.join(data, 'postgres.log'), '-o', `-p ${port} -h 127.0.0.1`, '-w', '-t', '20']);
  started = true;
  const client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', password, database: 'postgres' });
  await client.connect();
  try { await client.query(`CREATE DATABASE "${name}"`); } finally { await client.end(); }
  const exit = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--import', 'tsx', '--test', 'tests/postgres-sessions.test.ts'], { cwd: root, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: '', TEST_DATABASE_URL: `postgres://postgres:${password}@127.0.0.1:${port}/${name}` } });
    child.once('error', reject); child.once('exit', resolve);
  });
  if (exit !== 0) process.exitCode = 1;
} finally {
  if (started) await run(pg_ctl, ['stop', '-D', dbDir, '-m', 'fast', '-w', '-t', '20']);
  fs.rmSync(data, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
