import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, sql } from 'drizzle-orm';
import * as schema from './schema.js';
import { OFFICIAL_CHALLENGES, type ChallengeSeedData } from './challengesData.js';
import { parseRoundEvaluations, parseStoredRoundEvaluations } from './roundResults.js';
import {
  calculatePlayerPowerScore,
  getPlayerPowerTier,
} from '../../shared/achievements.js';
import type {
  AvatarId,
  ExpiredRoundSummary,
  LeaderboardEntry,
  LeaderboardsPayload,
  PlayerProfile,
  PlayerRoundEvaluation,
} from '../../shared/types.js';

const { Pool, Client } = pg;

export interface StoredMatchRecord {
  id: string;
  roomCode: string;
  challengeId: string;
  roundId?: string | null;
  roundToken?: string | null;
  winnerPlayerId: string | null;
  resultsJson: string;
  createdAt: string;
}

export interface StoredRoomRecord {
  code: string;
  name: string;
  isOpen: boolean;
  moderatorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
  mustChangePassword: boolean;
  createdAt: string;
}

export interface StoredStaffUser extends StaffUser { passwordHash: string }

function publicStaff(user: StoredStaffUser): StaffUser {
  const { passwordHash: _hash, ...safe } = user;
  return safe;
}

interface LocalPlayerRow {
  id: string;
  roomCode: string;
  deviceId: string;
  nickname: string;
  avatar: AvatarId;
  highScore: number;
  totalScore: number;
  matchesPlayed: number;
  winsCount: number;
  isBot: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LocalDbData {
  players: LocalPlayerRow[];
  matches: StoredMatchRecord[];
  rooms: StoredRoomRecord[];
  staffUsers: StoredStaffUser[];
  staffSessions: Array<{ tokenHash: string; userId: string; expiresAt: string }>;
  authAttempts: Array<{ key: string; attempts: number; expiresAt: string }>;
}

const LOCAL_DB_FILE = path.resolve(process.cwd(), '.data', 'local-db.json');

export class AppDatabase {
  private pool: pg.Pool | null = null;
  private db: NodePgDatabase<typeof schema> | null = null;
  private connected = false;
  private useLocalDb = false;
  private pgVersion = 'PostgreSQL 18';
  private localData: LocalDbData = { players: [], matches: [], rooms: [], staffUsers: [], staffSessions: [], authAttempts: [] };
  private readonly localFile: string | null;

  constructor(options: { localFile?: string | null } = {}) {
    this.localFile = options.localFile === undefined ? LOCAL_DB_FILE : options.localFile;
    // Explicit memory mode never reads environment configuration or disk.
    if (options.localFile !== undefined) {
      this.useLocalDb = true;
      this.ensureLocalStoreLoaded();
    }
  }

