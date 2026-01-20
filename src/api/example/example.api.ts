/**
 * Example API 서비스
 *
 * 패턴:
 * - get, post, patch, del 함수 사용
 * - API_ENDPOINTS에서 엔드포인트 가져오기
 * - CRUD 메서드: list, create, update, delete, detail
 */

import { get, post, patch, del } from '@/api/api';
import { API_ENDPOINTS } from '@/api/api.endpoints';
import type {
  GetExampleListRequest,
  GetExampleListResponse,
  PostExampleRequest,
  PostExampleResponse,
  PatchExampleRequest,
  PatchExampleResponse,
  DeleteExampleResponse,
  GetExampleDetailResponse,
} from './example.types';

export const exampleApi = {
  // 목록 조회
  list: (params?: GetExampleListRequest) =>
    get<GetExampleListResponse, GetExampleListRequest>(API_ENDPOINTS.EXAMPLE.LIST, params),

  // 생성
  create: (data: PostExampleRequest) =>
    post<PostExampleResponse, PostExampleRequest>(API_ENDPOINTS.EXAMPLE.CREATE, data),

  // 단일 삭제
  delete: (id: number) => del<DeleteExampleResponse>(API_ENDPOINTS.EXAMPLE.DELETE, { ids: [id] }),

  // 다중 삭제
  deleteMany: (ids: number[]) => del<DeleteExampleResponse>(API_ENDPOINTS.EXAMPLE.DELETE, { ids }),

  // 수정
  update: (id: number, data: PatchExampleRequest) =>
    patch<PatchExampleResponse, PatchExampleRequest>(API_ENDPOINTS.EXAMPLE.UPDATE(id), data),

  // 단일 조회
  detail: (id: number) => get<GetExampleDetailResponse>(API_ENDPOINTS.EXAMPLE.DETAIL(id)),
};
