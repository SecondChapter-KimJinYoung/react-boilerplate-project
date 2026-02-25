// Query Key Factory 패턴 — invalidateQueries가 prefix matching으로 동작
//
// 계층 구조:
//   all         ['examples']                          → 전체 무효화
//   ├─ lists()  ['examples', 'list']                  → 목록 전체 무효화
//   │  └─ list  ['examples', 'list', { page, ... }]   → 특정 파라미터 목록
//   └─ details()['examples', 'detail']                → 상세 전체 무효화
//      └─ detail['examples', 'detail', id]            → 특정 ID 상세
//
// Mutation 무효화:
//   Create      → lists()           목록만 갱신
//   Update      → lists() + detail  목록 + 해당 상세
//   Delete      → lists()           목록만 갱신 (삭제된 상세는 removeQueries)
//   Bulk Delete → all               전체 갱신

import type { GetExampleListRequest } from '@/api/example/example.types';

export const EXAMPLE_QUERY_KEYS = {
  all: ['examples'] as const,
  lists: () => [...EXAMPLE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetExampleListRequest) => [...EXAMPLE_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...EXAMPLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id?: number) => [...EXAMPLE_QUERY_KEYS.all, 'detail', id] as const,
} as const;
