import { create } from 'zustand';
import type { StaffUser } from '../../shared/types';
import { api } from '../lib/api';
import { getSocket } from './useGameStore';

interface AuthState {
  user: StaffUser | null;
  loaded: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

function refreshSocket() {
  const socket = getSocket();
  if (socket.connected) socket.disconnect().connect();
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, loaded: false,
  refresh: async () => {
    // Retire legacy plaintext credentials, never profiles or match-history keys.
    try {
      window.localStorage.removeItem('mdx26_admin_password');
      window.sessionStorage.removeItem('mdx26_admin_session_pwd');
    } catch { /* Storage may be unavailable in private browsing. */ }
    try {
      const { user } = await api<{ user: StaffUser | null }>('/api/auth/me');
      set({ user, loaded: true });
    } catch (error) {
      set({ user: null, loaded: true });
      throw error;
    }
  },
  login: async (email, password) => {
    const { user } = await api<{ user: StaffUser }>('/api/auth/login', { email, password });
    set({ user, loaded: true });
    refreshSocket();
  },
  logout: async () => {
    await api('/api/auth/logout', {});
    set({ user: null, loaded: true });
    refreshSocket();
  },
  changePassword: async (currentPassword, newPassword) => {
    await api('/api/auth/password', { currentPassword, newPassword });
    await get().refresh();
    refreshSocket();
  },
}));
