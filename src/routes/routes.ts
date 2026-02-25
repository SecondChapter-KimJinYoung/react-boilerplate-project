export const ROUTES = {
  EXAMPLE: {
    LIST: '/example',
    DETAIL: (id: number) => `/example/${id}`,
    CREATE: '/example/create',
    EDIT: (id: number) => `/example/${id}/edit`,
  },

  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    SIGNUP_SUCCESS: '/auth/signup/success',
    FIND_ID: '/auth/find/id',
    FIND_PASSWORD: '/auth/find/password',
  },

  DASHBOARD: '/dashboard',
} as const;
