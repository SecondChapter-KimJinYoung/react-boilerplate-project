/**
 * API 엔드포인트 상수
 *
 * 모든 API URL을 중앙에서 관리합니다.
 * BASE_URL은 환경변수 `VITE_API_BASE_URL` 에서 관리됩니다.
 *
 * 각 엔드포인트는 다음과 같은 형태를 가집니다.
 * LIST: 목록 조회 (GET)
 * DETAIL: 상세 조회 (GET)
 * CREATE: 생성 (POST)
 * UPDATE: 수정 (PATCH)
 * DELETE: 삭제 (DELETE)
 */

const HEALTH_CHECK_PATH = '/api/health';

export const API_ENDPOINTS = {
  // ============ Example (예시) ============
  EXAMPLE: {
    LIST: `/example`, // 목록조회 - GET
    CREATE: `/example`, // 생성 - POST
    DELETE: `/example`, // 삭제 - DELETE
    UPDATE: (id: number) => `/example/${id}`, // 수정 - PATCH
    DETAIL: (id: number) => `/example/detail/${id}`, // 단일조회 - GET
  },

  // ============ 상태 체크 ============
  STATUS: {
    CHECK: HEALTH_CHECK_PATH,
  },

  // ============ 공통 ============
  COMMON: {
    FILE_DOWNLOAD: `/common/file/download`, // 파일 다운로드 - POST
    FILE_UPLOAD: `/common/file/upload`, // 파일 업로드 - POST
    FILE_UPLOAD_URL: `/common/file/upload/url`, // 파일 업로드 URL 생성 - GET
  },

  // ============ 인증 ============
  AUTH: {
    FIND_ACCOUNT: `/auth/manager/find/account`, // 아이디 찾기(관리자) - POST
    FIND_PASSWORD: `/auth/manager/find/password`, // 비밀번호 찾기(관리자) - POST
    LOGIN: `/auth/manager/login`, // 로그인(관리자) - POST
    RESET_PASSWORD: `/auth/manager/reset/password`, // 비밀번호 재설정(관리자) - POST
    REFRESH: `/auth/manager/reset/token`, // accesstoken 재발급(관리자) - POST
    SIGNUP: `/auth/manager/sign`, // 회원가입(관리자) - POST
    VERIFICATION_SEND: `/auth/verification/send`, // 인증번호 발송 - POST
  },
} as const;
