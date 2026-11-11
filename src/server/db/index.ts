import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq, sql } from 'drizzle-orm';
import * as schema from './schema.js';
import { OFFICIAL_CHALLENGES, type ChallengeSeedData } from './challengesData.js';
import type {
  AvatarId,
  LeaderboardEntry,
  LeaderboardsPayload,
  PlayerProfile,
} from '../../shared/types.js';

const { Pool, Client } = pg;

export interface StoredMatchRecord {
  id: string;
  roomCode: string;
  challengeId: string;
  winnerPlayerId: string | null;
  resultsJson: string;
  createdAt: string;
}

const LEGACY_LOCAL_DB_FILE = path.resolve(process.cwd(), '.data', 'local-db.json');

class PostgresDatabase {
  private pool: pg.Pool | null = null;
  private db: NodePgDatabase<typeof schema> | null = null;
  private connected = false;
  private pgVersion = 'PostgreSQL 18';

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
        connectionTimeoutMillis: 5000,
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
    const dbUrl = (process.env.DATABASE_URL || '').trim();
    if (!dbUrl) {
      throw new Error(
        '❌ [DB] DATABASE_URL não está definida no arquivo .env! Configure a URL do seu PostgreSQL 18.'
      );
    }

    await this.ensureDatabaseExists(dbUrl);

