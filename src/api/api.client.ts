import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';

import { clearAuthStorage } from '@/shared/stores/auth.store';
import { showToast } from '@/shared/utils/toast.utils';

import { ROUTES } from '../routes/routes';
import {
  API_CONFIG,
  API_MESSAGES,
  CONTENT_TYPE,
  HEADERS,
  HTTP_STATUS,
  STORAGE_KEYS,
} from './api.constants';
import { API_ENDPOINTS } from './api.endpoints';
import type { ApiResponse } from './api.types';

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

interface TokenRefreshResponse {
  data: ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  basicAuth?: {
    username: string;
    password: string;
  };
}

export interface ErrorResponseData {
  message?: string;
  code?: string;
  errors?: string[];
  payload?: unknown;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL + API_CONFIG.VERSION,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
  },
});

class TokenManager {
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  redirectToLogin(): void {
    clearAuthStorage();
    // TODO: 라우터 시스템 구축 후 router.push(ROUTES.AUTH.LOGIN)로 변경
    window.location.href = ROUTES.AUTH.LOGIN;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error(API_MESSAGES.AUTH.NO_REFRESH_TOKEN);
    }

    try {
      // skipAuth: true — access token 없이 요청
      // body는 빈 객체 (서버가 쿠키로 refreshToken을 받음)
      const response = await apiClient.post<TokenRefreshResponse['data']>(
        API_ENDPOINTS.AUTH.REFRESH,
        {},
        {
          skipAuth: true,
        } as ExtendedAxiosRequestConfig,
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.payload;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      apiClient.defaults.headers.common[HEADERS.AUTHORIZATION] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      this.redirectToLogin();
      throw error instanceof Error ? error : new Error(API_MESSAGES.AUTH.TOKEN_REFRESH_FAILED);
    }
  }

  // 동시에 여러 요청이 401되면 큐에 추가하여 중복 갱신 방지
  async handleTokenRefresh(originalRequest: RetryableRequest): Promise<AxiosResponse> {
    const activeToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!activeToken || !refreshToken) {
      this.redirectToLogin();
      return Promise.reject(new Error(API_MESSAGES.AUTH.NO_VALID_SESSION));
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const newToken = await this.refreshToken();

      if (originalRequest.headers) {
        originalRequest.headers[HEADERS.AUTHORIZATION] = `Bearer ${newToken}`;
      }

      this.processQueue(null, newToken);
      return await apiClient(originalRequest);
    } catch (error) {
      this.processQueue(
        error instanceof Error ? error : new Error(API_MESSAGES.AUTH.TOKEN_REFRESH_FAILED),
        null,
      );
      return Promise.reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }
}

const tokenManager = new TokenManager();

const LOGIN_ENDPOINT = API_ENDPOINTS.AUTH.LOGIN;

apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.warn('API Request:', config.method?.toUpperCase(), config.url);
      if (config.params) console.warn('Params:', config.params);
      if (config.data) console.warn('Data:', config.data);
    }

    if (config.basicAuth && config.headers) {
      const credentials = btoa(`${config.basicAuth.username}:${config.basicAuth.password}`);
      config.headers[HEADERS.AUTHORIZATION] = `Basic ${credentials}`;
      return config;
    }

    if (!config.skipAuth && !config.headers?.[HEADERS.AUTHORIZATION]) {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
      }
    }

    // CSRF 방어: 브라우저에서만 설정 가능한 헤더로 CSRF 공격 차단
    if (config.headers && !config.headers[HEADERS.X_REQUESTED_WITH]) {
      config.headers[HEADERS.X_REQUESTED_WITH] = 'XMLHttpRequest';
    }

    // Double Submit Cookie 패턴: 쿠키의 CSRF 토큰을 헤더로 전송
    if (!config.skipAuth && config.headers) {
      const csrfToken = localStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
      if (csrfToken) {
        config.headers[HEADERS.X_CSRF_TOKEN] = csrfToken;
      }
    }

    return config;
  },
  (error: Error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.warn('API Response:', response.config.url, response.status);
    }

    const csrfToken =
      response.headers[HEADERS.X_CSRF_TOKEN.toLowerCase()] || response.headers['x-csrf-token'];
    if (csrfToken && typeof csrfToken === 'string') {
      localStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, csrfToken);
    }

    return response;
  },
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!error.response) {
      const networkMessage = getNetworkErrorMessage(error);
      console.error('Network Error:', error.message, error.code);

      // 네트워크 에러는 로그인 요청이어도 토스트 표시 (인증 실패만 폼에서 처리)
      showToast({ message: networkMessage, variant: 'error' });

      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error('Error:', error.response.data);
    }

    if (
      error.response.status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      // 리프레시 엔드포인트 자체가 401이면 갱신 시도하지 않음 (무한 루프 방지)
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        tokenManager.redirectToLogin();
        return Promise.reject(error);
      }
      return tokenManager.handleTokenRefresh(originalRequest);
    }

    const isLoginError = originalRequest?.url?.includes(LOGIN_ENDPOINT);
    const shouldShowToast = !originalRequest?.skipErrorToast && !isLoginError;

    const errorData = error.response.data;

    if (error.response.status === HTTP_STATUS.FORBIDDEN && shouldShowToast) {
      console.warn(API_MESSAGES.ERROR.FORBIDDEN);
      showToast({ message: API_MESSAGES.ERROR.FORBIDDEN, variant: 'error' });
    } else if (errorData?.message && shouldShowToast) {
      showToast({ message: errorData.message, variant: 'error' });
    }

    return Promise.reject(error);
  },
);

export const getNetworkErrorMessage = (error: AxiosError): string => {
  const errorMessage = error.message || '';
  const errorCode = (error.code || '').toUpperCase();

  if (errorMessage.includes('ERR_CONNECTION_REFUSED') || errorCode.includes('ECONNREFUSED')) {
    return API_MESSAGES.NETWORK.CONNECTION_REFUSED;
  }

  if (
    errorMessage.includes('ERR_CONNECTION_TIMED_OUT') ||
    errorMessage.includes('timeout') ||
    errorCode.includes('ETIMEDOUT') ||
    errorCode.includes('ECONNABORTED')
  ) {
    return API_MESSAGES.NETWORK.CONNECTION_TIMED_OUT;
  }

  if (
    errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
    errorMessage.includes('getaddrinfo') ||
    errorCode.includes('ENOTFOUND') ||
    errorCode.includes('EAI_AGAIN')
  ) {
    return API_MESSAGES.NETWORK.NAME_NOT_RESOLVED;
  }

  if (
    errorMessage.includes('ERR_CONNECTION_RESET') ||
    errorCode.includes('ECONNRESET') ||
    errorMessage.includes('socket hang up')
  ) {
    return API_MESSAGES.NETWORK.CONNECTION_RESET;
  }

  if (errorMessage.includes('Network Error') || !error.response) {
    return API_MESSAGES.NETWORK.SERVER_UNAVAILABLE;
  }

  return API_MESSAGES.NETWORK.CONNECTION_ERROR;
};
