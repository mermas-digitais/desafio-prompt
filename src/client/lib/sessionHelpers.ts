import type { GameRoomState, PlayerProfile } from '../../shared/types';

export function isRequestedRoom(state: GameRoomState | null | undefined, requestedRoomCode: string): state is GameRoomState {
  return Boolean(state?.phase && state.roomCode === requestedRoomCode);
}

export function selectOwnPlayer(state: GameRoomState, profile: PlayerProfile | null) {
  return profile ? state.players.find((player) => player.id === profile.id) : undefined;
}

export function selectOwnEvaluation(state: Pick<GameRoomState, 'evaluations'>, profile: PlayerProfile | null) {
  return profile ? state.evaluations.find((evaluation) => evaluation.playerId === profile.id) : undefined;
}

export function personalHistoryKey(roomCode: string, profileId: string) {
  return `mdx26_personal_match_history_v2_${JSON.stringify([roomCode, profileId])}`;
}
