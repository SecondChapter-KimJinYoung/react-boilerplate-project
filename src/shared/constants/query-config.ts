export const STALE_TIME = {
  /** 거의 변하지 않는 데이터: 카테고리, 코드 테이블, 약관 */
  STATIC: 1000 * 60 * 30,

  /** 느리게 변하는 데이터: 사용자 프로필, 권한 설정 */
  STABLE: 1000 * 60 * 10,

  /** 보통의 CRUD: mutation 시 invalidation이 확실한 경우만 */
  MODERATE: 1000 * 60 * 3,
} as const;

export const GC_TIME = {
  SHORT: 1000 * 60 * 5,
  DEFAULT: 1000 * 60 * 10,
  LONG: 1000 * 60 * 30,
} as const;
