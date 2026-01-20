/**
 * API 관련 상수 모음
 *
 * - BASE_URL: `.env`에서 관리되는 서버 주소
 * - VERSION: 공통 API 버전 prefix
 * - TIMEOUT/RETRY: 요청 기본 설정
 * - HTTP_STATUS/HTTP_METHOD: 네트워크 표준 상수
 * - CONTENT_TYPE/HEADERS: 공통 헤더 키
 * - STORAGE_KEYS: 인증 정보 저장 키
 */

// ============ API 설정 ============
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  IMAGE_BASE_URL: import.meta.env.VITE_MEDIA_BASE_URL || '',
  VERSION: '/api/v1',
  TIMEOUT: 10000, // 10초
  RETRY_COUNT: 3, // 3번 재시도
  RETRY_DELAY: 1000, // 1초
} as const;

// ============ HTTP 상태 코드 ============
export const HTTP_STATUS = {
  // ===== 2xx: 성공 =====
  OK: 200, // GET 성공
  CREATED: 201, // POST 생성 성공
  NO_CONTENT: 204, // DELETE 성공, 응답 body 없음

  // ===== 3xx: 리다이렉션 =====
  NOT_MODIFIED: 304, // 캐시된 리소스 사용

  // ===== 4xx: 클라이언트 에러 =====
  BAD_REQUEST: 400, // 잘못된 요청
  UNAUTHORIZED: 401, // 인증 필요
  FORBIDDEN: 403, // 권한 없음
  NOT_FOUND: 404, // 리소스 없음
  METHOD_NOT_ALLOWED: 405, // 허용되지 않은 메서드
  REQUEST_TIMEOUT: 408, // 요청 타임아웃
  CONFLICT: 409, // 리소스 충돌 (중복)
  PAYLOAD_TOO_LARGE: 413, // 파일 너무 큼
  UNPROCESSABLE_ENTITY: 422, // 검증 실패
  TOO_MANY_REQUESTS: 429, // Rate Limit 초과

  // ===== 5xx: 서버 에러 =====
  INTERNAL_SERVER_ERROR: 500, // 서버 에러
  BAD_GATEWAY: 502, // 게이트웨이 에러
  SERVICE_UNAVAILABLE: 503, // 서비스 불가
  GATEWAY_TIMEOUT: 504, // 게이트웨이 타임아웃
} as const;

// ============ HTTP 메서드 ============
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// ============ Content-Type ============
export const CONTENT_TYPE = {
  JSON: 'application/json', // JSON 형식 데이터
  FORM_DATA: 'multipart/form-data', // 파일 업로드, FormData
  URL_ENCODED: 'application/x-www-form-urlencoded', // HTML 폼 제출
  TEXT: 'text/plain', // 일반 텍스트
} as const;

// ============ 헤더 키 ============
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_CSRF_TOKEN: 'X-CSRF-Token', // CSRF 토큰 헤더
} as const;

// ============ 로컬 스토리지 키 ============
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  REMEMBERED_EMAIL: 'rememberedEmail',
  CSRF_TOKEN: 'csrfToken', // CSRF 토큰 저장 키
} as const;

// ============ API 메시지 상수 ============
export const API_MESSAGES = {
  // ===== 성공 메시지 (2xx) =====
  SUCCESS: {
    OK: '요청이 성공적으로 처리되었습니다.',
    CREATED: '생성되었습니다.',
    DELETED: '삭제되었습니다.',
    UPDATED: '수정되었습니다.',
  },

  // ===== 클라이언트 에러 메시지 (4xx) =====
  ERROR: {
    BAD_REQUEST: '잘못된 요청입니다. 입력값을 확인해주세요.',
    UNAUTHORIZED: '인증이 필요합니다. 다시 로그인해주세요.',
    FORBIDDEN: '접근 권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    METHOD_NOT_ALLOWED: '허용되지 않은 요청 방법입니다.',
    REQUEST_TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    CONFLICT: '이미 존재하는 데이터입니다.',
    PAYLOAD_TOO_LARGE: '파일 크기가 너무 큽니다.',
    VALIDATION_FAILED: '입력값 검증에 실패했습니다.',
    TOO_MANY_REQUESTS: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },

  // ===== 서버 에러 메시지 (5xx) =====
  SERVER_ERROR: {
    INTERNAL: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    BAD_GATEWAY: '서버 연결에 문제가 발생했습니다.',
    SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다.',
    GATEWAY_TIMEOUT: '서버 응답 시간이 초과되었습니다.',
  },

  // ===== 네트워크 에러 =====
  NETWORK: {
    CONNECTION_ERROR: '네트워크 연결을 확인해주세요.',
    TIMEOUT: '요청 시간이 초과되었습니다.',
    OFFLINE: '인터넷 연결이 끊어졌습니다.',
    CONNECTION_REFUSED: '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
    CONNECTION_TIMED_OUT: '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
    NAME_NOT_RESOLVED: '서버 주소를 찾을 수 없습니다. 네트워크 설정을 확인해주세요.',
    CONNECTION_RESET: '서버 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.',
    SERVER_UNAVAILABLE: '서버에 접근할 수 없습니다. 서버 상태를 확인해주세요.',
  },

  // ===== 인증 관련 메시지 =====
  AUTH: {
    LOGIN_SUCCESS: '로그인되었습니다.',
    LOGIN_FAILED: '이메일 또는 비밀번호가 올바르지 않습니다.',
    LOGOUT_SUCCESS: '로그아웃되었습니다.',
    TOKEN_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
    TOKEN_REFRESH_FAILED: '세션 갱신에 실패했습니다. 다시 로그인해주세요.',
    NO_VALID_SESSION: '유효한 세션이 없습니다.',
    NO_REFRESH_TOKEN: '갱신 토큰이 없습니다.',
    NO_ACCESS_TOKEN: '접근 토큰이 없습니다.',
    SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
    SIGNUP_FAILED: '회원가입에 실패했습니다.',
  },
} as const;
