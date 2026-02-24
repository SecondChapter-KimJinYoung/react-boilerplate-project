/**
 * 인증 상태 관리 스토어 (Zustand)
 *
 * 로그인/로그아웃 상태와 사용자 정보를 관리합니다.
 * localStorage와 동기화하여 새로고침 시에도 상태가 유지됩니다.
 */

import { create } from 'zustand';
import { STORAGE_KEYS } from '@/api/api.constants';

// ============ 타입 정의 ============

/** 사용자 기본 정보 — 프로젝트에 맞게 확장하세요 */
export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  /** 로그인 — 토큰과 사용자 정보를 저장합니다 */
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;

  /** 로그아웃 — 토큰과 사용자 정보를 삭제합니다 (rememberedEmail은 보존) */
  logout: () => void;

  /** 사용자 정보 업데이트 */
  setUser: (user: User) => void;
}

// ============ 인증 스토리지 정리 ============

/**
 * 인증 관련 localStorage를 정리합니다.
 * 아이디 저장(rememberedEmail)은 보존합니다.
 *
 * auth.store.ts의 logout과 api.ts의 TokenManager.redirectToLogin에서 공통 사용합니다.
 */
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

// ============ 초기 상태 hydration ============

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

// ============ 스토어 ============

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