  private ensureLocalStoreLoaded(): void {
    if (this.localFile === null) return;
    const dir = path.dirname(this.localFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(this.localFile)) {
      const raw = fs.readFileSync(this.localFile, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<LocalDbData>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid local database');
      for (const key of ['players', 'matches', 'rooms', 'staffUsers', 'staffSessions', 'authAttempts'] as const) {
        if (parsed[key] !== undefined && !Array.isArray(parsed[key])) throw new Error(`Invalid local database: ${key}`);
      }
      if (!parsed.staffUsers || parsed.rooms?.some((r) => r.moderatorId === undefined) || parsed.players?.some((p) => !p.roomCode)) {
        fs.copyFileSync(this.localFile, `${this.localFile}.pre-security-${crypto.randomUUID()}.bak`);
      }
      this.localData = {
        staffUsers: parsed.staffUsers ?? [],
        staffSessions: parsed.staffSessions ?? [],
        authAttempts: parsed.authAttempts ?? [],
        players: (parsed.players ?? []).map((p) => ({ ...p, roomCode: p.roomCode || 'MDX26' })),
        matches: (parsed.matches ?? []).map((m) => ({ ...m, roomCode: m.roomCode || 'MDX26' })),
        rooms: parsed.rooms?.length ? parsed.rooms.map((r) => ({
          code: (r.code || 'MDX26').toUpperCase(),
          name: r.name || 'Arena MDX Principal',
          isOpen: typeof r.isOpen === 'boolean' ? r.isOpen : true,
          moderatorId: r.moderatorId ?? null,
          createdAt: r.createdAt || new Date().toISOString(),
          updatedAt: r.updatedAt || new Date().toISOString(),
        })) : [{
          code: 'MDX26', name: 'Arena MDX Principal', isOpen: true, moderatorId: null,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        }],
      };
    }
    this.saveLocalStore();
  }

  private saveLocalStore(): void {
    if (this.localFile === null) return;
    const dir = path.dirname(this.localFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const temporary = `${this.localFile}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(this.localData, null, 2), { encoding: 'utf-8', mode: 0o600 });
    fs.renameSync(temporary, this.localFile);
  }

  private activateLocalFallback(reason: string): void {
    this.connected = false;
    this.db = null;
    this.useLocalDb = true;
    this.pgVersion = 'Local JSON DB (Dev Mode)';
    this.ensureLocalStoreLoaded();
    console.log(`📂 [DB] ${reason} -> Usando banco local em .data/local-db.json`);
  }

  private ensureDb(): NodePgDatabase<typeof schema> {
    if (!this.db) {
      throw new Error(
        'Banco de dados PostgreSQL 18 não inicializado. Verifique DATABASE_URL no arquivo .env.'
      );
    }
    return this.db;
  }

  /**
   * Caso o database especificado na DATABASE_URL ainda não exista no servidor PostgreSQL 18,
   * conecta no banco padrão 'postgres' e cria o database automaticamente.
   */
  private async ensureDatabaseExists(connectionString: string): Promise<void> {
    try {
      const parsed = new URL(connectionString);
      const dbName = parsed.pathname.replace(/^\//, '').trim();
      if (!dbName || dbName === 'postgres') return;

      const adminUrl = new URL(connectionString);
      adminUrl.pathname = '/postgres';

      const adminClient = new Client({
        connectionString: adminUrl.toString(),
        connectionTimeoutMillis: 4000,
      });
      await adminClient.connect();
      try {
        const existsRes = await adminClient.query(
          'SELECT 1 FROM pg_database WHERE datname = $1',
          [dbName]
        );
        if (existsRes.rowCount === 0) {
          const safeIdentifier = dbName.replace(/[^a-zA-Z0-9_]/g, '');
          await adminClient.query(`CREATE DATABASE "${safeIdentifier}"`);
          console.log(`✅ [DB] Database "${safeIdentifier}" criado automaticamente no PostgreSQL 18.`);
        }
      } finally {
        await adminClient.end().catch(() => {});
      }
    } catch {
      // Ignora caso o usuário do banco não tenha permissão em /postgres e o DB já exista
    }
  }

  public async init(): Promise<void> {
    if (this.useLocalDb) return;
    const dbUrl = (process.env.DATABASE_URL || '').trim();
    if (!dbUrl) {
      if (process.env.NODE_ENV === 'production') throw new Error('DATABASE_URL is required in production');
      this.activateLocalFallback('DATABASE_URL ausente no .env');
      return;
    }

    try {
      await this.ensureDatabaseExists(dbUrl);

      this.pool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 5000,
        max: 15,
      });

      const client = await this.pool.connect();
      try {
        const versionRes = await client.query('SHOW server_version;');
        const rawVersion = versionRes.rows?.[0]?.server_version || '18';
        this.pgVersion = `PostgreSQL ${rawVersion}`;

        await client.query('BEGIN');
        await client.query(`
          CREATE TABLE IF NOT EXISTS players (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            room_code VARCHAR(32) NOT NULL DEFAULT 'MDX26',
            device_id VARCHAR(128) NOT NULL,
            nickname VARCHAR(40) NOT NULL,
            avatar TEXT NOT NULL DEFAULT 'menina-mdx',
            high_score INTEGER NOT NULL DEFAULT 0,
            total_score INTEGER NOT NULL DEFAULT 0,
            matches_played INTEGER NOT NULL DEFAULT 0,
            wins_count INTEGER NOT NULL DEFAULT 0,
            is_bot BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT players_room_device_unique UNIQUE (room_code, device_id)
          );

          DO $$
          DECLARE legacy RECORD;
          BEGIN
            FOR legacy IN SELECT conname FROM pg_constraint
              WHERE conrelid = 'players'::regclass AND contype = 'u'
                AND conkey = ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'players'::regclass AND attname = 'device_id')]
            LOOP
              CREATE TABLE IF NOT EXISTS players_pre_security_backup AS TABLE players;
              EXECUTE format('ALTER TABLE players DROP CONSTRAINT %I', legacy.conname);
            END LOOP;
          END $$;

          ALTER TABLE players ADD COLUMN IF NOT EXISTS room_code VARCHAR(32) NOT NULL DEFAULT 'MDX26';
          ALTER TABLE players ALTER COLUMN avatar TYPE TEXT;

          CREATE INDEX IF NOT EXISTS idx_players_room_code ON players (room_code);
          CREATE INDEX IF NOT EXISTS idx_players_high_score ON players (high_score DESC);
          CREATE INDEX IF NOT EXISTS idx_players_wins_count ON players (wins_count DESC);
          CREATE INDEX IF NOT EXISTS idx_players_is_bot ON players (is_bot);

          UPDATE players SET room_code = 'MDX26' WHERE room_code IS NULL OR room_code = '';
          CREATE UNIQUE INDEX IF NOT EXISTS players_room_device_unique ON players (room_code, device_id);

          CREATE TABLE IF NOT EXISTS staff_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(254) UNIQUE NOT NULL,
            name VARCHAR(120) NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
            password_hash TEXT NOT NULL,
            must_change_password BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          );
          CREATE TABLE IF NOT EXISTS staff_sessions (
            token_hash TEXT PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES staff_users(id) ON DELETE CASCADE,
            expires_at TIMESTAMP NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_staff_sessions_user ON staff_sessions(user_id);
          CREATE INDEX IF NOT EXISTS idx_staff_sessions_expiry ON staff_sessions(expires_at);
          CREATE TABLE IF NOT EXISTS auth_attempts (
            key TEXT PRIMARY KEY,
            attempts INTEGER NOT NULL,
            expires_at TIMESTAMP NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_auth_attempts_expiry ON auth_attempts(expires_at);

          CREATE TABLE IF NOT EXISTS challenges (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(120) NOT NULL,
            category VARCHAR(64) NOT NULL,
            difficulty VARCHAR(24) NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            full_prompt TEXT NOT NULL,
            subject_layer TEXT NOT NULL,
            style_layer TEXT NOT NULL,
            environment_layer TEXT NOT NULL,
            hint_1 TEXT NOT NULL,
            hint_2 TEXT NOT NULL,
            keywords_json TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS matches (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            room_code VARCHAR(32) NOT NULL,
            challenge_id VARCHAR(64) NOT NULL,
            round_id TEXT,
            round_token TEXT,
            winner_player_id UUID,
            results_json TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          );

          ALTER TABLE matches ALTER COLUMN room_code TYPE VARCHAR(32);
          ALTER TABLE matches ADD COLUMN IF NOT EXISTS round_id TEXT;
          ALTER TABLE matches ADD COLUMN IF NOT EXISTS round_token TEXT;
          CREATE UNIQUE INDEX IF NOT EXISTS matches_room_round_token_unique ON matches(room_code, round_token) WHERE round_token IS NOT NULL;
          CREATE INDEX IF NOT EXISTS idx_matches_room_code ON matches(room_code);

          UPDATE matches SET room_code = 'MDX26' WHERE room_code IS NULL OR room_code = '';

          CREATE TABLE IF NOT EXISTS rooms (
            code VARCHAR(32) PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            is_open BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          );

          ALTER TABLE rooms ADD COLUMN IF NOT EXISTS moderator_id UUID REFERENCES staff_users(id) ON DELETE SET NULL;
          CREATE INDEX IF NOT EXISTS idx_rooms_moderator ON rooms(moderator_id);

          INSERT INTO rooms (code, name, is_open)
          VALUES ('MDX26', 'Arena MDX Principal', true)
          ON CONFLICT (code) DO NOTHING;
        `);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }

      this.db = drizzle(this.pool, { schema });
      this.connected = true;
      this.useLocalDb = false;
      console.log(`✅ [DB] Conectado oficialmente ao ${this.pgVersion} via Drizzle ORM.`);

      await this.seedPostgresIfNeeded();
    } catch (err) {
      await this.pool?.end();
      this.pool = null;
      this.db = null;
      this.connected = false;
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      const msg = err instanceof Error ? err.message : String(err);
      this.activateLocalFallback(`PostgreSQL inacessível em modo dev (${msg})`);
    }
  }

  public isPostgresActive(): boolean {
    return this.connected;
  }

  public getDatabaseVersion(): string {
    return this.pgVersion;
  }

  public async seedPostgresIfNeeded(): Promise<void> {
    if (this.useLocalDb) return;
    const db = this.ensureDb();

    for (const challenge of OFFICIAL_CHALLENGES) {
      await db
        .insert(schema.challenges)
        .values({
          id: challenge.id,
          title: challenge.title,
          category: challenge.category,
          difficulty: challenge.difficulty,
          imageUrl: challenge.imageUrl,
          fullPrompt: challenge.fullPrompt,
          subjectLayer: challenge.subjectLayer,
          styleLayer: challenge.styleLayer,
          environmentLayer: challenge.environmentLayer,
          hint1: challenge.hint1,
          hint2: challenge.hint2,
          keywordsJson: JSON.stringify(challenge.keywords),
        })
        .onConflictDoUpdate({
          target: schema.challenges.id,
          set: {
            title: challenge.title,
            category: challenge.category,
            difficulty: challenge.difficulty,
            imageUrl: challenge.imageUrl,
            fullPrompt: challenge.fullPrompt,
            subjectLayer: challenge.subjectLayer,
            styleLayer: challenge.styleLayer,
            environmentLayer: challenge.environmentLayer,
            hint1: challenge.hint1,
            hint2: challenge.hint2,
            keywordsJson: JSON.stringify(challenge.keywords),
          },
        });
    }

    // Remove qualquer perfil de seed ou bot do ranking para manter apenas jogadoras reais
    await db.execute(
      sql`DELETE FROM players WHERE is_bot = true OR device_id LIKE 'seed-%' OR device_id LIKE 'bot-%'`
    );
  }

  public async clearAllRankings(roomCode?: string): Promise<void> {
    const targetRoom = roomCode ? roomCode.toUpperCase().trim() : null;
    if (this.useLocalDb) {
      if (targetRoom) {
        this.localData.matches = this.localData.matches.filter((m) => m.roomCode !== targetRoom);
        this.localData.players = this.localData.players
          .filter((p) => p.roomCode !== targetRoom || (!p.isBot && !p.deviceId.startsWith('seed-') && !p.deviceId.startsWith('bot-')))
          .map((p) =>
            p.roomCode === targetRoom
              ? {
                  ...p,
                  highScore: 0,
                  totalScore: 0,
                  matchesPlayed: 0,
                  winsCount: 0,
                  updatedAt: new Date().toISOString(),
                }
              : p
          );
      } else {
        this.localData.matches = [];
        this.localData.players = this.localData.players
          .filter((p) => !p.isBot && !p.deviceId.startsWith('seed-') && !p.deviceId.startsWith('bot-'))
          .map((p) => ({
            ...p,
            highScore: 0,
            totalScore: 0,
            matchesPlayed: 0,
            winsCount: 0,
            updatedAt: new Date().toISOString(),
          }));
      }
      this.saveLocalStore();
      return;
    }

    await this.ensureDb().transaction(async (db) => {
      if (targetRoom) {
        await db.execute(sql`DELETE FROM matches WHERE room_code = ${targetRoom}`);
        await db.execute(
          sql`UPDATE players SET high_score = 0, total_score = 0, matches_played = 0, wins_count = 0, updated_at = NOW() WHERE room_code = ${targetRoom}`
        );
      } else {
        await db.execute(sql`DELETE FROM matches`);
        await db.execute(
          sql`UPDATE players SET high_score = 0, total_score = 0, matches_played = 0, wins_count = 0, updated_at = NOW()`
        );
      }
      await db.execute(targetRoom
        ? sql`DELETE FROM players WHERE room_code = ${targetRoom} AND (is_bot = true OR device_id LIKE 'seed-%' OR device_id LIKE 'bot-%')`
        : sql`DELETE FROM players WHERE is_bot = true OR device_id LIKE 'seed-%' OR device_id LIKE 'bot-%'`
      );
    });
  }

  public async deletePlayerById(playerId: string): Promise<boolean> {
    if (this.useLocalDb) {
      const before = this.localData.players.length;
      this.localData.players = this.localData.players.filter((p) => p.id !== playerId);
      const changed = this.localData.players.length !== before;
      if (changed) this.saveLocalStore();
      return changed;
    }

    const db = this.ensureDb();
    const deleted = await db
      .delete(schema.players)
      .where(eq(schema.players.id, playerId))
      .returning({ id: schema.players.id });
    return deleted.length > 0;
  }

  public async rebindPlayerDeviceId(playerId: string, roomCode: string, newDeviceId: string): Promise<boolean> {
    const targetRoom = roomCode.toUpperCase().trim();
    if (!targetRoom || !newDeviceId.trim() || newDeviceId.length > 128) throw new Error('Invalid player rebind');
    if (this.useLocalDb) {
      const player = this.localData.players.find((p) => p.id === playerId && p.roomCode === targetRoom);
      if (!player || this.localData.players.some((p) => p.id !== playerId && p.roomCode === targetRoom && p.deviceId === newDeviceId)) return false;
      player.deviceId = newDeviceId;
      player.updatedAt = new Date().toISOString();
      this.saveLocalStore();
      return true;
    }

    try {
      const updated = await this.ensureDb().update(schema.players)
        .set({ deviceId: newDeviceId, updatedAt: new Date() })
        .where(and(eq(schema.players.id, playerId), eq(schema.players.roomCode, targetRoom)))
        .returning({ id: schema.players.id });
      return updated.length > 0;
    } catch (error) {
      // The composite unique index also rejects concurrent claims of the same recovery code.
      const pgError = error as { code?: string; cause?: { code?: string } };
      if (pgError.code === '23505' || pgError.cause?.code === '23505') return false;
      throw error;
    }
  }

  public async getAllPlayersForAdmin(roomCode?: string): Promise<
    Array<{
      id: string;
      roomCode: string;
      deviceId: string;
      nickname: string;
      avatar: AvatarId;
      highScore: number;
      totalScore: number;
      matchesPlayed: number;
      winsCount: number;
      updatedAt: string;
    }>
  > {
    const targetRoom = roomCode ? roomCode.toUpperCase().trim() : null;
    if (this.useLocalDb) {
      return this.localData.players
        .filter((p) => !p.isBot && (!targetRoom || (p.roomCode || 'MDX26') === targetRoom))
        .sort((a, b) => b.highScore - a.highScore || b.winsCount - a.winsCount)
        .map((r) => ({
          id: r.id,
          roomCode: r.roomCode || 'MDX26',
          deviceId: r.deviceId,
          nickname: r.nickname,
          avatar: r.avatar,
          highScore: r.highScore,
          totalScore: r.totalScore,
          matchesPlayed: r.matchesPlayed,
          winsCount: r.winsCount,
          updatedAt: r.updatedAt,
        }));
    }

    const db = this.ensureDb();
    const condition = targetRoom
      ? and(eq(schema.players.isBot, false), eq(schema.players.roomCode, targetRoom))
      : eq(schema.players.isBot, false);

    const rows = await db
      .select()
      .from(schema.players)
      .where(condition)
      .orderBy(desc(schema.players.highScore), desc(schema.players.winsCount));

    return rows.map((r) => ({
      id: r.id,
      roomCode: r.roomCode,
      deviceId: r.deviceId,
      nickname: r.nickname,
      avatar: r.avatar as AvatarId,
      highScore: r.highScore,
      totalScore: r.totalScore,
      matchesPlayed: r.matchesPlayed,
      winsCount: r.winsCount,
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  public async findPlayerByDeviceId(deviceId: string, roomCode = 'MDX26'): Promise<PlayerProfile | null> {
    const targetRoom = roomCode.toUpperCase().trim();
    if (this.useLocalDb) {
      const r = this.localData.players.find((p) => p.deviceId === deviceId && p.roomCode === targetRoom);
      if (!r) return null;
      return {
        id: r.id,
        roomCode: r.roomCode,
        deviceId: r.deviceId,
        nickname: r.nickname,
        avatar: r.avatar,
        highScore: r.highScore,
        totalScore: r.totalScore,
        matchesPlayed: r.matchesPlayed,
        winsCount: r.winsCount,
        isBot: r.isBot,
      };
    }

    const db = this.ensureDb();
    const rows = await db
      .select()
      .from(schema.players)
      .where(and(eq(schema.players.deviceId, deviceId), eq(schema.players.roomCode, targetRoom)))
      .limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      roomCode: r.roomCode,
      deviceId: r.deviceId,
      nickname: r.nickname,
      avatar: r.avatar as AvatarId,
      highScore: r.highScore,
      totalScore: r.totalScore,
      matchesPlayed: r.matchesPlayed,
      winsCount: r.winsCount,
      isBot: r.isBot,
    };
  }

  public async upsertPlayer(params: {
    deviceId: string;
    nickname: string;
    avatar: AvatarId;
    isBot?: boolean;
    roomCode?: string;
  }): Promise<PlayerProfile> {
    const targetRoom = (params.roomCode || 'MDX26').toUpperCase().trim();
    if (this.useLocalDb) {
      const nowIso = new Date().toISOString();
      const existing = this.localData.players.find((p) => p.deviceId === params.deviceId && p.roomCode === targetRoom);
      if (existing) {
        existing.nickname = params.nickname;
        existing.avatar = params.avatar;
        existing.roomCode = targetRoom;
        existing.updatedAt = nowIso;
        this.saveLocalStore();
        return {
          id: existing.id,
          roomCode: existing.roomCode,
          deviceId: existing.deviceId,
          nickname: existing.nickname,
          avatar: existing.avatar,
          highScore: existing.highScore,
          totalScore: existing.totalScore,
          matchesPlayed: existing.matchesPlayed,
          winsCount: existing.winsCount,
          isBot: existing.isBot,
        };
      }

      const inserted: LocalPlayerRow = {
        id: crypto.randomUUID(),
        roomCode: targetRoom,
        deviceId: params.deviceId,
        nickname: params.nickname,
        avatar: params.avatar,
        highScore: 0,
        totalScore: 0,
        matchesPlayed: 0,
        winsCount: 0,
        isBot: params.isBot ?? false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      this.localData.players.push(inserted);
      this.saveLocalStore();

      return {
        id: inserted.id,
        roomCode: inserted.roomCode,
        deviceId: inserted.deviceId,
        nickname: inserted.nickname,
        avatar: inserted.avatar,
        highScore: inserted.highScore,
        totalScore: inserted.totalScore,
        matchesPlayed: inserted.matchesPlayed,
        winsCount: inserted.winsCount,
        isBot: inserted.isBot,
      };
    }

    const db = this.ensureDb();
    const [inserted] = await db
      .insert(schema.players)
      .values({
        roomCode: targetRoom,
        deviceId: params.deviceId,
        nickname: params.nickname,
        avatar: params.avatar,
        isBot: params.isBot ?? false,
      })
      .onConflictDoUpdate({
        target: [schema.players.roomCode, schema.players.deviceId],
        set: { nickname: params.nickname, avatar: params.avatar, updatedAt: new Date() },
      })
      .returning();

    return {
      id: inserted.id,
      roomCode: inserted.roomCode,
      deviceId: inserted.deviceId,
      nickname: inserted.nickname,
      avatar: inserted.avatar as AvatarId,
      highScore: inserted.highScore,
      totalScore: inserted.totalScore,
      matchesPlayed: inserted.matchesPlayed,
      winsCount: inserted.winsCount,
      isBot: inserted.isBot,
    };
  }

  public async recordPlayerRoundStats(params: {
    deviceId: string;
    roomCode: string;
    roundScore: number;
    isWinner: boolean;
  }): Promise<{ newHighScore: boolean; updatedProfile: PlayerProfile | null }> {
    const targetRoom = params.roomCode.toUpperCase().trim();
    if (!targetRoom || !Number.isSafeInteger(params.roundScore) || params.roundScore < 0) throw new Error('Invalid round stats');
    if (this.useLocalDb) {
      const existing = this.localData.players.find((p) => p.deviceId === params.deviceId && p.roomCode === targetRoom);
      if (!existing) return { newHighScore: false, updatedProfile: null };

      const isNewHigh = params.roundScore > existing.highScore;
      existing.highScore = isNewHigh ? params.roundScore : existing.highScore;
      existing.totalScore += params.roundScore;
      existing.matchesPlayed += 1;
      existing.winsCount += params.isWinner ? 1 : 0;
      existing.updatedAt = new Date().toISOString();
      this.saveLocalStore();

      return {
        newHighScore: isNewHigh,
        updatedProfile: {
          id: existing.id,
          roomCode: existing.roomCode,
          deviceId: existing.deviceId,
          nickname: existing.nickname,
          avatar: existing.avatar,
          highScore: existing.highScore,
          totalScore: existing.totalScore,
          matchesPlayed: existing.matchesPlayed,
          winsCount: existing.winsCount,
          isBot: existing.isBot,
        },
      };
    }

    const db = this.ensureDb();
    return db.transaction(async (tx) => {
    const condition = and(eq(schema.players.deviceId, params.deviceId), eq(schema.players.roomCode, targetRoom));
    const [existing] = await tx.select().from(schema.players).where(condition).for('update');
    if (!existing) return { newHighScore: false, updatedProfile: null };
    const [updated] = await tx
      .update(schema.players)
      .set({
        highScore: sql`GREATEST(${schema.players.highScore}, ${params.roundScore})`,
        totalScore: sql`${schema.players.totalScore} + ${params.roundScore}`,
        matchesPlayed: sql`${schema.players.matchesPlayed} + 1`,
        winsCount: sql`${schema.players.winsCount} + ${params.isWinner ? 1 : 0}`,
        updatedAt: new Date(),
      })
      .where(condition)
      .returning();

    return {
      newHighScore: params.roundScore > existing.highScore,
      updatedProfile: {
        id: updated.id,
        roomCode: updated.roomCode,
        deviceId: updated.deviceId,
        nickname: updated.nickname,
        avatar: updated.avatar as AvatarId,
        highScore: updated.highScore,
        totalScore: updated.totalScore,
        matchesPlayed: updated.matchesPlayed,
        winsCount: updated.winsCount,
        isBot: updated.isBot,
      },
    };
    });
  }

  public async recordMatch(params: {
    roomCode: string;
    challengeId: string;
    winnerPlayerId: string | null;
    results: unknown;
    roundId?: string | null;
    roundToken?: string | null;
  }): Promise<void> {
    const resultsJson = JSON.stringify(params.results);
    const roomCode = params.roomCode.toUpperCase().trim();
    if (this.useLocalDb) {
      if (params.roundToken != null && this.localData.matches.some((m) => m.roomCode === roomCode && m.roundToken === params.roundToken)) return;
      this.localData.matches.push({
        id: crypto.randomUUID(),
        roomCode,
        roundId: params.roundId ?? null,
        roundToken: params.roundToken ?? null,
        challengeId: params.challengeId,
        winnerPlayerId: params.winnerPlayerId,
        resultsJson,
        createdAt: new Date().toISOString(),
      });
      this.saveLocalStore();
      return;
    }

    const db = this.ensureDb();
    const isUuid =
      params.winnerPlayerId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        params.winnerPlayerId
      );
    await db.insert(schema.matches).values({
      roomCode,
      roundId: params.roundId ?? null,
      roundToken: params.roundToken ?? null,
      challengeId: params.challengeId,
      winnerPlayerId: isUuid ? params.winnerPlayerId : null,
      resultsJson,
    }).onConflictDoNothing();
  }

  public async getRoundSummary(roomCode: string, roundToken: string, roomName: string): Promise<ExpiredRoundSummary | null> {
    const targetRoom = roomCode.toUpperCase().trim();
    if (!targetRoom || !roundToken) return null;
    const match = this.useLocalDb
      ? this.localData.matches.find((m) => m.roomCode === targetRoom && m.roundToken === roundToken)
      : (await this.ensureDb().select().from(schema.matches)
        .where(and(eq(schema.matches.roomCode, targetRoom), eq(schema.matches.roundToken, roundToken))).limit(1))[0];
    if (!match) return null;
    const evaluations = parseStoredRoundEvaluations(match.resultsJson);
    const challenge = OFFICIAL_CHALLENGES.find((c) => c.id === match.challengeId);
    if (!evaluations || !challenge) return null;
    const winner = evaluations.find((e) => e.playerId === match.winnerPlayerId) ?? evaluations.find((e) => e.isWinner);
    return {
      roundId: match.roundId ?? match.id,
      roundToken,
      roomCode: targetRoom,
      roomName,
      finishedAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
      challengeTitle: challenge.title,
      challengeImageUrl: challenge.imageUrl,
      winnerNickname: winner?.nickname ?? null,
      winnerScore: winner?.totalScore ?? null,
      evaluations,
    };
  }

  public async commitRound(params: {
    roomCode: string;
    roundId: string;
    roundToken: string;
    challengeId: string;
    winnerPlayerId: string | null;
    players: Array<{ deviceId: string; roundScore: number; isWinner: boolean }>;
  }, enrich: (updates: Map<string, { newHighScore: boolean; updatedProfile: PlayerProfile | null }>) => PlayerRoundEvaluation[]): Promise<PlayerRoundEvaluation[]> {
    const roomCode = params.roomCode.toUpperCase().trim();
    if (!roomCode || !params.roundId || !params.roundToken || !params.challengeId) throw new Error('Invalid round');
    if (new Set(params.players.map((p) => p.deviceId)).size !== params.players.length) throw new Error('Duplicate round player');
    for (const player of params.players) {
      if (!player.deviceId || !Number.isSafeInteger(player.roundScore) || player.roundScore < 0 || typeof player.isWinner !== 'boolean') throw new Error('Invalid round stats');
    }
    const updates = new Map<string, { newHighScore: boolean; updatedProfile: PlayerProfile | null }>();
    const existingResults = (json: string): PlayerRoundEvaluation[] => {
      const evaluations = parseStoredRoundEvaluations(json);
      if (!evaluations) throw new Error('Invalid stored round evaluations');
      return evaluations;
    };
    const enrichedResults = (): PlayerRoundEvaluation[] => {
      const evaluations = parseRoundEvaluations(enrich(updates));
      if (!evaluations) throw new Error('Invalid round evaluations');
      return evaluations;
    };
    const winnerPlayerId = params.winnerPlayerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.winnerPlayerId) ? params.winnerPlayerId : null;
    if (this.useLocalDb) {
      if (!this.localData.rooms.some((r) => r.code === roomCode)) throw new Error('Unknown room');
      const existing = this.localData.matches.find((m) => m.roomCode === roomCode && m.roundToken === params.roundToken);
      if (existing) return existingResults(existing.resultsJson);
      const previous = this.localData;
      const staged = { ...previous, players: previous.players.map((p) => ({ ...p })), matches: [...previous.matches] };
      const now = new Date().toISOString();
      for (const stats of params.players) {
        const player = staged.players.find((p) => p.deviceId === stats.deviceId && p.roomCode === roomCode);
        if (!player) throw new Error('Missing round player');
        const newHighScore = stats.roundScore > player.highScore;
        player.highScore = Math.max(player.highScore, stats.roundScore);
        player.totalScore += stats.roundScore;
        player.matchesPlayed++;
        player.winsCount += stats.isWinner ? 1 : 0;
        player.updatedAt = now;
        const { createdAt: _created, updatedAt: _updated, ...profile } = player;
        updates.set(stats.deviceId, { newHighScore, updatedProfile: profile });
      }
      const evaluations = enrichedResults();
      staged.matches.push({ id: crypto.randomUUID(), roomCode, roundId: params.roundId, roundToken: params.roundToken, challengeId: params.challengeId, winnerPlayerId, resultsJson: JSON.stringify(evaluations), createdAt: now });
      this.localData = staged;
      try {
        this.saveLocalStore();
      } catch (error) {
        this.localData = previous;
        throw error;
      }
      return evaluations;
    }
    return this.ensureDb().transaction(async (tx) => {
      const [room] = await tx.select({ code: schema.rooms.code }).from(schema.rooms).where(eq(schema.rooms.code, roomCode)).for('update');
      if (!room) throw new Error('Unknown room');
      const [existing] = await tx.select().from(schema.matches).where(and(eq(schema.matches.roomCode, roomCode), eq(schema.matches.roundToken, params.roundToken))).limit(1);
      if (existing) return existingResults(existing.resultsJson);
      for (const stats of params.players) {
        const condition = and(eq(schema.players.deviceId, stats.deviceId), eq(schema.players.roomCode, roomCode));
        const [player] = await tx.select().from(schema.players).where(condition).for('update');
        if (!player) throw new Error('Missing round player');
        const [updated] = await tx.update(schema.players).set({
          highScore: sql`GREATEST(${schema.players.highScore}, ${stats.roundScore})`,
          totalScore: sql`${schema.players.totalScore} + ${stats.roundScore}`,
          matchesPlayed: sql`${schema.players.matchesPlayed} + 1`,
          winsCount: sql`${schema.players.winsCount} + ${stats.isWinner ? 1 : 0}`,
          updatedAt: new Date(),
        }).where(condition).returning();
        if (!updated) throw new Error('Missing round player');
        const { createdAt: _created, updatedAt: _updated, ...profile } = updated;
        updates.set(stats.deviceId, { newHighScore: stats.roundScore > player.highScore, updatedProfile: { ...profile, avatar: profile.avatar as AvatarId } });
      }
      const evaluations = enrichedResults();
      await tx.insert(schema.matches).values({ roomCode, roundId: params.roundId, roundToken: params.roundToken, challengeId: params.challengeId, winnerPlayerId, resultsJson: JSON.stringify(evaluations) });
      return evaluations;
    });
  }

  public async getChallenges(): Promise<ChallengeSeedData[]> {
    return OFFICIAL_CHALLENGES;
  }

  public async getLeaderboards(limit = 100, roomCode?: string): Promise<LeaderboardsPayload> {
    const targetRoom = roomCode ? roomCode.toUpperCase().trim() : null;
    let rawPlayers: Array<{
      id: string;
      nickname: string;
      avatar: AvatarId;
      highScore: number;
      winsCount: number;
      matchesPlayed: number;
      totalScore: number;
      isBot: boolean;
      updatedAt: string;
    }> = [];
    let totalMatchesCount = 0;

    if (this.useLocalDb) {
      rawPlayers = this.localData.players
        .filter((r) => !r.isBot && (!targetRoom || (r.roomCode || 'MDX26') === targetRoom))
        .map((r) => ({
          id: r.id,
          nickname: r.nickname,
          avatar: r.avatar,
          highScore: r.highScore,
          winsCount: r.winsCount,
          matchesPlayed: r.matchesPlayed,
          totalScore: r.totalScore,
          isBot: r.isBot,
          updatedAt: r.updatedAt,
        }));
      totalMatchesCount = targetRoom
        ? this.localData.matches.filter((m) => (m.roomCode || 'MDX26') === targetRoom).length
        : this.localData.matches.length;
    } else {
      const db = this.ensureDb();
      const condition = targetRoom
        ? and(eq(schema.players.isBot, false), eq(schema.players.roomCode, targetRoom))
        : eq(schema.players.isBot, false);

      const rows = await db
        .select()
        .from(schema.players)
        .where(condition);

      rawPlayers = rows.map((r) => ({
        id: r.id,
        nickname: r.nickname,
        avatar: r.avatar as AvatarId,
        highScore: r.highScore,
        winsCount: r.winsCount,
        matchesPlayed: r.matchesPlayed,
        totalScore: r.totalScore,
        isBot: r.isBot,
        updatedAt: r.updatedAt.toISOString(),
      }));

      const matchCountRes = targetRoom
        ? await db
            .select({ count: sql<number>`count(*)::int` })
            .from(schema.matches)
            .where(eq(schema.matches.roomCode, targetRoom))
        : await db
            .select({ count: sql<number>`count(*)::int` })
            .from(schema.matches);
      totalMatchesCount = matchCountRes[0]?.count ?? 0;
    }

    // Filtra jogadoras que tenham pelo menos 1 partida ou score > 0 para o ranking
    const activePlayers = rawPlayers.filter((p) => p.matchesPlayed > 0 || p.highScore > 0);

    const toEntries = (list: typeof activePlayers): LeaderboardEntry[] =>
      list.slice(0, limit).map((p, idx) => {
        const powerScore = calculatePlayerPowerScore({
          highScore: p.highScore,
          totalScore: p.totalScore,
          winsCount: p.winsCount,
          matchesPlayed: p.matchesPlayed,
        });
        const tier = getPlayerPowerTier({
          highScore: p.highScore,
          totalScore: p.totalScore,
          winsCount: p.winsCount,
          matchesPlayed: p.matchesPlayed,
        });
        return {
          rank: idx + 1,
          playerId: p.id,
          nickname: p.nickname,
          avatar: p.avatar,
          highScore: p.highScore,
          winsCount: p.winsCount,
          matchesPlayed: p.matchesPlayed,
          totalScore: p.totalScore,
          powerScore,
          powerLevel: tier.level,
          powerTitle: tier.shortTitle,
          updatedAt: p.updatedAt,
        };
      });

    // 1. General (Ranking de Poder / PWR): amontoado acumulado de pontos + vitórias + partidas
    const generalSorted = [...activePlayers].sort((a, b) => {
      const pwrA = calculatePlayerPowerScore(a);
      const pwrB = calculatePlayerPowerScore(b);
      if (pwrB !== pwrA) return pwrB - pwrA;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.highScore - a.highScore;
    });

    // 2. Points: highScore DESC
    const pointsSorted = [...activePlayers].sort((a, b) => {
      if (b.highScore !== a.highScore) return b.highScore - a.highScore;
      return b.winsCount - a.winsCount;
    });

    // 3. Wins: winsCount DESC, highScore DESC
    const winsSorted = [...activePlayers].sort((a, b) => {
      if (b.winsCount !== a.winsCount) return b.winsCount - a.winsCount;
      if (b.highScore !== a.highScore) return b.highScore - a.highScore;
      return b.matchesPlayed - a.matchesPlayed;
    });

    const highestScoreEver = activePlayers.reduce(
      (max, p) => (p.highScore > max ? p.highScore : max),
      0
    );

    return {
      general: toEntries(generalSorted),
      points: toEntries(pointsSorted),
      wins: toEntries(winsSorted),
      stats: {
        totalPlayers: activePlayers.length,
        totalMatches: totalMatchesCount,
        highestScoreEver,
      },
    };
  }

  public async getRooms(): Promise<StoredRoomRecord[]> {
    if (this.useLocalDb) {
      if (!this.localData.rooms || this.localData.rooms.length === 0) {
        this.localData.rooms = [
          {
            code: 'MDX26',
            name: 'Arena MDX Principal',
            isOpen: true,
            moderatorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        this.saveLocalStore();
      }
      return this.localData.rooms.map((room) => ({ ...room }));
    }

    const db = this.ensureDb();
    const rows = await db.select().from(schema.rooms).orderBy(desc(schema.rooms.updatedAt));
    if (rows.length === 0) {
      await db
        .insert(schema.rooms)
        .values({
          code: 'MDX26',
          name: 'Arena MDX Principal',
          isOpen: true,
          moderatorId: null,
        })
        .onConflictDoNothing();
      return [
        {
          code: 'MDX26',
          name: 'Arena MDX Principal',
          isOpen: true,
          moderatorId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
    return rows.map((r) => ({
      code: r.code,
      name: r.name,
      isOpen: r.isOpen,
      moderatorId: r.moderatorId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  public async upsertRoom(
    code: string,
    name: string,
    isOpen = true,
    moderatorId?: string | null
  ): Promise<StoredRoomRecord> {
    const cleanCode = (code || 'MDX26').toUpperCase().trim();
    const cleanName = (name || `Sala ${cleanCode}`).trim();
    const nowIso = new Date().toISOString();
    if (moderatorId && !(await this.findStaffUserById(moderatorId))) throw new Error('Unknown staff user');

    if (this.useLocalDb) {
      const idx = this.localData.rooms.findIndex((r) => r.code === cleanCode);
      if (idx !== -1) {
        this.localData.rooms[idx].name = cleanName;
        this.localData.rooms[idx].isOpen = isOpen;
        if (moderatorId !== undefined) this.localData.rooms[idx].moderatorId = moderatorId;
        this.localData.rooms[idx].updatedAt = nowIso;
      } else {
        this.localData.rooms.push({
          code: cleanCode,
          name: cleanName,
          isOpen,
          moderatorId: moderatorId ?? null,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
      this.saveLocalStore();
      return { ...this.localData.rooms.find((r) => r.code === cleanCode)! };
    }

    const db = this.ensureDb();
    const [room] = await db
      .insert(schema.rooms)
      .values({
        code: cleanCode,
        name: cleanName,
        isOpen,
        moderatorId: moderatorId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.rooms.code,
        set: {
          name: cleanName,
          isOpen,
          ...(moderatorId === undefined ? {} : { moderatorId }),
          updatedAt: new Date(),
        },
      }).returning();

    return {
      code: room.code,
      name: room.name,
      isOpen: room.isOpen,
      moderatorId: room.moderatorId,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };
  }

  /** Room creation must not use the edit/upsert path: duplicate codes are rejected atomically. */
  public async createRoom(code: string, name: string, moderatorId: string): Promise<StoredRoomRecord> {
    const cleanCode = code.toUpperCase().trim();
    const cleanName = name.trim();
    if (!cleanCode || cleanCode.length > 32 || !cleanName || cleanName.length > 120) throw new Error('Invalid room');
    if (!(await this.findStaffUserById(moderatorId))) throw new Error('Unknown staff user');
    if (this.useLocalDb) {
      if (this.localData.rooms.some((r) => r.code === cleanCode)) throw new Error('Room already exists');
      const now = new Date().toISOString();
      const room = { code: cleanCode, name: cleanName, isOpen: true, moderatorId, createdAt: now, updatedAt: now };
      this.localData.rooms.push(room);
      this.saveLocalStore();
      return { ...room };
    }
    const [room] = await this.ensureDb().insert(schema.rooms).values({ code: cleanCode, name: cleanName, moderatorId }).onConflictDoNothing().returning();
    if (!room) throw new Error('Room already exists');
    return { ...room, createdAt: room.createdAt.toISOString(), updatedAt: room.updatedAt.toISOString() };
  }

  public async setRoomStatus(code: string, isOpen: boolean): Promise<boolean> {
    const cleanCode = (code || 'MDX26').toUpperCase().trim();
    const nowIso = new Date().toISOString();

    if (this.useLocalDb) {
      const idx = this.localData.rooms.findIndex((r) => r.code === cleanCode);
      if (idx !== -1) {
        this.localData.rooms[idx].isOpen = isOpen;
        this.localData.rooms[idx].updatedAt = nowIso;
        this.saveLocalStore();
        return true;
      }
      return false;
    }

    const db = this.ensureDb();
    const changed = await db
      .update(schema.rooms)
      .set({
        isOpen,
        updatedAt: new Date(),
      })
      .where(eq(schema.rooms.code, cleanCode)).returning({ code: schema.rooms.code });
    return changed.length > 0;
  }

  public async getStaffUsers(): Promise<StaffUser[]> {
    if (this.useLocalDb) return this.localData.staffUsers.map(publicStaff);
    return (await this.ensureDb().select().from(schema.staffUsers)).map((r) => publicStaff({ ...r, createdAt: r.createdAt.toISOString() }));
  }

  public async findStaffUserByEmail(email: string): Promise<StoredStaffUser | null> {
    const normalized = email.trim().toLowerCase();
    if (this.useLocalDb) {
      const user = this.localData.staffUsers.find((u) => u.email === normalized);
      return user ? { ...user } : null;
    }
    const [row] = await this.ensureDb().select().from(schema.staffUsers).where(eq(schema.staffUsers.email, normalized)).limit(1);
    return row ? { ...row, createdAt: row.createdAt.toISOString() } : null;
  }

  public async findStaffUserById(id: string): Promise<StoredStaffUser | null> {
    if (this.useLocalDb) {
      const user = this.localData.staffUsers.find((u) => u.id === id);
      return user ? { ...user } : null;
    }
    const [row] = await this.ensureDb().select().from(schema.staffUsers).where(eq(schema.staffUsers.id, id)).limit(1);
    return row ? { ...row, createdAt: row.createdAt.toISOString() } : null;
  }

  public async createStaffUser(params: Omit<StoredStaffUser, 'id' | 'createdAt'>): Promise<StaffUser> {
    const values = { ...params, email: params.email.trim().toLowerCase(), name: params.name.trim() };
    if (!values.email || values.email.length > 254 || !values.name || values.name.length > 120 || !values.passwordHash || !['admin', 'moderator'].includes(values.role)) throw new Error('Invalid staff user');
    if (this.useLocalDb) {
      if (this.localData.staffUsers.some((u) => u.email === values.email)) throw new Error('Staff email already exists');
      const user = { ...values, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      this.localData.staffUsers.push(user);
      this.saveLocalStore();
      return publicStaff(user);
    }
    const [row] = await this.ensureDb().insert(schema.staffUsers).values(values).returning();
    return publicStaff({ ...row, createdAt: row.createdAt.toISOString() });
  }

  public async updateStaffPassword(userId: string, passwordHash: string, expectedPasswordHash?: string): Promise<boolean> {
    if (!passwordHash) throw new Error('Password hash is required');
    if (this.useLocalDb) {
      const user = this.localData.staffUsers.find((u) => u.id === userId);
      if (!user) throw new Error('Unknown staff user');
      if (expectedPasswordHash !== undefined && user.passwordHash !== expectedPasswordHash) return false;
      user.passwordHash = passwordHash;
      user.mustChangePassword = false;
      this.localData.staffSessions = this.localData.staffSessions.filter((s) => s.userId !== userId);
      this.saveLocalStore();
      return true;
    }
    return this.ensureDb().transaction(async (tx) => {
      const [user] = await tx.select().from(schema.staffUsers).where(eq(schema.staffUsers.id, userId)).for('update');
      if (!user) throw new Error('Unknown staff user');
      if (expectedPasswordHash !== undefined && user.passwordHash !== expectedPasswordHash) return false;
      const rows = await tx.update(schema.staffUsers).set({ passwordHash, mustChangePassword: false }).where(eq(schema.staffUsers.id, userId)).returning({ id: schema.staffUsers.id });
      if (!rows.length) throw new Error('Unknown staff user');
      await tx.delete(schema.staffSessions).where(eq(schema.staffSessions.userId, userId));
      return true;
    });
  }

  public async createStaffSession(params: { tokenHash: string; userId: string; expiresAt: string; expectedPasswordHash?: string }): Promise<boolean> {
    if (!params.tokenHash || !Number.isFinite(Date.parse(params.expiresAt))) throw new Error('Invalid session');
    if (this.useLocalDb) {
      const user = this.localData.staffUsers.find((u) => u.id === params.userId);
      if (!user) throw new Error('Unknown staff user');
      if (params.expectedPasswordHash !== undefined && user.passwordHash !== params.expectedPasswordHash) return false;
      if (this.localData.staffSessions.some((s) => s.tokenHash === params.tokenHash)) throw new Error('Session already exists');
      this.localData.staffSessions = this.localData.staffSessions.filter((s) => Date.parse(s.expiresAt) > Date.now());
      this.localData.staffSessions.push({ tokenHash: params.tokenHash, userId: params.userId, expiresAt: params.expiresAt });
      this.saveLocalStore();
      return true;
    }
    return this.ensureDb().transaction(async (tx) => {
      const [user] = await tx.select().from(schema.staffUsers).where(eq(schema.staffUsers.id, params.userId)).for('update');
      if (!user) throw new Error('Unknown staff user');
      if (params.expectedPasswordHash !== undefined && user.passwordHash !== params.expectedPasswordHash) return false;
      await tx.delete(schema.staffSessions).where(sql`${schema.staffSessions.expiresAt} <= NOW()`);
      await tx.insert(schema.staffSessions).values({ tokenHash: params.tokenHash, userId: params.userId, expiresAt: new Date(params.expiresAt) });
      return true;
    });
  }

  public async getStaffSession(tokenHash: string): Promise<StaffUser | null> {
    if (this.useLocalDb) {
      const session = this.localData.staffSessions.find((s) => s.tokenHash === tokenHash && Date.parse(s.expiresAt) > Date.now());
      const user = session && this.localData.staffUsers.find((u) => u.id === session.userId);
      return user ? publicStaff(user) : null;
    }
    const [row] = await this.ensureDb().select({ user: schema.staffUsers }).from(schema.staffSessions)
      .innerJoin(schema.staffUsers, eq(schema.staffSessions.userId, schema.staffUsers.id))
      .where(and(eq(schema.staffSessions.tokenHash, tokenHash), sql`${schema.staffSessions.expiresAt} > NOW()`)).limit(1);
    return row ? publicStaff({ ...row.user, createdAt: row.user.createdAt.toISOString() }) : null;
  }

  public async deleteStaffSession(tokenHash: string): Promise<void> {
    if (this.useLocalDb) {
      this.localData.staffSessions = this.localData.staffSessions.filter((s) => s.tokenHash !== tokenHash);
      this.saveLocalStore();
      return;
    }
    await this.ensureDb().delete(schema.staffSessions).where(eq(schema.staffSessions.tokenHash, tokenHash));
  }

  public async consumeAuthAttempt(key: string, limit: number, windowMs: number): Promise<boolean> {
    if (!key || !Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowMs) || windowMs < 1) throw new Error('Invalid rate limit');
    if (this.useLocalDb) {
      const now = Date.now();
      this.localData.authAttempts = this.localData.authAttempts.filter((a) => Date.parse(a.expiresAt) > now);
      let attempt = this.localData.authAttempts.find((a) => a.key === key);
      if (!attempt) {
        attempt = { key, attempts: 0, expiresAt: new Date(now + windowMs).toISOString() };
        this.localData.authAttempts.push(attempt);
      }
      attempt.attempts = Math.min(attempt.attempts + 1, limit + 1);
      this.saveLocalStore();
      return attempt.attempts <= limit;
    }
    const result = await this.ensureDb().execute(sql`
      INSERT INTO auth_attempts (key, attempts, expires_at)
      VALUES (${key}, 1, NOW() + ${windowMs} * INTERVAL '1 millisecond')
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN auth_attempts.expires_at <= NOW() THEN 1 ELSE LEAST(auth_attempts.attempts + 1, ${limit + 1}) END,
        expires_at = CASE WHEN auth_attempts.expires_at <= NOW() THEN NOW() + ${windowMs} * INTERVAL '1 millisecond' ELSE auth_attempts.expires_at END
      RETURNING attempts
    `);
    return Number(result.rows[0].attempts) <= limit;
  }

  public async setRoomModerator(code: string, userId: string | null): Promise<boolean> {
    if (userId && !(await this.findStaffUserById(userId))) throw new Error('Unknown staff user');
    const roomCode = code.toUpperCase().trim();
    if (this.useLocalDb) {
      const room = this.localData.rooms.find((r) => r.code === roomCode);
      if (!room) return false;
      room.moderatorId = userId;
      room.updatedAt = new Date().toISOString();
      this.saveLocalStore();
      return true;
    }
    const rows = await this.ensureDb().update(schema.rooms).set({ moderatorId: userId, updatedAt: new Date() }).where(eq(schema.rooms.code, roomCode)).returning({ code: schema.rooms.code });
    return rows.length > 0;
  }

  public async assignUnownedRooms(userId: string): Promise<void> {
    if (!(await this.findStaffUserById(userId))) throw new Error('Unknown staff user');
    if (this.useLocalDb) {
      for (const room of this.localData.rooms) if (!room.moderatorId) room.moderatorId = userId;
      this.saveLocalStore();
      return;
    }
    await this.ensureDb().update(schema.rooms).set({ moderatorId: userId, updatedAt: new Date() }).where(sql`${schema.rooms.moderatorId} IS NULL`);
  }

  public async getGlobalStats(): Promise<{
    totalPlayers: number;
    totalMatches: number;
    highestScoreEver: number;
    totalRooms: number;
    topPWR: Array<{
      nickname: string;
      avatar: string;
      powerScore: number;
      tier: string;
      highScore: number;
      roomCode: string;
    }>;
  }> {
    let allPlayers: PlayerProfile[] = [];
    let totalMatches = 0;
    let totalRooms = 1;

    if (this.useLocalDb) {
      allPlayers = this.localData.players
        .filter((p) => !p.isBot && !p.deviceId.startsWith('seed-') && !p.deviceId.startsWith('bot-'))
        .map((p) => ({
          ...p,
          powerScore: calculatePlayerPowerScore(p),
          powerTier: getPlayerPowerTier(p),
        }));
      totalMatches = this.localData.matches.length;
      totalRooms = this.localData.rooms.length;
    } else {
      const db = this.ensureDb();
      const pRows = await db
        .select()
        .from(schema.players)
        .where(
          and(
            eq(schema.players.isBot, false),
            sql`device_id NOT LIKE 'seed-%'`,
            sql`device_id NOT LIKE 'bot-%'`
          )
        );

      allPlayers = pRows.map((p) => {
        const raw: PlayerProfile = {
          id: p.id,
          deviceId: p.deviceId,
          nickname: p.nickname,
          avatar: p.avatar as AvatarId,
          highScore: p.highScore,
          totalScore: p.totalScore,
          matchesPlayed: p.matchesPlayed,
          winsCount: p.winsCount,
          isBot: p.isBot,
          roomCode: p.roomCode,
        };
        const powerScore = calculatePlayerPowerScore(raw);
        return {
          ...raw,
          powerScore,
          powerTier: getPlayerPowerTier(raw),
        };
      });

      const mCount = await db.select({ count: sql<number>`count(*)` }).from(schema.matches);
      totalMatches = Number(mCount[0]?.count || 0);

      const rCount = await db.select({ count: sql<number>`count(*)` }).from(schema.rooms);
      totalRooms = Number(rCount[0]?.count || 1);
    }

    const highestScoreEver = allPlayers.reduce(
      (max, p) => (p.highScore > max ? p.highScore : max),
      0
    );

    const sortedByPWR = [...allPlayers].sort((a, b) => {
      const pwrA = calculatePlayerPowerScore(a);
      const pwrB = calculatePlayerPowerScore(b);
      if (pwrB !== pwrA) return pwrB - pwrA;
      return b.highScore - a.highScore;
    });

    const topPWR = sortedByPWR.slice(0, 3).map((p) => ({
      nickname: p.nickname,
      avatar: p.avatar,
      powerScore: calculatePlayerPowerScore(p),
      tier: getPlayerPowerTier(p).title,
      highScore: p.highScore,
      roomCode: p.roomCode || 'MDX26',
    }));

    return {
      totalPlayers: allPlayers.length,
      totalMatches,
      highestScoreEver,
      totalRooms,
      topPWR,
    };
  }
}

export const database = new AppDatabase();
