export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  VERSION: '/api/v1',
  TIMEOUT: 10000,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
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
    BAD_REQUEST: '잘못된 요청입니다.',
    UNAUTHORIZED: '인증이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    METHOD_NOT_ALLOWED: '허용되지 않은 요청 방법입니다.',
    REQUEST_TIMEOUT: '요청 시간이 초과되었습니다.',
    CONFLICT: '데이터 충돌이 발생했습니다.',
    PAYLOAD_TOO_LARGE: '요청 데이터가 너무 큽니다.',
    VALIDATION_FAILED: '입력값을 확인해주세요.',
    TOO_MANY_REQUESTS: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },
  SERVER_ERROR: {
    INTERNAL: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    BAD_GATEWAY: '서버 연결에 문제가 있습니다.',
    SERVICE_UNAVAILABLE: '서비스가 일시적으로 이용 불가합니다.',
    GATEWAY_TIMEOUT: '서버 응답 시간이 초과되었습니다.',
  },
  NETWORK: {
    CONNECTION_ERROR: '네트워크 연결을 확인해주세요.',
    OFFLINE: '인터넷 연결이 끊겼습니다. 네트워크 상태를 확인해주세요.',
    TIMEOUT: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.',
    CONNECTION_REFUSED: '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
    CONNECTION_TIMED_OUT: '서버 응답이 없습니다. 잠시 후 다시 시도해주세요.',
    NAME_NOT_RESOLVED: '서버 주소를 찾을 수 없습니다. URL을 확인해주세요.',
    CONNECTION_RESET: '서버와의 연결이 끊겼습니다. 다시 시도해주세요.',
    SERVER_UNAVAILABLE: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
  },
} as const;
