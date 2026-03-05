import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/api';
import { inquiryApi } from '@/api/inquiry/inquiry-api';
import type {
  AnswerInquiryRequest,
  DeleteInquiryRequest,
  GetInquiryListRequest,
  PatchInquiryRequest,
  PostInquiryRequest,
} from '@/api/inquiry/inquiry-types';
import { INQUIRY_QUERY_KEYS } from '@/shared/constants/query-keys/inquiry-query-keys';
import { showToast } from '@/shared/utils/toast-utils';

// ── Queries ──

export const useInquiryListQuery = (params?: GetInquiryListRequest) =>
  useQuery({
    queryKey: INQUIRY_QUERY_KEYS.list(params),
    queryFn: () => inquiryApi.list(params),
    placeholderData: keepPreviousData,
  });

export const useInquiryMyListQuery = () =>
  useQuery({
    queryKey: INQUIRY_QUERY_KEYS.myList(),
    queryFn: () => inquiryApi.myList(),
  });

export const useInquiryDetailQuery = (id?: number) =>
  useQuery({
    queryKey: INQUIRY_QUERY_KEYS.detail(id),
    queryFn: () => inquiryApi.detail(id as number),
    enabled: Boolean(id),
  });

// ── Mutations ──

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostInquiryRequest) => inquiryApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.myList() });
      showToast({ message: '문의가 등록되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : '문의 등록에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchInquiryRequest }) =>
      inquiryApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.myList() });
      void queryClient.invalidateQueries({
        queryKey: INQUIRY_QUERY_KEYS.detail(variables.id),
      });
      showToast({ message: '문의가 수정되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : '문의 수정에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteInquiryRequest) => inquiryApi.delete(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.myList() });
      variables.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: INQUIRY_QUERY_KEYS.detail(id) });
      });
      showToast({ message: '문의가 삭제되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : '문의 삭제에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

// ── Answer Mutations (관리자 전용) ──

export const useCreateInquiryAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnswerInquiryRequest }) =>
      inquiryApi.answerCreate(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: INQUIRY_QUERY_KEYS.detail(variables.id),
      });
      showToast({ message: '답변이 등록되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : '답변 등록에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};

export const useUpdateInquiryAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnswerInquiryRequest }) =>
      inquiryApi.answerUpdate(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: INQUIRY_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({
        queryKey: INQUIRY_QUERY_KEYS.detail(variables.id),
      });
      showToast({ message: '답변이 수정되었습니다.', variant: 'success' });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError ? error.message : '답변 수정에 실패했습니다.';
      showToast({ message, variant: 'error' });
    },
  });
};
