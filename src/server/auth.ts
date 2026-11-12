import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import { database } from './db/index.js';
import type { StaffUser } from '../shared/types.js';

const scrypt = promisify(crypto.scrypt);
const SESSION_HOURS = 12;
const STAFF_COOKIE = 'staff_session';
const PLAYER_COOKIE = 'player_session';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public code?: string) {
    super(message);
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, salt, hex] = encoded.split(':');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(hex || '')) return false;
  const actual = await scrypt(password, salt, 64) as Buffer;
  return crypto.timingSafeEqual(actual, Buffer.from(hex, 'hex'));
}

export function readCookies(header?: string): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  for (const pair of (header || '').split(';')) {
    const index = pair.indexOf('=');
    if (index < 1) continue;
    try { result[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim()); } catch { /* Malformed cookies are not credentials. */ }
  }
  return result;
}

export function signDevice(deviceId: string, secret: string): string {
  return `${deviceId}.${crypto.createHmac('sha256', secret).update(deviceId).digest('hex')}`;
}

export function verifyDevice(value: string | undefined, secret: string): string | null {
  if (!value || value.length > 256) return null;
  const index = value.lastIndexOf('.');
  const deviceId = value.slice(0, index);
  const signature = value.slice(index + 1);
  if (index < 1 || !/^[a-f0-9]{64}$/.test(signature)) return null;
  const expected = crypto.createHmac('sha256', secret).update(deviceId).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, 'hex')) ? deviceId : null;
}

const tokenHash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const emailSchema = z.string().trim().email().max(254).transform((s) => s.toLowerCase());
const passwordSchema = z.string().min(8).max(128);

export class AuthService {
  private secret = '';

  async init(): Promise<void> {
    this.secret = (process.env.SESSION_SECRET || '').trim();
    if (this.secret.length < 32) {
      if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET com pelo menos 32 caracteres é obrigatório em produção.');
      const file = path.resolve('.data', 'session-secret');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      if (!fs.existsSync(file)) fs.writeFileSync(file, crypto.randomBytes(32).toString('hex'), { mode: 0o600, flag: 'wx' });
      this.secret = fs.readFileSync(file, 'utf8').trim();
    }

    const users = await database.getStaffUsers();
    if (!users.some((u) => u.role === 'admin')) {
      const email = emailSchema.parse(process.env.BOOTSTRAP_ADMIN_EMAIL);
      const password = passwordSchema.parse(process.env.BOOTSTRAP_ADMIN_PASSWORD);
      const existing = await database.findStaffUserByEmail(email);
      if (existing) throw new Error('E-mail inicial já pertence a um operador. Configure um administrador explicitamente.');
      await database.createStaffUser({ email, name: 'Administrador', role: 'admin', passwordHash: await hashPassword(password), mustChangePassword: true });
    }
    const admin = (await database.getStaffUsers()).find((u) => u.role === 'admin');
    if (admin) {
      await database.getRooms();
      await database.assignUnownedRooms(admin.id);
    }
  }

  originAllowed(origin: string | undefined, host?: string): boolean {
    if (!origin) return true;
    try {
      const actual = new URL(origin).origin;
      const configured = process.env.PUBLIC_APP_URL?.trim();
      if (configured && actual === new URL(configured).origin) return true;
      if (process.env.NODE_ENV === 'production') return false;
      return Boolean(host && new URL(origin).hostname === new URL(`http://${host}`).hostname);
    } catch { return false; }
  }

  private cookie(reply: FastifyReply, name: string, value: string, maxAge: number): void {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    reply.header('Set-Cookie', `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`);
    reply.header('Cache-Control', 'no-store');
  }

  async getUser(headers: { cookie?: string }): Promise<StaffUser | null> {
    const token = readCookies(headers.cookie)[STAFF_COOKIE];
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    return database.getStaffSession(tokenHash(token));
  }

  async requireUser(headers: { cookie?: string }, allowPasswordChange = false): Promise<StaffUser> {
    const user = await this.getUser(headers);
    if (!user) throw new HttpError(401, 'Entre na sua conta para continuar.');
    if (!allowPasswordChange && user.mustChangePassword) throw new HttpError(409, 'Troque a senha inicial antes de continuar.', 'PASSWORD_CHANGE_REQUIRED');
    return user;
  }

  async requireAdmin(headers: { cookie?: string }): Promise<StaffUser> {
    const user = await this.requireUser(headers);
    if (user.role !== 'admin') throw new HttpError(403, 'Esta ação é exclusiva do administrador.');
    return user;
  }

  requireDevice(headers: { cookie?: string }): string {
    const id = verifyDevice(readCookies(headers.cookie)[PLAYER_COOKIE], this.secret);
    if (!id) throw new HttpError(401, 'Recarregue a página para recuperar sua sessão de participante.');
    return id;
  }

