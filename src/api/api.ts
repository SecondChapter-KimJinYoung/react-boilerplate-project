import { AxiosError } from 'axios';

import type { ErrorResponseData, ExtendedAxiosRequestConfig } from './api-client';
import { apiClient, getNetworkErrorMessage } from './api-client';
import { HEADERS } from './api-constants';

export interface ApiRequestOptions {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  basicAuth?: {
    username: string;
    password: string;
  };
}

const DEFAULT_ERROR_MESSAGE = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors: string[];

  constructor(statusCode: number, message: string, code: string, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data as ErrorResponseData | undefined;

    if (error.message === 'Network Error' || !error.response) {
      const networkMessage = getNetworkErrorMessage(error);
      return new ApiError(0, networkMessage, 'NETWORK_ERROR');
    }

    const message = responseData?.message || DEFAULT_ERROR_MESSAGE;
    const code = responseData?.code || 'UNKNOWN_ERROR';
    const errors = responseData?.errors || [];
    return new ApiError(statusCode, message, code, errors);
  }

  return new ApiError(500, DEFAULT_ERROR_MESSAGE, 'UNKNOWN_ERROR');
};

export const get = async <TResponse, TParams = Record<string, unknown>>(
  url: string,
  params?: TParams,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.get<TResponse>(url, {
      params: params as unknown,
      skipAuth: options?.skipAuth,
      skipErrorToast: options?.skipErrorToast,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const post = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    // FormData인 경우 Content-Type을 제거하여 axios가 자동으로 boundary를 설정하도록 함
    const isFormData = data instanceof FormData;
    const response = await apiClient.post<TResponse>(
      url,
      data as unknown,
      {
        headers: isFormData
          ? {
              [HEADERS.CONTENT_TYPE]: undefined,
            }
          : undefined,
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
        basicAuth: options?.basicAuth,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const patch = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.patch<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const put = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.put<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
        skipErrorToast: options?.skipErrorToast,
      } as ExtendedAxiosRequestConfig,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const del = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions,
): Promise<TResponse> => {
  try {
    const response = await apiClient.delete<TResponse>(url, {
      data: data as unknown,
      skipAuth: options?.skipAuth,
      skipErrorToast: options?.skipErrorToast,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
