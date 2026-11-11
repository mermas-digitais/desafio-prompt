import { create } from 'zustand';
import { getOrCreateDeviceId } from './useGameStore';
import type { AvatarId, ExpiredRoundSummary, PlayerProfile, RankingTab } from '../../shared/types';

function getStoredNickname(): string {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('mdx26_nickname') || '';
  }
  return '';
}

function getStoredAvatar(): AvatarId {
  if (typeof window !== 'undefined') {
    return (window.localStorage.getItem('mdx26_avatar') as AvatarId) || 'menina-mdx';
  }
  return 'menina-mdx';
}

interface PlayerSessionState {
  deviceId: string;
  profile: PlayerProfile | null;
  nickname: string;
  selectedAvatar: AvatarId;
  isEditingProfile: boolean;
  errorMsg: string | null;
  suggestions: string[];
  isSubmittingJoin: boolean;
  promptText: string;
  isLocallyUnlocked: boolean;
  isZoomOpen: boolean;
  isRankingModalOpen: boolean;
  mobileRankingTab: RankingTab;
  isExpiredQr: boolean;
  expiredRoundData: ExpiredRoundSummary | null;
  setProfile: (profile: PlayerProfile | null) => void;
  setNickname: (nickname: string) => void;
  setSelectedAvatar: (avatar: AvatarId) => void;
  setIsEditingProfile: (editing: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
  setSuggestions: (suggestions: string[]) => void;
  setIsSubmittingJoin: (submitting: boolean) => void;
  setPromptText: (text: string) => void;
  setIsLocallyUnlocked: (unlocked: boolean) => void;
  setIsZoomOpen: (open: boolean) => void;
  setIsRankingModalOpen: (open: boolean) => void;
  setMobileRankingTab: (tab: RankingTab) => void;
  setIsExpiredQr: (isExpired: boolean) => void;
  setExpiredRoundData: (data: ExpiredRoundSummary | null) => void;
  syncFromServerProfile: (profile: PlayerProfile) => void;
  resetRoundDraft: () => void;
}

export const usePlayerSessionStore = create<PlayerSessionState>((set) => ({
  deviceId: getOrCreateDeviceId(),
  profile: null,
  nickname: getStoredNickname(),
  selectedAvatar: getStoredAvatar(),
  isEditingProfile: false,
  errorMsg: null,
  suggestions: [],
  isSubmittingJoin: false,
  promptText: '',
  isLocallyUnlocked: false,
  isZoomOpen: false,
  isRankingModalOpen: false,
  mobileRankingTab: 'general',
  isExpiredQr: false,
  expiredRoundData: null,

  setProfile: (profile) => set({ profile }),
  setNickname: (nickname) => set({ nickname }),
  setSelectedAvatar: (selectedAvatar) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mdx26_avatar', selectedAvatar);
    }
    set({ selectedAvatar });
  },
  setIsEditingProfile: (isEditingProfile) => set({ isEditingProfile }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsSubmittingJoin: (isSubmittingJoin) => set({ isSubmittingJoin }),
  setPromptText: (promptText) => set({ promptText }),
  setIsLocallyUnlocked: (isLocallyUnlocked) => set({ isLocallyUnlocked }),
  setIsZoomOpen: (isZoomOpen) => set({ isZoomOpen }),
  setIsRankingModalOpen: (isRankingModalOpen) => set({ isRankingModalOpen }),
  setMobileRankingTab: (mobileRankingTab) => set({ mobileRankingTab }),
  setIsExpiredQr: (isExpiredQr) => set({ isExpiredQr }),
  setExpiredRoundData: (expiredRoundData) => set({ expiredRoundData }),

  syncFromServerProfile: (profile) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mdx26_nickname', profile.nickname);
      window.localStorage.setItem('mdx26_avatar', profile.avatar);
    }
    set({
      profile,
      nickname: profile.nickname,
      selectedAvatar: profile.avatar,
    });
  },

  resetRoundDraft: () =>
    set({
      promptText: '',
      isLocallyUnlocked: false,
    }),
}));
