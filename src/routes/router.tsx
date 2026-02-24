/**
 * 라우터 설정
 *
 * React Router를 사용한 중첩 라우트 설정
 * - 인증 페이지: AuthRoute → AuthLayout 하위
 * - 대시보드 페이지: ProtectedRoute → DashboardLayout 하위
 * - 페이지 컴포넌트는 lazy loading으로 코드 스플리팅을 적용합니다.
 */

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import { lazyImport } from '@/shared/utils/lazy';

// --------------- Layouts & Guards (구조적 컴포넌트 — lazy 안 함) ---------------
import AuthLayout from '@/shared/components/layouts/AuthLayout';
import DashboardLayout from '@/shared/components/layouts/DashboardLayout';
import ProtectedRoute from '@/shared/components/guards/ProtectedRoute';
import AuthRoute from '@/shared/components/guards/AuthRoute';

// --------------- Auth Pages ---------------
const LoginPage = lazyImport(() => import('@/features/auth/pages/LoginPage'));
const NotFoundPage = lazyImport(() => import('@/features/auth/pages/NotFoundPage'));

// --------------- Example (예시, 개발 모드 전용) ---------------
const ExampleListPage = lazyImport(() => import('@/features/example/pages/ExampleListPage'));
const ExampleDetailPage = lazyImport(() => import('@/features/example/pages/ExampleDetailPage'));
const ExampleCreatePage = lazyImport(() => import('@/features/example/pages/ExampleCreatePage'));
const ExampleEditPage = lazyImport(() => import('@/features/example/pages/ExampleEditPage'));

// --------------- 라우터 설정 ---------------
const router = createBrowserRouter([
  // Root → 로그인으로 리다이렉트
  {
    path: '/',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },

  // ============ 인증 페이지 (비로그인 전용) ============
  {
    element: <AuthRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'auth/login',
            element: <LoginPage />,
          },
          // TODO: 필요한 인증 페이지를 추가하세요
          // { path: 'auth/signup', element: <SignupPage /> },
          // { path: 'auth/signup/success', element: <SignupSuccessPage /> },
          // { path: 'auth/find/id', element: <FindIdPage /> },
          // { path: 'auth/find/password', element: <FindPasswordPage /> },
        ],
      },
    ],
  },

  // ============ 대시보드 (인증 필수) ============
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <div className="text-sm text-gray-500">대시보드 페이지를 구현해주세요.</div>,
          },

          // ============ Example (개발 모드 전용) ============
          ...(import.meta.env.DEV
            ? [
                {
                  path: 'example',
                  children: [
                    { index: true, element: <ExampleListPage /> },
                    { path: 'create', element: <ExampleCreatePage /> },
                    { path: ':id', element: <ExampleDetailPage /> },
                    { path: ':id/edit', element: <ExampleEditPage /> },
                  ],
                },
              ]
            : []),
        ],
      },
    ],
  },

  // ============ 404 ============
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// 라우터 컴포넌트
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
