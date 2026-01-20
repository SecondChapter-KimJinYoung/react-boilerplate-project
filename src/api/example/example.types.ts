/**
 * Example API 타입 정의
 *
 * 패턴:
 * 1. Entities: 서버에서 반환하는 실제 데이터 구조
 * 2. Requests: API 요청 파라미터 타입
 * 3. Responses: API 응답 타입 (ListResponse, ApiResponse 사용)
 */

import type {
  ApiResponse,
  ListResponse,
  PostResponse,
  PatchResponse,
  DeleteResponse,
} from '../api.types';

// ============ Entities ============
export interface ExampleItem {
  id: number;
  name: string;
  userId: string;
  email: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ============ Requests ============
export interface GetExampleListRequest {
  page?: number;
  size?: number;
  sort?: string;
  orderBy?: string;
  keyword?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PostExampleRequest {
  name: string;
  description: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PatchExampleRequest {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type DeleteExampleRequest = {
  ids: number[];
};

// ============ Responses ============
export type GetExampleListResponse = ListResponse<ExampleItem>;
export type GetExampleDetailResponse = ApiResponse<ExampleItem>;
export type PostExampleResponse = PostResponse;
export type PatchExampleResponse = PatchResponse;
export type DeleteExampleResponse = DeleteResponse;
