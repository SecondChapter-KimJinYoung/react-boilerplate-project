/**
 * React Query 키 상수
 *
 * 각 도메인별로 쿼리 키를 그룹화하여 관리 모든 쿼리 키를 중앙에서 관리합니다.
 */

import type { GetExampleListRequest } from '@/api/example/example.types';

// ============ Example ============
export const EXAMPLE_QUERY_KEYS = {
  all: ['examples'] as const,
  list: (params?: GetExampleListRequest) => [...EXAMPLE_QUERY_KEYS.all, 'list', params] as const,
  detail: (id?: number) => [...EXAMPLE_QUERY_KEYS.all, 'detail', id] as const,
} as const;
