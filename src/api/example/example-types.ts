import type {
  ApiResponse,
  DeleteResponse,
  ListResponse,
  PatchResponse,
  PostResponse,
} from '../api-types';

// ── Entity ──

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

// ── Request ──

export interface GetExampleListRequest {
  page?: number;
  size?: number;
  sort?: string;
  orderBy?: 'ASC' | 'DESC';
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

export interface DeleteExampleRequest {
  ids: number[];
}

// ── Response ──

export type GetExampleListResponse = ListResponse<ExampleItem>;
export type GetExampleDetailResponse = ApiResponse<ExampleItem>;
export type PostExampleResponse = PostResponse;
export type PatchExampleResponse = PatchResponse;
export type DeleteExampleResponse = DeleteResponse;
