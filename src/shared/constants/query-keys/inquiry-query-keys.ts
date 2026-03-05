import type { GetInquiryListRequest } from '@/api/inquiry/inquiry-types';

export const INQUIRY_QUERY_KEYS = {
  all: ['inquiries'] as const,
  lists: () => [...INQUIRY_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetInquiryListRequest) => [...INQUIRY_QUERY_KEYS.all, 'list', params] as const,
  myList: () => [...INQUIRY_QUERY_KEYS.all, 'my-list'] as const,
  details: () => [...INQUIRY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id?: number) => [...INQUIRY_QUERY_KEYS.all, 'detail', id] as const,
} as const;