  private async issueSession(reply: FastifyReply, user: StaffUser, expectedPasswordHash: string): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const created = await database.createStaffSession({ tokenHash: tokenHash(token), userId: user.id, expiresAt: new Date(Date.now() + SESSION_HOURS * 3600000).toISOString(), expectedPasswordHash });
    if (!created) throw new HttpError(409, 'Sua senha mudou durante o acesso. Entre novamente.');
    this.cookie(reply, STAFF_COOKIE, token, SESSION_HOURS * 3600);
  }

  registerRoutes(app: FastifyInstance): void {
    app.addHook('onRequest', async (request, reply) => {
      if (!request.url.startsWith('/api/')) return;
      reply.header('Cache-Control', 'no-store');
      if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
        if (!this.originAllowed(request.headers.origin, request.headers.host)) throw new HttpError(403, 'Origem da solicitação não permitida.');
        if (request.method !== 'DELETE' && !request.headers['content-type']?.startsWith('application/json')) throw new HttpError(415, 'Envie dados no formato JSON.');
      }
    });

    app.get('/api/auth/me', async (req) => ({ ok: true, user: await this.getUser(req.headers) }));
    app.post('/api/auth/login', async (req, reply) => {
      const input = z.object({ email: emailSchema, password: passwordSchema }).parse(req.body);
      const ipAllowed = await database.consumeAuthAttempt(`login-ip:${req.ip}`, 25, 15 * 60000);
      const emailAllowed = await database.consumeAuthAttempt(`login-email:${input.email}`, 10, 15 * 60000);
      if (!ipAllowed || !emailAllowed) throw new HttpError(429, 'Muitas tentativas. Aguarde 15 minutos e tente novamente.');
      const user = await database.findStaffUserByEmail(input.email);
      // Run the same expensive derivation even when the e-mail does not exist.
      const valid = await verifyPassword(input.password, user?.passwordHash || 'scrypt:00000000000000000000000000000000:' + '00'.repeat(64));
      if (!user || !valid) throw new HttpError(401, 'E-mail ou senha incorretos.');
      const { passwordHash: _hash, ...publicUser } = user;
      await this.issueSession(reply, publicUser, user.passwordHash);
      return { ok: true, user: publicUser };
    });
    app.post('/api/auth/logout', async (req, reply) => {
      const token = readCookies(req.headers.cookie)[STAFF_COOKIE];
      if (token) await database.deleteStaffSession(tokenHash(token));
      this.cookie(reply, STAFF_COOKIE, '', 0);
      return { ok: true };
    });
    app.post('/api/auth/password', async (req, reply) => {
      const user = await this.requireUser(req.headers, true);
      const input = z.object({ currentPassword: passwordSchema, newPassword: z.string().min(12).max(128) }).parse(req.body);
      const allowed = await database.consumeAuthAttempt(`password:${user.id}`, 10, 15 * 60000);
      if (!allowed) throw new HttpError(429, 'Muitas tentativas. Tente novamente mais tarde.');
      const stored = await database.findStaffUserById(user.id);
      if (!stored || !await verifyPassword(input.currentPassword, stored.passwordHash)) throw new HttpError(401, 'Senha atual incorreta.');
      if (input.currentPassword === input.newPassword) throw new HttpError(400, 'Escolha uma senha diferente da inicial.');
      const nextHash = await hashPassword(input.newPassword);
      if (!await database.updateStaffPassword(user.id, nextHash, stored.passwordHash)) throw new HttpError(409, 'Sua senha mudou em outra sessão. Entre novamente.');
      const next = { ...user, mustChangePassword: false };
      await this.issueSession(reply, next, nextHash);
      return { ok: true, user: next };
    });
    app.get('/api/users', async (req) => {
      await this.requireUser(req.headers);
      return { ok: true, users: await database.getStaffUsers() };
    });
    app.post('/api/users', async (req, reply) => {
      await this.requireAdmin(req.headers);
      const input = z.object({ name: z.string().trim().min(2).max(80), email: emailSchema, password: passwordSchema }).parse(req.body);
      if (await database.findStaffUserByEmail(input.email)) throw new HttpError(409, 'Este e-mail já está cadastrado.');
      const user = await database.createStaffUser({ name: input.name, email: input.email, role: 'moderator', passwordHash: await hashPassword(input.password), mustChangePassword: true });
      reply.code(201);
      return { ok: true, user };
    });
    app.post('/api/player/session', async (req, reply) => {
      const previous = verifyDevice(readCookies(req.headers.cookie)[PLAYER_COOKIE], this.secret);
      const deviceId = previous || `player-${crypto.randomUUID()}`;
      this.cookie(reply, PLAYER_COOKIE, signDevice(deviceId, this.secret), 365 * 86400);
      return { ok: true, deviceId };
    });
  }
}

export function requestError(error: unknown): { statusCode: number; error: string; code?: string } {
  if (error instanceof HttpError) return { statusCode: error.statusCode, error: error.message, code: error.code };
  if (error instanceof z.ZodError) return { statusCode: 400, error: 'Revise os dados informados.', code: 'INVALID_INPUT' };
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 500) return { statusCode: error.statusCode, error: 'Solicitação inválida. Revise os dados e tente novamente.' };
  return { statusCode: 500, error: 'Não foi possível concluir a operação. Tente novamente.' };
}
