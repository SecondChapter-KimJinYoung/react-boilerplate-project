import { create } from 'zustand';

import { STORAGE_KEYS } from '@/api/api.constants';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// rememberedEmail은 보존 — logout과 TokenManager.redirectToLogin에서 공통 사용
export const clearAuthStorage = (): void => {
  const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);

  if (rememberedEmail) {
    localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, rememberedEmail);
  }
};

const getInitialAuth = (): { isAuthenticated: boolean; user: User | null } => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    const user = userJson ? (JSON.parse(userJson) as User) : null;
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: true, user: null };
  }
};

export const useAuthStore = create<AuthState>()((set) => {
  const initial = getInitialAuth();

  return {
    isAuthenticated: initial.isAuthenticated,
    user: initial.user,

    login: (tokens, user) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      set({ isAuthenticated: true, user });
    },

    logout: () => {
      clearAuthStorage();
      set({ isAuthenticated: false, user: null });
    },

    setUser: (user) => {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
      set({ user });
    },
  };
});
