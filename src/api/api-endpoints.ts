const HEALTH_CHECK_PATH = '/api/health';

export const API_ENDPOINTS = {
  EXAMPLE: {
    LIST: `/example`,
    CREATE: `/example`,
    DELETE: `/example`,
    UPDATE: (id: number) => `/example/${id}`,
    DETAIL: (id: number) => `/example/detail/${id}`,
  },

  STATUS: {
    CHECK: HEALTH_CHECK_PATH,
  },

  COMMON: {
    FILE_DOWNLOAD: `/common/file/download`,
    FILE_UPLOAD: `/common/file/upload`,
    FILE_UPLOAD_URL: `/common/file/upload/url`,
  },

  AUTH: {
    FIND_ACCOUNT: `/auth/manager/find/account`,
    FIND_PASSWORD: `/auth/manager/find/password`,
    LOGIN: `/auth/manager/login`,
    RESET_PASSWORD: `/auth/manager/reset/password`,
    REFRESH: `/auth/manager/reset/token`,
    SIGNUP: `/auth/manager/sign`,
    VERIFICATION_SEND: `/auth/verification/send`,
  },
} as const;
