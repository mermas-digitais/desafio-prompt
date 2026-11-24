import type { GamePhase, StaffUser } from '../../shared/types';

export type TVMode = 'watch' | 'control';
export function parseTVMode(value: unknown): TVMode { return value === 'control' ? 'control' : 'watch'; }
export function canControlSession(mode: unknown, user: Pick<StaffUser, 'mustChangePassword'> | null): boolean {
  return parseTVMode(mode) === 'control' && Boolean(user && !user.mustChangePassword);
}

// Login returns only to a specific TV control route, never an arbitrary URL.
export function safeControlReturnTo(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try {
    const url = new URL(value, 'https://local.invalid');
    const room = url.searchParams.get('room'), session = url.searchParams.get('session');
    if (url.origin !== 'https://local.invalid' || url.pathname !== '/tv' || url.searchParams.get('mode') !== 'control' || !room || !/^[A-Z0-9_-]{1,12}$/.test(room) || !session || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session)) return;
    return `/tv?${new URLSearchParams({ room, session, mode: 'control' })}`;
  } catch { return; }
}

export const sessionPhaseLabel: Record<GamePhase, string> = {
  IDLE: 'Aguardando participantes', LOBBY: 'Preparando partida', COUNTDOWN: 'Começando',
  PLAYING: 'Partida em andamento', EVALUATING: 'Avaliando prompts', REVEALING: 'Resultados', PODIUM: 'Pódio',
};
