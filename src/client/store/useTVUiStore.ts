import { create } from 'zustand';
import { soundEngine } from '../lib/soundEngine';
import { getInitialDevLanIp } from '../helpers/networkHelpers';
import type { RankingTab } from '../../shared/types';

interface NetConfigState {
  lanIp: string;
  publicAppUrl: string;
}

interface TVUiStoreState {
  activeTab: RankingTab;
  lastManualTabClick: number;
  isMuted: boolean;
  liveLockToast: string | null;
  hintUnlockBanner: string | null;
  netConfig: NetConfigState;
  selectTab: (tab: RankingTab) => void;
  cycleNextTabIfIdle: () => void;
  toggleMute: () => void;
  setLiveLockToast: (msg: string | null) => void;
  setHintUnlockBanner: (msg: string | null) => void;
  updateNetConfig: (partial: Partial<NetConfigState>) => void;
}

export const useTVUiStore = create<TVUiStoreState>((set, get) => ({
  activeTab: 'general',
  lastManualTabClick: 0,
  isMuted: soundEngine.isMuted(),
  liveLockToast: null,
  hintUnlockBanner: null,
  netConfig: {
    lanIp: getInitialDevLanIp(),
    publicAppUrl: '',
  },

  selectTab: (tab) =>
    set({
      activeTab: tab,
      lastManualTabClick: Date.now(),
    }),

  cycleNextTabIfIdle: () => {
    const { lastManualTabClick, activeTab } = get();
    if (Date.now() - lastManualTabClick < 25000) return;
    const nextTab: RankingTab =
      activeTab === 'general' ? 'points' : activeTab === 'points' ? 'wins' : 'general';
    set({ activeTab: nextTab });
  },

  toggleMute: () => {
    const next = soundEngine.toggleMute();
    set({ isMuted: next });
  },

  setLiveLockToast: (msg) => set({ liveLockToast: msg }),

  setHintUnlockBanner: (msg) => set({ hintUnlockBanner: msg }),

  updateNetConfig: (partial) =>
    set((state) => ({
      netConfig: {
        lanIp: partial.lanIp && partial.lanIp.trim() ? partial.lanIp.trim() : state.netConfig.lanIp,
        publicAppUrl:
          typeof partial.publicAppUrl === 'string' && partial.publicAppUrl.trim()
            ? partial.publicAppUrl.trim()
            : state.netConfig.publicAppUrl,
      },
    })),
}));
