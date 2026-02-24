/**
 * React Query 키 상수 (Query Key Factory 패턴)
 *
 * 각 도메인별로 쿼리 키를 계층적으로 관리합니다.
 * invalidateQueries는 prefix matching으로 동작하므로, 계층 구조가 무효화 범위를 결정합니다.
 *
 * 계층 구조:
 *   all         ['examples']                          → 전체 무효화
 *   ├─ lists()  ['examples', 'list']                  → 목록 전체 무효화
 *   │  └─ list  ['examples', 'list', { page, ... }]   → 특정 파라미터 목록
 *   └─ details()['examples', 'detail']                → 상세 전체 무효화
 *      └─ detail['examples', 'detail', id]            → 특정 ID 상세
 *
 * Mutation별 무효화 가이드:
 *   Create      → lists()           새 항목 추가 → 목록만 갱신 (상세 캐시 없음)
 *   Update      → lists() + detail  변경된 항목 → 목록 + 해당 상세만 정밀 갱신
 *   Delete      → lists()           항목 제거 → 목록만 갱신 (삭제된 상세는 removeQueries)
 *   Bulk Delete → all               영향 범위가 넓음 → 전체 갱신
 */

import type { GetExampleListRequest } from '@/api/example/example.types';

// ============ Example ============
export const EXAMPLE_QUERY_KEYS = {
  all: ['examples'] as const,
  lists: () => [...EXAMPLE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetExampleListRequest) => [...EXAMPLE_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...EXAMPLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id?: number) => [...EXAMPLE_QUERY_KEYS.all, 'detail', id] as const,
} as const;
