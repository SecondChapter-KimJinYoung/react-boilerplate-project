import { del, get, patch, post } from '@/api/api';
import { API_ENDPOINTS } from '@/api/api-endpoints';

import type {
  AnswerInquiryRequest,
  DeleteInquiryRequest,
  DeleteInquiryResponse,
  GetInquiryDetailResponse,
  GetInquiryListRequest,
  GetInquiryListResponse,
  GetInquiryMyListResponse,
  PatchInquiryAnswerResponse,
  PatchInquiryRequest,
  PatchInquiryResponse,
  PostInquiryAnswerResponse,
  PostInquiryRequest,
  PostInquiryResponse,
} from './inquiry-types';

export const inquiryApi = {
  list: (params?: GetInquiryListRequest) =>
    get<GetInquiryListResponse, GetInquiryListRequest>(API_ENDPOINTS.INQUIRY.LIST, params),

  myList: () => get<GetInquiryMyListResponse>(API_ENDPOINTS.INQUIRY.MY_LIST),

  detail: (id: number) => get<GetInquiryDetailResponse>(API_ENDPOINTS.INQUIRY.DETAIL(id)),

  create: (data: PostInquiryRequest) =>
    post<PostInquiryResponse, PostInquiryRequest>(API_ENDPOINTS.INQUIRY.CREATE, data),

  update: (id: number, data: PatchInquiryRequest) =>
    patch<PatchInquiryResponse, PatchInquiryRequest>(API_ENDPOINTS.INQUIRY.UPDATE(id), data),

  delete: (data: DeleteInquiryRequest) =>
    del<DeleteInquiryResponse, DeleteInquiryRequest>(API_ENDPOINTS.INQUIRY.DELETE, data),

  answerCreate: (id: number, data: AnswerInquiryRequest) =>
    post<PostInquiryAnswerResponse, AnswerInquiryRequest>(
      API_ENDPOINTS.INQUIRY.ANSWER_CREATE(id),
      data,
    ),

  answerUpdate: (id: number, data: AnswerInquiryRequest) =>
    patch<PatchInquiryAnswerResponse, AnswerInquiryRequest>(
      API_ENDPOINTS.INQUIRY.ANSWER_UPDATE(id),
      data,
    ),
};
