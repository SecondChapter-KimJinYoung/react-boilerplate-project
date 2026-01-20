/**
 * 라우트 상수
 *
 * 모든 라우트 경로를 중앙에서 관리합니다.
 * API 엔드포인트와 동일한 구조로 관리합니다.
 *
 * 각 라우트는 다음과 같은 형태를 가집니다.
 * LIST: 목록 조회 (GET)
 * DETAIL: 상세 조회 (GET)
 * CREATE: 생성 (POST)
 * EDIT: 수정 (PATCH)
 * DELETE: 삭제 (DELETE)
 *
 * 주의: 관리 페이지들은 `/dashboard` 하위에 중첩 라우트로 설정됩니다.
 * 예: `/academy` → 실제 경로는 `/dashboard/academy`
 */

export const ROUTES = {
  // ============ Example (예시) ============
  EXAMPLE: {
    LIST: '/example',
    DETAIL: (id: number) => `/example/detail/${id}`,
    CREATE: '/example/create',
    EDIT: (id: number) => `/example/edit/${id}`,
  },

  // ============ 인증 ============
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    SIGNUP_SUCCESS: '/auth/signup/success',
    FIND_ID: '/auth/find/id',
    FIND_PASSWORD: '/auth/find/password',
  },

  // ============ 대시보드 ============
  DASHBOARD: '/dashboard',
} as const;
