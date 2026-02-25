import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  ExampleItem,
  GetExampleListRequest,
  PatchExampleRequest,
  PostExampleRequest,
} from '@/api/example/example.types';
import { EXAMPLE_QUERY_KEYS } from '@/shared/constants/query-keys';
import { showToast } from '@/shared/utils/toast.utils';

import { exampleMockList, getExampleMockDetail } from '../mocks/example.mock';

const mockApiDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const mockExampleApi = {
  list: async (params?: GetExampleListRequest) => {
    await mockApiDelay();
    const { page = 1, size = 10, keyword = '' } = params || {};

    let filteredList = exampleMockList;
    if (keyword) {
      filteredList = exampleMockList.filter(
        (item: ExampleItem) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.email.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    const start = (page - 1) * size;
    const end = start + size;
    const paginatedList = filteredList.slice(start, end);

    return {
      list: paginatedList,
      totalCount: filteredList.length,
    };
  },

  detail: async (id: number) => {
    await mockApiDelay();
    return getExampleMockDetail(id);
  },

  create: async (data: PostExampleRequest) => {
    await mockApiDelay();
    if (import.meta.env.DEV) console.warn('[Mock] Create:', data);
    return { success: true };
  },

  update: async (id: number, data: PatchExampleRequest) => {
    await mockApiDelay();
    if (import.meta.env.DEV) console.warn('[Mock] Update:', id, data);
    return { success: true };
  },

  delete: async (id: number) => {
    await mockApiDelay();
    if (import.meta.env.DEV) console.warn('[Mock] Delete:', id);
    return { success: true };
  },

  deleteMany: async (ids: number[]) => {
    await mockApiDelay();
    if (import.meta.env.DEV) console.warn('[Mock] Delete Many:', ids);
    return { success: true };
  },
};

export const useExampleListQuery = (params?: GetExampleListRequest) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.list(params),
    queryFn: () => mockExampleApi.list(params),
    placeholderData: keepPreviousData,
  });

export const useExampleDetail = (id?: number) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.detail(id),
    queryFn: () => mockExampleApi.detail(id as number),
    enabled: Boolean(id),
  });

export const useCreateExample = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, PostExampleRequest>({
    mutationFn: (data) => mockExampleApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      showToast({ message: 'Example이 생성되었습니다.', variant: 'success' });
    },
    onError: (error) => {
      showToast({ message: error.message || 'Example 생성에 실패했습니다.', variant: 'error' });
    },
  });
};

export const useUpdateExample = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { id: number; data: PatchExampleRequest }>({
    mutationFn: ({ id, data }) => mockExampleApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.detail(variables.id) });
      showToast({ message: 'Example이 수정되었습니다.', variant: 'success' });
    },
    onError: (error) => {
      showToast({ message: error.message || 'Example 수정에 실패했습니다.', variant: 'error' });
    },
  });
};

export const useDeleteExample = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => mockExampleApi.delete(id),
    onSuccess: (_, deletedId) => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: EXAMPLE_QUERY_KEYS.detail(deletedId) });
      showToast({ message: 'Example이 삭제되었습니다.', variant: 'success' });
    },
    onError: (error) => {
      showToast({ message: error.message || 'Example 삭제에 실패했습니다.', variant: 'error' });
    },
  });
};

export const useDeleteManyExamples = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number[]>({
    mutationFn: (ids) => mockExampleApi.deleteMany(ids),
    onSuccess: (_, deletedIds) => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: EXAMPLE_QUERY_KEYS.detail(id) });
      });
      showToast({ message: 'Example들이 삭제되었습니다.', variant: 'success' });
    },
    onError: (error) => {
      showToast({ message: error.message || 'Example 삭제에 실패했습니다.', variant: 'error' });
    },
  });
};
