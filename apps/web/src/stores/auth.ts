// ============================================================
// Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  role: string;
  profile?: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string | null;
    universityId?: string | null;
  } | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'eastern-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);