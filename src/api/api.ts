import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';

import { base64ToBlob, getMimeTypeFromFilename, sanitizeFilename } from '@/shared/utils/file';

import type { ErrorResponseData, ExtendedAxiosRequestConfig } from './api.client';
import { apiClient, getNetworkErrorMessage } from './api.client';
import { API_MESSAGES, HEADERS, HTTP_STATUS } from './api.constants';
import type { ApiResponse } from './api.types';
import { getErrorMessageByStatusCode, handleError } from './api.utils';

export interface ApiRequestOptions {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  basicAuth?: {
    username: string;
    password: string;
  };
}

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
    const statusCode = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const responseData = error.response?.data as ErrorResponseData | undefined;

    if (error.message === 'Network Error' || !error.response) {
      const networkMessage = getNetworkErrorMessage(error);
      handleError(error, { fallbackMessage: networkMessage, silent: true });
      return new ApiError(0, networkMessage, 'NETWORK_ERROR');
    }

    const message = responseData?.message || getErrorMessageByStatusCode(statusCode);
    const code = responseData?.code || 'UNKNOWN_ERROR';
    const errors = responseData?.errors || [];
    handleError(error, { fallbackMessage: message, silent: true });
    return new ApiError(statusCode, message, code, errors);
  }

  handleError(error, { fallbackMessage: API_MESSAGES.SERVER_ERROR.INTERNAL, silent: true });
  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.SERVER_ERROR.INTERNAL,
    'UNKNOWN_ERROR',
  );
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

export const uploadFile = async <T>(
  url: string,
  file: File,
  path?: string,
  options?: ApiRequestOptions & {
    additionalFields?: Record<string, string>;
  },
): Promise<T> => {
  try {
    if (!file.type || file.type === 'application/octet-stream') {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = [
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
        'heic',
        'mp4',
        'webm',
        'ogg',
        'mov',
        'avi',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
      ];
      if (!ext || !allowedExtensions.includes(ext)) {
        throw new Error('허용되지 않은 파일 형식입니다.');
      }
    }

    // XSS/Path Traversal 방지
    const sanitizedPath = path ? sanitizeFilename(path, 'uploads') : undefined;

    const formData = new FormData();
    formData.append('file', file);
    if (sanitizedPath) {
      formData.append('path', sanitizedPath);
    }
    if (options?.additionalFields) {
      Object.entries(options.additionalFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return post<T>(url, formData, {
      skipAuth: options?.skipAuth,
    });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const downloadFileAsBlob = async <TData = unknown>(
  url: string,
  data: TData,
  filename?: string,
  options?: ApiRequestOptions,
): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(
      url,
      data as unknown,
      {
        timeout: 60000,
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig,
    );

    const base64String = response.data.payload;
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('서버에서 base64 데이터를 받지 못했습니다.');
    }

    const safeFilename = sanitizeFilename(filename, 'download');
    const mimeType = getMimeTypeFromFilename(safeFilename) || 'application/octet-stream';
    const blob = base64ToBlob(base64String, mimeType);

    if (import.meta.env.DEV) {
      console.warn('Blob created:', { type: blob.type, size: blob.size, filename: safeFilename });
    }

    return { ...response, data: blob } as AxiosResponse<Blob>;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const downloadExcel = async <TData = unknown>(
  url: string,
  data: TData,
  filename: string = 'export.xlsx',
  options?: ApiRequestOptions,
): Promise<void> => {
  try {
    const response = await apiClient.post<Blob>(
      url,
      data as unknown,
      {
        responseType: 'blob',
        timeout: 60000,
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig,
    );

    const safeFilename = sanitizeFilename(filename, 'download');
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url_blob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_blob;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_blob);
  } catch (error) {
    throw handleApiError(error);
  }
};
