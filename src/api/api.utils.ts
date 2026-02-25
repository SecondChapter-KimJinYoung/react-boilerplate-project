import axios from 'axios';

import { showToast } from '@/shared/utils/toast.utils';

import { API_MESSAGES, HTTP_STATUS } from './api.constants';
import type { ApiError } from './api.types';

type ErrorPayload = ApiError<unknown>;

type HandleErrorOptions = {
  fallbackMessage?: string;
  silent?: boolean;
};

const NETWORK_ERROR_MESSAGE = API_MESSAGES.NETWORK.CONNECTION_ERROR;
const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.';

export const getErrorMessageByStatusCode = (statusCode: number): string => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return API_MESSAGES.ERROR.BAD_REQUEST;
    case HTTP_STATUS.UNAUTHORIZED:
      return API_MESSAGES.ERROR.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return API_MESSAGES.ERROR.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return API_MESSAGES.ERROR.NOT_FOUND;
    case HTTP_STATUS.METHOD_NOT_ALLOWED:
      return API_MESSAGES.ERROR.METHOD_NOT_ALLOWED;
    case HTTP_STATUS.REQUEST_TIMEOUT:
      return API_MESSAGES.ERROR.REQUEST_TIMEOUT;
    case HTTP_STATUS.CONFLICT:
      return API_MESSAGES.ERROR.CONFLICT;
    case HTTP_STATUS.PAYLOAD_TOO_LARGE:
      return API_MESSAGES.ERROR.PAYLOAD_TOO_LARGE;
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return API_MESSAGES.ERROR.VALIDATION_FAILED;
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return API_MESSAGES.ERROR.TOO_MANY_REQUESTS;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return API_MESSAGES.SERVER_ERROR.INTERNAL;
    case HTTP_STATUS.BAD_GATEWAY:
      return API_MESSAGES.SERVER_ERROR.BAD_GATEWAY;
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return API_MESSAGES.SERVER_ERROR.SERVICE_UNAVAILABLE;
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return API_MESSAGES.SERVER_ERROR.GATEWAY_TIMEOUT;
    default:
      return API_MESSAGES.SERVER_ERROR.INTERNAL;
  }
};

export const handleError = (error: unknown, options?: HandleErrorOptions) => {
  const { fallbackMessage, silent } = options ?? {};

  let message = fallbackMessage ?? UNKNOWN_ERROR_MESSAGE;

  if (axios.isAxiosError<ErrorPayload>(error)) {
    if (!navigator.onLine) {
      message = API_MESSAGES.NETWORK.OFFLINE;
    } else if (error.code === 'ECONNABORTED') {
      message = API_MESSAGES.NETWORK.TIMEOUT;
    } else if (error.message === 'Network Error') {
      message = NETWORK_ERROR_MESSAGE;
    } else {
      message = getErrorMessageByStatusCode(
        error.response?.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  if (!silent) {
    showToast({ message, variant: 'error' });
  }

  return message;
};
