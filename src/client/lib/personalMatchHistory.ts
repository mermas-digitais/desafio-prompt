import type { PlayerRoundEvaluation } from '../../shared/types';
import type { ShareCardData } from './shareCardRenderer';

export interface SavedPersonalMatch {
  id: string; // ex: "match-1731289123000"
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

const STORAGE_PREFIX = 'mdx26_personal_match_history_';
const MAX_HISTORY_ITEMS = 20;

export function getPersonalMatchHistory(deviceId: string): SavedPersonalMatch[] {
  if (typeof window === 'undefined' || !deviceId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${deviceId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePersonalMatch(deviceId: string, match: SavedPersonalMatch): void {
  if (typeof window === 'undefined' || !deviceId || !match) return;
  try {
    const existing = getPersonalMatchHistory(deviceId);
    // Evita duplicar a mesma partida se já tiver salvo
    const filtered = existing.filter((m) => m.id !== match.id);
    const updated = [match, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(`${STORAGE_PREFIX}${deviceId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('⚠️ [PersonalMatchHistory] Não foi possível salvar partida no localStorage:', err);
  }
}

export function clearPersonalMatchHistory(deviceId: string): void {
  if (typeof window === 'undefined' || !deviceId) return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${deviceId}`);
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
