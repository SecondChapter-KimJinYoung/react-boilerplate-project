/**
 * API 클라이언트 및 인터셉터
 *
 * Axios 기반 HTTP 클라이언트로 API 통신을 관리합니다.
 * 자동 토큰 갱신, 요청/응답 인터셉터, 에러 핸들링을 제공합니다.
 *
 * @example
 * // 기본 사용 (토큰 자동 추가)
 * const data = await get('/api/v1/users', { page: 1, limit: 10 });
 * const result = await post('/api/v1/users', { name: 'John Doe' });
 * const updated = await patch('/api/v1/users/1', { name: 'Jane Doe' });
 * await del('/api/v1/users/1');
 * await uploadFile('/api/v1/users/1/avatar', file);
 *
 * @example
 * // 토큰 없이 요청 (공개 API, 로그인 등)
 * const publicData = await get('/api/v1/public/status', undefined, { skipAuth: true });
 * const loginResult = await post('/api/v1/auth/login', { email, password }, { skipAuth: true });
 * const publicFile = await uploadFile('/api/v1/public/upload', file, undefined, { skipAuth: true });
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  API_CONFIG,
  HTTP_STATUS,
  STORAGE_KEYS,
  HEADERS,
  CONTENT_TYPE,
  API_MESSAGES,
} from './api.constants';
import { API_ENDPOINTS } from './api.endpoints';

const LOGIN_ENDPOINT = API_ENDPOINTS.AUTH.LOGIN;
import type { ApiResponse } from './api.types';
import { ROUTES } from '../routes/routes';
import { showToast } from '@/shared/utils/toast.utils';
import { clearAuthStorage } from '@/shared/stores/auth.store';
import { handleError } from './api.utils';
import { getErrorMessageByStatusCode } from './api.messages';
import { getMimeTypeFromFilename, base64ToBlob, sanitizeFilename } from '@/shared/utils/file';

// ============================================
// 타입 정의
// ============================================

/** 토큰 갱신 대기 큐 아이템 */
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

/** 토큰 갱신 응답 타입 */
interface TokenRefreshResponse {
  data: ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>;
}

/** 재시도 가능한 요청 타입 */
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}

/** 확장된 Axios 요청 설정 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  basicAuth?: {
    username: string;
    password: string;
  };
}

/** API 요청 옵션 */
export interface ApiRequestOptions {
  /** 인증 토큰을 헤더에 추가하지 않음 */
  skipAuth?: boolean;
  /** 에러 발생 시 글로벌 토스트를 표시하지 않음 (폼에서 직접 처리할 때 사용) */
  skipErrorToast?: boolean;
  /** Basic Auth 인증 정보 */
  basicAuth?: {
    username: string;
    password: string;
  };
}

/** 에러 응답 데이터 타입 */
interface ErrorResponseData {
  message?: string;
  code?: string;
  errors?: string[];
  payload?: unknown;
}

// ============================================
// API 클라이언트 생성
// ============================================
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL + API_CONFIG.VERSION,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
  },
});

// ============================================
// 토큰 관리 시스템
// ============================================
class TokenManager {
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  /**
   * 대기 중인 요청들을 처리합니다.
   * @param error - 에러 발생 시 전달
   * @param token - 새로 발급받은 토큰
   */
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

  /**
   * 로그인 페이지로 리다이렉트합니다.
   * 아이디 저장 기능을 위해 REMEMBERED_EMAIL은 보존합니다.
   */
  redirectToLogin(): void {
    clearAuthStorage();
    // TODO: 라우터 시스템 구축 후 router.push(ROUTES.AUTH.LOGIN)로 변경
    window.location.href = ROUTES.AUTH.LOGIN;
  }

  /**
   * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
   * @returns 새로 발급받은 Access Token
   * @throws {Error} Refresh Token이 없거나 갱신 실패 시
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error(API_MESSAGES.AUTH.NO_REFRESH_TOKEN);
    }

    try {
      // skipAuth: true로 설정하여 access token 없이 요청
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

  /**
   * 401 에러 발생 시 토큰을 갱신하고 원래 요청을 재시도합니다.
   * 동시에 여러 요청이 실패한 경우 큐에 추가하여 중복 갱신을 방지합니다.
   * @param originalRequest - 실패한 원본 요청
   * @returns 재시도된 요청의 응답
   */
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

// ============================================
// 요청 인터셉터
// ============================================
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.warn('API Request:', config.method?.toUpperCase(), config.url);
      if (config.params) console.warn('Params:', config.params);
      if (config.data) console.warn('Data:', config.data);
    }

    // Basic Auth 처리
    if (config.basicAuth && config.headers) {
      const credentials = btoa(`${config.basicAuth.username}:${config.basicAuth.password}`);
      config.headers[HEADERS.AUTHORIZATION] = `Basic ${credentials}`;
      return config;
    }

    // skipAuth 플래그가 없을 때만 토큰 추가
    if (!config.skipAuth && !config.headers?.[HEADERS.AUTHORIZATION]) {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
      }
    }

    // CSRF 방어: X-Requested-With 헤더 추가 (기본 보호)
    // 이 헤더는 브라우저에서만 설정 가능하므로 CSRF 공격 차단에 도움
    if (config.headers && !config.headers[HEADERS.X_REQUESTED_WITH]) {
      config.headers[HEADERS.X_REQUESTED_WITH] = 'XMLHttpRequest';
    }

    // CSRF 토큰이 있으면 헤더에 추가 (서버가 지원하는 경우)
    // 서버가 쿠키에 CSRF 토큰을 설정하고, 이를 헤더로 전송하는 Double Submit Cookie 패턴
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

