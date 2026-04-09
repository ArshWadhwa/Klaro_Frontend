// Auth store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user.types';
import { authApi } from '@/lib/api/auth.api';
import { STORAGE_KEYS } from '@/config/constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;

  // Selectors
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => {
        set({ user, isAuthenticated: true, error: null });
      },

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error?.response?.data?.error || 'Failed to fetch user',
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      // Legacy: system-level admin (ROLE_ADMIN)
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ROLE_ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
