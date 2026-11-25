export interface RadioTrack {
  uri: string;
  title: string;
  artist: string;
}
export interface RadioPlaylist {
  url: string;
  title: string;
  coverUrl: string;
  tracks: RadioTrack[];
}
export interface RadioMedia {
  videoId: string;
  durationSec: number;
}
export interface RadioState {
  epoch: string;
  revision: number;
  serverNow: number;
  status: 'loading' | 'playing' | 'unavailable';
  playlistUrl: string;
  playlistTitle: string;
  coverUrl: string;
  track: (RadioTrack & RadioMedia) | null;
  startedAt: number;
  error: string | null;
}

export function radioPosition(state: RadioState, serverNow: number): number {
  if (!state.track || state.status !== 'playing') return 0;
  return Math.max(0, Math.min(state.track.durationSec, (serverNow - state.startedAt) / 1000));
}