    this.pool = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 6000,
      max: 15,
    });

    const client = await this.pool.connect();
    try {
      const versionRes = await client.query('SHOW server_version;');
      const rawVersion = versionRes.rows?.[0]?.server_version || '18';
      this.pgVersion = `PostgreSQL ${rawVersion}`;

      await client.query(`
        CREATE TABLE IF NOT EXISTS players (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          device_id VARCHAR(128) UNIQUE NOT NULL,
          nickname VARCHAR(40) NOT NULL,
          avatar TEXT NOT NULL DEFAULT 'menina-mdx',
          high_score INTEGER NOT NULL DEFAULT 0,
          total_score INTEGER NOT NULL DEFAULT 0,
          matches_played INTEGER NOT NULL DEFAULT 0,
          wins_count INTEGER NOT NULL DEFAULT 0,
          is_bot BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        ALTER TABLE players ALTER COLUMN avatar TYPE TEXT;

        CREATE INDEX IF NOT EXISTS idx_players_high_score ON players (high_score DESC);
        CREATE INDEX IF NOT EXISTS idx_players_wins_count ON players (wins_count DESC);
        CREATE INDEX IF NOT EXISTS idx_players_is_bot ON players (is_bot);

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
          room_code VARCHAR(16) NOT NULL,
          challenge_id VARCHAR(64) NOT NULL,
          winner_player_id UUID,
          results_json TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    } finally {
      client.release();
    }

    this.db = drizzle(this.pool, { schema });
    this.connected = true;
    console.log(`✅ [DB] Conectado oficialmente ao ${this.pgVersion} via Drizzle ORM (Sem JSON local).`);

    await this.migrateAndRemoveLegacyLocalJson();
    await this.seedPostgresIfNeeded();
  }

  public isPostgresActive(): boolean {
    return this.connected;
  }

  public getDatabaseVersion(): string {
    return this.pgVersion;
  }

  /**
   * Se existir um arquivo legado .data/local-db.json de sessões anteriores,
   * migra jogadoras humanas para o PostgreSQL 18 e apaga o arquivo local definitivamente.
   */
  private async migrateAndRemoveLegacyLocalJson(): Promise<void> {
    if (!this.db || !fs.existsSync(LEGACY_LOCAL_DB_FILE)) return;

    try {
      const raw = fs.readFileSync(LEGACY_LOCAL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as {
        players?: Array<PlayerProfile>;
      };

      if (Array.isArray(parsed.players)) {
        for (const p of parsed.players) {
          if (
            !p.deviceId ||
            p.isBot ||
            p.deviceId.startsWith('seed-') ||
            p.deviceId.startsWith('bot-')
          ) {
            continue;
          }
          const existing = await this.findPlayerByDeviceId(p.deviceId);
          if (!existing) {
            await this.db.insert(schema.players).values({
              deviceId: p.deviceId,
              nickname: p.nickname || 'Jogadora MDX',
              avatar: p.avatar || 'menina-mdx',
              highScore: Number(p.highScore || 0),
              totalScore: Number(p.totalScore || 0),
              matchesPlayed: Number(p.matchesPlayed || 0),
              winsCount: Number(p.winsCount || 0),
              isBot: false,
            });
          }
        }
      }

      fs.unlinkSync(LEGACY_LOCAL_DB_FILE);
      console.log('🧹 [DB] Arquivo legado .data/local-db.json migrado e removido (100% PostgreSQL 18).');
    } catch {
      // Ignora caso já tenha sido removido
    }
  }

  public async seedPostgresIfNeeded(): Promise<void> {
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

  public async clearAllRankings(): Promise<void> {
    const db = this.ensureDb();
    await db.execute(sql`DELETE FROM matches`);
    await db.execute(
      sql`UPDATE players SET high_score = 0, total_score = 0, matches_played = 0, wins_count = 0, updated_at = NOW()`
    );
    await db.execute(
      sql`DELETE FROM players WHERE is_bot = true OR device_id LIKE 'seed-%' OR device_id LIKE 'bot-%'`
    );
  }

  public async deletePlayerById(playerId: string): Promise<boolean> {
    const db = this.ensureDb();
    const deleted = await db
      .delete(schema.players)
      .where(eq(schema.players.id, playerId))
      .returning({ id: schema.players.id });
    return deleted.length > 0;
  }

  public async getAllPlayersForAdmin(): Promise<
    Array<{
      id: string;
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
    const db = this.ensureDb();
    const rows = await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.isBot, false))
      .orderBy(desc(schema.players.highScore), desc(schema.players.winsCount));

    return rows.map((r) => ({
      id: r.id,
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

  public async findPlayerByDeviceId(deviceId: string): Promise<PlayerProfile | null> {
    const db = this.ensureDb();
    const rows = await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.deviceId, deviceId))
      .limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
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
  }): Promise<PlayerProfile> {
    const db = this.ensureDb();
    const now = new Date();
    const existing = await this.findPlayerByDeviceId(params.deviceId);
    if (existing) {
      const [updated] = await db
        .update(schema.players)
        .set({
          nickname: params.nickname,
          avatar: params.avatar,
          updatedAt: now,
        })
        .where(eq(schema.players.deviceId, params.deviceId))
        .returning();
      return {
        id: updated.id,
        deviceId: updated.deviceId,
        nickname: updated.nickname,
        avatar: updated.avatar as AvatarId,
        highScore: updated.highScore,
        totalScore: updated.totalScore,
        matchesPlayed: updated.matchesPlayed,
        winsCount: updated.winsCount,
        isBot: updated.isBot,
      };
    }

    const [inserted] = await db
      .insert(schema.players)
      .values({
        deviceId: params.deviceId,
        nickname: params.nickname,
        avatar: params.avatar,
        isBot: params.isBot ?? false,
      })
      .returning();

    return {
      id: inserted.id,
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
    roundScore: number;
    isWinner: boolean;
  }): Promise<{ newHighScore: boolean; updatedProfile: PlayerProfile | null }> {
    const db = this.ensureDb();
    const now = new Date();
    const existing = await this.findPlayerByDeviceId(params.deviceId);
    if (!existing) return { newHighScore: false, updatedProfile: null };

    const isNewHigh = params.roundScore > existing.highScore;
    const nextHighScore = isNewHigh ? params.roundScore : existing.highScore;
    const nextTotalScore = existing.totalScore + params.roundScore;
    const nextMatches = existing.matchesPlayed + 1;
    const nextWins = existing.winsCount + (params.isWinner ? 1 : 0);

    const [updated] = await db
      .update(schema.players)
      .set({
        highScore: nextHighScore,
        totalScore: nextTotalScore,
        matchesPlayed: nextMatches,
        winsCount: nextWins,
        updatedAt: now,
      })
      .where(eq(schema.players.deviceId, params.deviceId))
      .returning();

    return {
      newHighScore: isNewHigh,
      updatedProfile: {
        id: updated.id,
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
  }

  public async recordMatch(params: {
    roomCode: string;
    challengeId: string;
    winnerPlayerId: string | null;
    results: unknown;
  }): Promise<void> {
    const db = this.ensureDb();
    const resultsJson = JSON.stringify(params.results);
    const isUuid =
      params.winnerPlayerId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        params.winnerPlayerId
      );
    await db.insert(schema.matches).values({
      roomCode: params.roomCode,
      challengeId: params.challengeId,
      winnerPlayerId: isUuid ? params.winnerPlayerId : null,
      resultsJson,
    });
  }

  public async getChallenges(): Promise<ChallengeSeedData[]> {
    return OFFICIAL_CHALLENGES;
  }

  public async getLeaderboards(limit = 100): Promise<LeaderboardsPayload> {
    const db = this.ensureDb();
    const rows = await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.isBot, false));

    const rawPlayers = rows.map((r) => ({
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

    const matchCountRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.matches);
    const totalMatchesCount = matchCountRes[0]?.count ?? 0;

    // Filtra jogadoras que tenham pelo menos 1 partida ou score > 0 para o ranking
    const activePlayers = rawPlayers.filter((p) => p.matchesPlayed > 0 || p.highScore > 0);

    const toEntries = (list: typeof activePlayers): LeaderboardEntry[] =>
      list.slice(0, limit).map((p, idx) => ({
        rank: idx + 1,
        playerId: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        highScore: p.highScore,
        winsCount: p.winsCount,
        matchesPlayed: p.matchesPlayed,
        totalScore: p.totalScore,
        updatedAt: p.updatedAt,
      }));

    // 1. General: highScore + (winsCount * 150) + (matchesPlayed * 20)
    const generalSorted = [...activePlayers].sort((a, b) => {
      const scoreA = a.highScore + a.winsCount * 150 + a.matchesPlayed * 20;
      const scoreB = b.highScore + b.winsCount * 150 + b.matchesPlayed * 20;
      if (scoreB !== scoreA) return scoreB - scoreA;
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

    const impliedMatches = Math.max(
      totalMatchesCount,
      Math.ceil(activePlayers.reduce((acc, p) => acc + p.matchesPlayed, 0) / 3)
    );

    return {
      general: toEntries(generalSorted),
      points: toEntries(pointsSorted),
      wins: toEntries(winsSorted),
      stats: {
        totalPlayers: activePlayers.length,
        totalMatches: impliedMatches,
        highestScoreEver,
      },
    };
  }
}

export const database = new PostgresDatabase();
