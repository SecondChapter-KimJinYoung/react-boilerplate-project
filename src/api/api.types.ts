/**
 * API 공통 타입 정의
 *
 * 모든 API에서 공통으로 사용하거나 여러 API 간에 공유되는 타입들을 정의합니다.
 *
 * - ApiResponse, ListResponse, IdResponsePayload: 모든 프로젝트에서 공통으로 사용하는 기본 응답 구조
 * - 그 외 타입들: 프로젝트별로 유동적으로 변경될 수 있는 공유 타입
 */

// 기본 API 응답
export interface ApiResponse<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: null | string[];
  payload: T;
}

// 리스트 응답
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

// 에러 응답
export interface ApiError<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: string[];
  payload: T;
}

// 생성, 수정, 삭제 응답 타입 (HTTP 메서드 방식, id만 반환하는 경우)
export type PostResponse = ApiResponse<{ id: number }>; // POST 요청 응답 (생성)
export type PutResponse = ApiResponse<{ id: number }>; // PUT 요청 응답 (수정)
export type PatchResponse = ApiResponse<{ id: number }>; // PATCH 요청 응답 (수정)
export type DeleteResponse = ApiResponse<{ deleted: number }>; // DELETE 요청 응답 (삭제)
