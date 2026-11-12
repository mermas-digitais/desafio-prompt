import type { PlayerRoundEvaluation } from '../../shared/types';
import type { ShareCardData } from './shareCardRenderer';
import { personalHistoryKey } from './sessionHelpers';

export interface SavedPersonalMatch {
  id: string; // ex: "match-1731289123000"
  roomCode: string;
  roundId: string;
  timestamp: number; // Date.now()
  challenge: {
    id: string;
    title: string;
    imageUrl: string;
    fullPrompt?: string;
  };
  myEvaluation: PlayerRoundEvaluation;
  allEvaluations: PlayerRoundEvaluation[];
  myRank: number;
  totalPlayers: number;
  shareData: ShareCardData;
}

const MAX_HISTORY_ITEMS = 20;

export function getPersonalMatchHistory(roomCode: string, profileId: string): SavedPersonalMatch[] {
  if (typeof window === 'undefined' || !roomCode || !profileId) return [];
  try {
    const raw = localStorage.getItem(personalHistoryKey(roomCode, profileId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((match) => match.roomCode === roomCode && match.myEvaluation?.playerId === profileId && match.roundId);
  } catch {
    return [];
  }
}

export function savePersonalMatch(roomCode: string, profileId: string, match: SavedPersonalMatch): void {
  if (typeof window === 'undefined' || !roomCode || !profileId || !match || match.roomCode !== roomCode || match.myEvaluation.playerId !== profileId) return;
  try {
    const existing = getPersonalMatchHistory(roomCode, profileId);
    // Evita duplicar a mesma partida se já tiver salvo
    const filtered = existing.filter((m) => m.id !== match.id);
    const updated = [match, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(personalHistoryKey(roomCode, profileId), JSON.stringify(updated));
  } catch (err) {
    console.warn('⚠️ [PersonalMatchHistory] Não foi possível salvar partida no localStorage:', err);
  }
}

export function clearPersonalMatchHistory(roomCode: string, profileId: string): void {
  if (typeof window === 'undefined' || !roomCode || !profileId) return;
  try {
    localStorage.removeItem(personalHistoryKey(roomCode, profileId));
  } catch {
    // Ignora
  }
}

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Agora mesmo';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Há ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Há ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Há ${diffDays} d`;
}
