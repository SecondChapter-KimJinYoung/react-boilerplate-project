import axios from 'axios';
import { API_MESSAGES, HTTP_STATUS } from './api.constants';
import type { ApiError } from './api.types';
import { showToast } from '@/shared/utils/toast.utils';
import { getErrorMessageByStatusCode } from './api.messages';

type ErrorPayload = ApiError<unknown>;

type HandleErrorOptions = {
  fallbackMessage?: string;
  silent?: boolean;
};

const NETWORK_ERROR_MESSAGE = API_MESSAGES.NETWORK.CONNECTION_ERROR;
const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.';

// 실패 처리
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

// 성공 처리
export const handleSuccess = (message: string) => {
  showToast({ message, variant: 'success' });
};

// 커스텀 오류 처리
export const handleCustomError = (message: string) => {
  showToast({ message, variant: 'error' });
};