// ============================================
// 응답 인터셉터
// ============================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.warn('API Response:', response.config.url, response.status);
    }

    // CSRF 토큰이 응답 헤더에 있으면 저장 (서버가 지원하는 경우)
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

      // 네트워크 에러(타임아웃, 연결 실패 등)는 로그인 요청이어도 토스트 표시
      // 인증 실패(401, 403)만 폼에서 직접 처리
      showToast({ message: networkMessage, variant: 'error' });

      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error('Error:', error.response.data);
    }

    // 401 에러 발생 시 토큰 갱신 시도 (토큰 만료 시)
    if (
      error.response.status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      // 리프레시 토큰 엔드포인트 자체가 401이면 갱신 시도하지 않음
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        tokenManager.redirectToLogin();
        return Promise.reject(error);
      }
      return tokenManager.handleTokenRefresh(originalRequest);
    }

    // 로그인 에러 또는 skipErrorToast 설정 시 글로벌 토스트 표시하지 않음
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

// ============================================
// 네트워크 에러 타입 구분
// ============================================

/**
 * 네트워크 에러 메시지를 구분하여 적절한 메시지를 반환합니다.
 * @param error - AxiosError 인스턴스
 * @returns 네트워크 에러 메시지
 */
const getNetworkErrorMessage = (error: AxiosError): string => {
  const errorMessage = error.message || '';
  const errorCode = (error.code || '').toUpperCase();

  // ERR_CONNECTION_REFUSED: 서버가 완전히 꺼짐
  if (errorMessage.includes('ERR_CONNECTION_REFUSED') || errorCode.includes('ECONNREFUSED')) {
    return API_MESSAGES.NETWORK.CONNECTION_REFUSED;
  }

  // ERR_CONNECTION_TIMED_OUT: 타임아웃
  if (
    errorMessage.includes('ERR_CONNECTION_TIMED_OUT') ||
    errorMessage.includes('timeout') ||
    errorCode.includes('ETIMEDOUT') ||
    errorCode.includes('ECONNABORTED')
  ) {
    return API_MESSAGES.NETWORK.CONNECTION_TIMED_OUT;
  }

  // ERR_NAME_NOT_RESOLVED: DNS 찾을 수 없음
  if (
    errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
    errorMessage.includes('getaddrinfo') ||
    errorCode.includes('ENOTFOUND') ||
    errorCode.includes('EAI_AGAIN')
  ) {
    return API_MESSAGES.NETWORK.NAME_NOT_RESOLVED;
  }

  // ERR_CONNECTION_RESET: 연결 중간에 끊김
  if (
    errorMessage.includes('ERR_CONNECTION_RESET') ||
    errorCode.includes('ECONNRESET') ||
    errorMessage.includes('socket hang up')
  ) {
    return API_MESSAGES.NETWORK.CONNECTION_RESET;
  }

  // 기타 네트워크 에러
  if (errorMessage.includes('Network Error') || !error.response) {
    return API_MESSAGES.NETWORK.SERVER_UNAVAILABLE;
  }

  // 기본 메시지
  return API_MESSAGES.NETWORK.CONNECTION_ERROR;
};

// ============================================
// 에러 핸들링
// ============================================

