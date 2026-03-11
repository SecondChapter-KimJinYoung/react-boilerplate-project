import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/api';
import { exampleApi } from '@/api/example/example-api';
import type {
  DeleteExampleRequest,
  GetExampleListRequest,
  PatchExampleRequest,
  PostExampleRequest,
} from '@/api/example/example-types';
import { STALE_TIME } from '@/shared/constants/query-config';
import { EXAMPLE_QUERY_KEYS } from '@/shared/constants/query-keys/example-query-keys';
import { showToast } from '@/shared/utils/toast-utils';

// ── Queries ──

export const useExampleListQuery = (params?: GetExampleListRequest) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.list(params),
    queryFn: () => exampleApi.list(params),
    staleTime: STALE_TIME.MODERATE,
    placeholderData: keepPreviousData,
  });

export const useExampleDetailQuery = (id?: number) =>
  useQuery({
    queryKey: EXAMPLE_QUERY_KEYS.detail(id),
    queryFn: () => exampleApi.detail(id!),
    staleTime: STALE_TIME.MODERATE,
    enabled: id !== undefined,
  });

// ── Mutations ──

export const useCreateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostExampleRequest) => exampleApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      showToast({ message: 'Example이 생성되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : 'Example 생성에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

export const useUpdateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchExampleRequest }) =>
      exampleApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: EXAMPLE_QUERY_KEYS.detail(variables.id),
      });
      showToast({ message: 'Example이 수정되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : 'Example 수정에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

export const useDeleteExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteExampleRequest) => exampleApi.delete(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEYS.lists() });
      variables.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: EXAMPLE_QUERY_KEYS.detail(id) });
      });
      showToast({ message: 'Example이 삭제되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : 'Example 삭제에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};
