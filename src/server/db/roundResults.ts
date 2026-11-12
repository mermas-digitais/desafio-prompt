import { z } from 'zod';
import type { PlayerRoundEvaluation } from '../../shared/types.js';

// Strip unknown fields so durable results never expose private profile/session data.
const evaluationsSchema: z.ZodType<PlayerRoundEvaluation[]> = z.array(z.object({
  playerId: z.string(),
  nickname: z.string(),
  avatar: z.string(),
  slot: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  isBot: z.boolean(),
  submittedPrompt: z.string(),
  lockedAtRemainingSeconds: z.number().finite(),
  subjectScore: z.number().finite(),
  styleScore: z.number().finite(),
  detailsScore: z.number().finite(),
  speedBonus: z.number().finite(),
  totalScore: z.number().finite(),
  similarityPercent: z.number().finite(),
  intentMatched: z.array(z.string()),
  intentMissed: z.array(z.string()),
  aiFeedback: z.string(),
  evaluatorUsed: z.enum(['openai', 'groq', 'local']),
  isWinner: z.boolean(),
  isNewHighScore: z.boolean(),
  roundAchievements: z.array(z.string()).optional(),
  leveledUpTitle: z.boolean().optional(),
  previousTitle: z.string().optional(),
  newTitle: z.string().optional(),
  newPowerLevel: z.number().finite().optional(),
  newFrameId: z.string().optional(),
}));

export function parseRoundEvaluations(value: unknown): PlayerRoundEvaluation[] | null {
  const result = evaluationsSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseStoredRoundEvaluations(json: string): PlayerRoundEvaluation[] | null {
  try {
    return parseRoundEvaluations(JSON.parse(json));
  } catch {
    return null;
  }
}
