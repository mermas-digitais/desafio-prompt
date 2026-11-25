import { create } from 'zustand';
import type { RadioState } from '../../shared/radio';

export interface RadioAnchorRect {
  top: number;
  left: number;
  width: number;
  variant: 'tv-idle' | 'tv-header';
}

interface RadioStore {
  station: RadioState | null;
  clockServer: number;
  clockClient: number;
  paused: boolean;
  muted: boolean;
  playing: boolean;
  blocked: boolean;
  error: string | null;
  connectionError: string | null;
  activation: number;
  anchor: RadioAnchorRect | null;
  apply: (station: RadioState, clock?: { server: number; client: number }, newConnection?: boolean) => void;
  togglePause: () => void;
  toggleMute: () => void;
  setAnchor: (anchor: RadioAnchorRect | null) => void;
}

function savedMute(): boolean {
  try { return localStorage.getItem('mdx26_radio_muted') === 'true'; } catch { return false; }
}
export function estimatedRadioTime(): number {
  const state = useRadioStore.getState();
  return state.clockServer + performance.now() - state.clockClient;
}
export const useRadioStore = create<RadioStore>((set, get) => ({
  station: null, clockServer: 0, clockClient: 0, paused: false, muted: savedMute(), playing: false, blocked: false, error: null, connectionError: null, activation: 0, anchor: null,
  apply: (station, clock, newConnection = false) => {
    const current = get().station;
    if (current && ((current.epoch === station.epoch && current.revision > station.revision) || (current.epoch !== station.epoch && !newConnection))) return;
    set({ station, connectionError: null, ...(clock ? { clockServer: clock.server, clockClient: clock.client } : !get().clockServer ? { clockServer: station.serverNow, clockClient: performance.now() } : {}) });
  },
  togglePause: () => set((state) => ({ paused: state.blocked ? false : !state.paused, blocked: false, error: null, activation: state.activation + 1 })),
  toggleMute: () => {
    const muted = !get().muted;
    try { localStorage.setItem('mdx26_radio_muted', String(muted)); } catch { /* Local preference only. */ }
    set({ muted });
  },
  setAnchor: (anchor) => set((state) => {
    const prev = state.anchor;
    if (prev === anchor) return state;
    if (prev && anchor && prev.top === anchor.top && prev.left === anchor.left && prev.width === anchor.width && prev.variant === anchor.variant) return state;
    return { anchor };
  }),
}));
