import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
  uniqueIndex,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomCode: varchar('room_code', { length: 32 }).notNull().default('MDX26'),
  deviceId: varchar('device_id', { length: 128 }).notNull(),
  nickname: varchar('nickname', { length: 40 }).notNull(),
  avatar: text('avatar').notNull().default('menina-mdx'),
  highScore: integer('high_score').notNull().default(0),
  totalScore: integer('total_score').notNull().default(0),
  matchesPlayed: integer('matches_played').notNull().default(0),
  winsCount: integer('wins_count').notNull().default(0),
  isBot: boolean('is_bot').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [uniqueIndex('players_room_device_unique').on(table.roomCode, table.deviceId)]);

export const challenges = pgTable('challenges', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 120 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  difficulty: varchar('difficulty', { length: 24 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  fullPrompt: text('full_prompt').notNull(),
  subjectLayer: text('subject_layer').notNull(),
  styleLayer: text('style_layer').notNull(),
  environmentLayer: text('environment_layer').notNull(),
  hint1: text('hint_1').notNull(),
  hint2: text('hint_2').notNull(),
  keywordsJson: text('keywords_json').notNull(),
});

export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomCode: varchar('room_code', { length: 32 }).notNull(),
  challengeId: varchar('challenge_id', { length: 64 }).notNull(),
  roundId: text('round_id'),
  roundToken: text('round_token'),
  winnerPlayerId: uuid('winner_player_id'),
  resultsJson: text('results_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_matches_room_code').on(table.roomCode),
  uniqueIndex('matches_room_round_token_unique').on(table.roomCode, table.roundToken).where(sql`${table.roundToken} IS NOT NULL`),
]);

export const staffUsers = pgTable('staff_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  role: text('role').$type<'admin' | 'moderator'>().notNull(),
  passwordHash: text('password_hash').notNull(),
  mustChangePassword: boolean('must_change_password').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [check('staff_users_role_check', sql`${table.role} IN ('admin', 'moderator')`)]);

export const staffSessions = pgTable('staff_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: uuid('user_id').notNull().references(() => staffUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => [index('idx_staff_sessions_user').on(table.userId), index('idx_staff_sessions_expiry').on(table.expiresAt)]);

export const authAttempts = pgTable('auth_attempts', {
  key: text('key').primaryKey(),
  attempts: integer('attempts').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => [index('idx_auth_attempts_expiry').on(table.expiresAt)]);

export const rooms = pgTable('rooms', {
  code: varchar('code', { length: 32 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  isOpen: boolean('is_open').notNull().default(true),
  moderatorId: uuid('moderator_id').references(() => staffUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [index('idx_rooms_moderator').on(table.moderatorId)]);

export type PlayerRow = typeof players.$inferSelect;
export type NewPlayerRow = typeof players.$inferInsert;
export type ChallengeRow = typeof challenges.$inferSelect;
export type NewChallengeRow = typeof challenges.$inferInsert;
export type MatchRow = typeof matches.$inferSelect;
export type NewMatchRow = typeof matches.$inferInsert;
export type RoomRow = typeof rooms.$inferSelect;
export type NewRoomRow = typeof rooms.$inferInsert;