/**
 * API 에러 클래스
 * 서버에서 반환된 에러 정보를 구조화하여 관리합니다.
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors: string[];

  constructor(statusCode: number, message: string, code: string, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * 다양한 형태의 에러를 ApiError로 변환합니다.
 * @param error - 발생한 에러 (AxiosError, Error, unknown)
 * @returns 표준화된 ApiError 인스턴스
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const responseData = error.response?.data as ErrorResponseData | undefined;

    if (error.message === 'Network Error' || !error.response) {
      const networkMessage = getNetworkErrorMessage(error);
      handleError(error, { fallbackMessage: networkMessage, silent: true });
      return new ApiError(0, networkMessage, 'NETWORK_ERROR');
    }

    const message = responseData?.message || getErrorMessageByStatusCode(statusCode);
    const code = responseData?.code || 'UNKNOWN_ERROR';
    const errors = responseData?.errors || [];
    handleError(error, { fallbackMessage: message, silent: true });
    return new ApiError(statusCode, message, code, errors);
  }

  handleError(error, { fallbackMessage: API_MESSAGES.SERVER_ERROR.INTERNAL, silent: true });
  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.SERVER_ERROR.INTERNAL,
    'UNKNOWN_ERROR',
  );
};

// ============================================
// 편의 함수들
// ============================================

/**
 * GET 요청을 보냅니다.
 * @param url - 요청 URL
 * @param params - 쿼리 파라미터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const get = async <TResponse, TParams = Record<string, unknown>>(
  url: string,
  params?: TParams,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.get<TResponse>(url, {
      params: params as unknown,
      skipAuth: options?.skipAuth,
      skipErrorToast: options?.skipErrorToast,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터 (FormData인 경우 자동으로 Content-Type 처리)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const post = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    // FormData인 경우 Content-Type을 제거하여 axios가 자동으로 multipart/form-data와 boundary를 설정하도록 함
    const isFormData = data instanceof FormData;
    const response = await apiClient.post<TResponse>(
      url,
      data as unknown,
      {
        headers: isFormData
          ? {
              [HEADERS.CONTENT_TYPE]: undefined,
            }
          : undefined,
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
        basicAuth: options?.basicAuth,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PATCH 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const patch = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.patch<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PUT 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const put = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.put<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * DELETE 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터 (선택)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const del = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.delete<TResponse>(url, {
      data: data as unknown,
      skipAuth: options?.skipAuth,
      skipErrorToast: options?.skipErrorToast,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 파일을 업로드합니다.
 * @param url - 업로드 URL
 * @param file - 업로드할 파일
 * @param path - 저장 경로 (선택)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청, additionalFields: FormData에 추가할 필드)
 * @returns 응답 데이터
 * @throws {ApiError} 업로드 실패 시
 */
export const uploadFile = async <T>(
  url: string,
  file: File,
  path?: string,
  options?: ApiRequestOptions & {
    additionalFields?: Record<string, string>;
  },
): Promise<T> => {
  try {
    // 파일 타입 검증 (MIME 타입 확인)
    if (!file.type || file.type === 'application/octet-stream') {
      // MIME 타입이 없거나 일반 바이너리인 경우 확장자로 검증
      const ext = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = [
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
        'heic',
        'mp4',
        'webm',
        'ogg',
        'mov',
        'avi',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
      ];
      if (!ext || !allowedExtensions.includes(ext)) {
        throw new Error('허용되지 않은 파일 형식입니다.');
      }
    }

    // 파일명 검증 (XSS/Path Traversal 방지)
    const sanitizedPath = path ? sanitizeFilename(path, 'uploads') : undefined;

    const formData = new FormData();
    formData.append('file', file);
    if (sanitizedPath) {
      formData.append('path', sanitizedPath);
    }
    // 추가 필드 추가
    if (options?.additionalFields) {
      Object.entries(options.additionalFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // post 함수가 FormData를 자동으로 처리하므로 직접 호출
    return post<T>(url, formData, {
      skipAuth: options?.skipAuth,
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * base64 응답을 Blob으로 변환하여 파일을 다운로드합니다.
 * 서버 응답 형식: { code: "SUCCESS", payload: "base64문자열" }
 * @param url - 다운로드 URL
 * @param data - 요청 데이터
 * @param filename - 파일명 (MIME 타입 추론용, API 요청에는 포함되지 않음)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns Blob 데이터를 포함한 AxiosResponse
 * @throws {ApiError} 다운로드 실패 시
 */
export const downloadFileAsBlob = async <TData = unknown>(
  url: string,
  data: TData,
  filename?: string,
  options?: ApiRequestOptions,
): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(
      url,
      data as unknown,
      {
        timeout: 60000, // 60초 (대용량 파일 처리)
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig,
    );

    const base64String = response.data.payload;
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('서버에서 base64 데이터를 받지 못했습니다.');
    }

    // 파일명 검증 (XSS/Path Traversal 방지)
    const safeFilename = sanitizeFilename(filename, 'download');

    const mimeType = getMimeTypeFromFilename(safeFilename) || 'application/octet-stream';
    const blob = base64ToBlob(base64String, mimeType);

    if (import.meta.env.DEV) {
      console.warn('Blob created:', { type: blob.type, size: blob.size, filename: safeFilename });
    }

    return { ...response, data: blob } as AxiosResponse<Blob>;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 엑셀 파일을 다운로드합니다.
 * @param url - 다운로드 URL
 * @param data - 요청 본문 데이터
 * @param filename - 파일명
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns void (파일이 자동으로 다운로드됨)
 * @throws {ApiError} 다운로드 실패 시
 */
export const downloadExcel = async <TData = unknown>(
  url: string,
  data: TData,
  filename: string = 'export.xlsx',
  options?: ApiRequestOptions,
): Promise<void> => {
  try {
    const response = await apiClient.post<Blob>(
      url,
      data as unknown,
      {
        responseType: 'blob',
        timeout: 60000, // 60초 (대용량 파일 처리)
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig,
    );

    // 파일명 검증 (XSS/Path Traversal 방지)
    const safeFilename = sanitizeFilename(filename, 'download');

    // Blob을 다운로드 링크로 변환하여 다운로드
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url_blob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_blob;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_blob);
  } catch (error) {
    throw handleApiError(error);
  }
};
