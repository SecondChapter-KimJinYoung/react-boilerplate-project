import type { GetExampleListRequest } from '@/api/example/example-types';

export const EXAMPLE_QUERY_KEYS = {
  all: ['examples'] as const,
  lists: () => [...EXAMPLE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetExampleListRequest) => [...EXAMPLE_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...EXAMPLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id?: number) => [...EXAMPLE_QUERY_KEYS.all, 'detail', id] as const,
} as const;
