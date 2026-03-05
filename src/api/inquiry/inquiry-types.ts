import type {
  ApiResponse,
  DeleteResponse,
  ListResponse,
  PatchResponse,
  PostResponse,
} from '../api-types';

export interface InquiryItem {
  id: number;
  inquirerId: number;
  title: string;
  content: string;
  answer: string | null;
  isAnswered: boolean;
  inquirer: { id: number; email: string } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetInquiryListRequest {
  page?: number;
  size?: number;
  sort?: string;
  orderBy?: 'ASC' | 'DESC';
  inquirerId?: number;
  isAnswered?: boolean;
  keyword?: string;
}

export interface PostInquiryRequest {
  title: string;
  content: string;
}

export interface PatchInquiryRequest {
  title?: string;
  content?: string;
}

export type DeleteInquiryRequest = {
  ids: number[];
};

export interface AnswerInquiryRequest {
  answer: string;
}

export type GetInquiryListResponse = ListResponse<InquiryItem>;
export type GetInquiryDetailResponse = ApiResponse<InquiryItem>;
export type GetInquiryMyListResponse = ApiResponse<InquiryItem[]>;
export type PostInquiryResponse = PostResponse;
export type PatchInquiryResponse = PatchResponse;
export type DeleteInquiryResponse = DeleteResponse;
export type PostInquiryAnswerResponse = PostResponse;
export type PatchInquiryAnswerResponse = PatchResponse;
