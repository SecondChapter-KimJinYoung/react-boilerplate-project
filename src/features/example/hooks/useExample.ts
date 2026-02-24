import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EXAMPLE_QUERY_KEYS } from '@/shared/constants/query-keys';
import { showToast } from '@/shared/utils/toast.utils';
import { exampleMockList, getExampleMockDetail } from '../mocks/example.mock';
import type {
  ExampleItem,
  GetExampleListRequest,
  PostExampleRequest,
  PatchExampleRequest,
} from '@/api/example/example.types';

// ============ Mock API Functions ============
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

// ============ Query Hooks ============

/**
 * Example 목록 조회 (목업 데이터)
 * @param params - 목록 조회 파라미터 (page, size, sort, keyword 등)
 * @returns { data, isLoading, error, ... }
 */
export const useExampleListQuery = (params?: GetExampleListRequest) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.list(params),
    queryFn: () => mockExampleApi.list(params),
    placeholderData: keepPreviousData,
  });

/**
 * Example 상세 조회 (목업 데이터)
 * @param id - 조회할 Example ID
 * @returns { data, isLoading, error, ... }
 */
export const useExampleDetail = (id?: number) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.detail(id),
    queryFn: () => mockExampleApi.detail(id as number),
    enabled: Boolean(id),
  });

// ============ Mutation Hooks ============

/**
 * Example 생성 (목업)
 *
 * 무효화: lists() — 새 항목이 추가되므로 목록(totalCount, 페이지네이션)만 갱신.
 * 상세 캐시는 아직 존재하지 않으므로 무효화 불필요.
 */
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

/**
 * Example 수정 (목업)
 *
 * 무효화: lists() + detail(id) — 변경된 항목이 목록에도 상세에도 반영되어야 함.
 * lists()는 목록 전체를, detail(id)는 해당 항목의 상세만 정밀 무효화.
 * (all 대신 lists()를 써서 다른 항목의 상세 캐시는 유지)
 */
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

/**
 * Example 삭제 (목업)
 *
 * 무효화: lists() — 삭제된 항목이 목록에서 빠져야 함 (totalCount, 페이지네이션 변경).
 * 삭제된 항목의 상세 캐시는 removeQueries로 즉시 제거 (refetch해도 404).
 */
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

/**
 * Example 다중 삭제 (목업)
 *
 * 무효화: all — 여러 항목이 한꺼번에 삭제되어 영향 범위가 넓음.
 * 개별 detail removeQueries 대신 all로 전체 정리하는 것이 단순하고 안전.
 */
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

// ============ 실제 API로 전환하기 ============
/*
실제 API 준비되면 다음과 같이 수정:

1. mockExampleApi를 exampleApi로 교체:
   import { exampleApi } from '@/api/example/example.api';

2. 각 훅의 queryFn/mutationFn에서 mockExampleApi를 exampleApi로 변경

3. useExampleListQuery에서 select 추가:
   select: (response: GetExampleListResponse) => response.payload,

4. useExampleDetail에서 select 추가:
   select: (response: GetExampleDetailResponse) => response.payload,

5. mutation 훅들의 타입을 실제 Response 타입으로 변경:
   - PostExampleResponse, PatchExampleResponse, DeleteExampleResponse
*/
