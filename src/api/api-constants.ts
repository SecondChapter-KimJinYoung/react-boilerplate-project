export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  VERSION: '/api/v1',
  TIMEOUT: 10000,
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

export const CONTENT_TYPE = {
  JSON: 'application/json',
} as const;

export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_CSRF_TOKEN: 'X-CSRF-Token',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  REMEMBERED_EMAIL: 'rememberedEmail',
  CSRF_TOKEN: 'csrfToken',
} as const;

export const API_MESSAGES = {
  AUTH: {
    NO_REFRESH_TOKEN: '인증 정보가 만료되었습니다. 다시 로그인해주세요.',
    TOKEN_REFRESH_FAILED: '인증 갱신에 실패했습니다. 다시 로그인해주세요.',
    NO_VALID_SESSION: '유효한 세션이 없습니다. 다시 로그인해주세요.',
  },
  ERROR: {
    FORBIDDEN: '접근 권한이 없습니다.',
  },
  NETWORK: {
    CONNECTION_ERROR: '네트워크 연결을 확인해주세요.',
    CONNECTION_REFUSED: '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
    CONNECTION_TIMED_OUT: '서버 응답이 없습니다. 잠시 후 다시 시도해주세요.',
    NAME_NOT_RESOLVED: '서버 주소를 찾을 수 없습니다. URL을 확인해주세요.',
    CONNECTION_RESET: '서버와의 연결이 끊겼습니다. 다시 시도해주세요.',
    SERVER_UNAVAILABLE: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;
