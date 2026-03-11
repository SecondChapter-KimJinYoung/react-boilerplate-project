import { del, get, patch, post } from '@/api/api';
import { API_ENDPOINTS } from '@/api/api-endpoints';

import type {
  DeleteExampleRequest,
  DeleteExampleResponse,
  GetExampleDetailResponse,
  GetExampleListRequest,
  GetExampleListResponse,
  PatchExampleRequest,
  PatchExampleResponse,
  PostExampleRequest,
  PostExampleResponse,
} from './example-types';

export const exampleApi = {
  list: (params?: GetExampleListRequest) =>
    get<GetExampleListResponse, GetExampleListRequest>(API_ENDPOINTS.EXAMPLE.LIST, params),

  detail: (id: number) => get<GetExampleDetailResponse>(API_ENDPOINTS.EXAMPLE.DETAIL(id)),

  create: (data: PostExampleRequest) =>
    post<PostExampleResponse, PostExampleRequest>(API_ENDPOINTS.EXAMPLE.CREATE, data),

  update: (id: number, data: PatchExampleRequest) =>
    patch<PatchExampleResponse, PatchExampleRequest>(API_ENDPOINTS.EXAMPLE.UPDATE(id), data),

  delete: (data: DeleteExampleRequest) =>
    del<DeleteExampleResponse, DeleteExampleRequest>(API_ENDPOINTS.EXAMPLE.DELETE, data),
};
