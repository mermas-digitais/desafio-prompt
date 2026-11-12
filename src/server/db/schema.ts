import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomCode: varchar('room_code', { length: 32 }).notNull().default('MDX26'),
  deviceId: varchar('device_id', { length: 128 }).unique().notNull(),
  nickname: varchar('nickname', { length: 40 }).notNull(),
  avatar: text('avatar').notNull().default('menina-mdx'),
  highScore: integer('high_score').notNull().default(0),
  totalScore: integer('total_score').notNull().default(0),
  matchesPlayed: integer('matches_played').notNull().default(0),
  winsCount: integer('wins_count').notNull().default(0),
  isBot: boolean('is_bot').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
  roomCode: varchar('room_code', { length: 16 }).notNull(),
  challengeId: varchar('challenge_id', { length: 64 }).notNull(),
  winnerPlayerId: uuid('winner_player_id'),
  resultsJson: text('results_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rooms = pgTable('rooms', {
  code: varchar('code', { length: 32 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  isOpen: boolean('is_open').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PlayerRow = typeof players.$inferSelect;
export type NewPlayerRow = typeof players.$inferInsert;
export type ChallengeRow = typeof challenges.$inferSelect;
export type NewChallengeRow = typeof challenges.$inferInsert;
export type MatchRow = typeof matches.$inferSelect;
export type NewMatchRow = typeof matches.$inferInsert;
export type RoomRow = typeof rooms.$inferSelect;
export type NewRoomRow = typeof rooms.$inferInsert;
