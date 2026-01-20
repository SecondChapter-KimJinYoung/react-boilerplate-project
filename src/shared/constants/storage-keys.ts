/**
 * Storage 키 상수
 * localStorage와 sessionStorage를 구분하여 관리
 */

// ============ localStorage (영구 저장) ============

// 인증
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken', // 액세스 토큰
  REFRESH_TOKEN: 'refreshToken', // 리프레시 토큰
  USER_INFO: 'userInfo', // 사용자 정보
  REMEMBERED_EMAIL: 'rememberedEmail', // 기억된 이메일
} as const;

// ============ sessionStorage (임시 저장) ============

// 계정 찾기
export const FIND_ACCOUNT_SESSION_KEYS = {
  VERIFICATION_CODE: 'find_account_verification_code', // 인증 코드
  VERIFICATION_EXPIRY: 'find_account_verification_expiry', // 인증 만료 시간
  VERIFICATION_PHONE: 'find_account_verification_phone', // 인증 전화번호
} as const;

// 비밀번호 재설정
export const RESET_PASSWORD_SESSION_KEYS = {
  VERIFICATION_CODE: 'find_password_verification_code', // 인증 코드
  VERIFICATION_EXPIRY: 'find_password_verification_expiry', // 인증 만료 시간
  VERIFICATION_PHONE: 'find_password_verification_phone', // 인증 전화번호
  RESET_TOKEN: 'reset_pw_token', // 비밀번호 재설정 토큰
  RESET_EMAIL: 'reset_pw_email', // 비밀번호 재설정 이메일
} as const;
