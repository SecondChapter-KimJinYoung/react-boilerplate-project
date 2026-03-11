export interface ApiResponse<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: null | string[];
  payload: T;
}

export interface ListResponse<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: null | string[];
  payload: {
    list: T[];
    totalCount: number | null;
  };
}

export type PostResponse = ApiResponse<{ id: number }>;
export type PatchResponse = ApiResponse<{ id: number }>;
export type DeleteResponse = ApiResponse<{ deleted: number }>;
