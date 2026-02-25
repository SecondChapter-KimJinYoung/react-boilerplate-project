import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import AuthRoute from '@/shared/components/guards/AuthRoute';
import ProtectedRoute from '@/shared/components/guards/ProtectedRoute';
import AuthLayout from '@/shared/components/templates/AuthLayout';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { lazyImport } from '@/shared/utils/lazy';

import { ROUTES } from './routes';

const LoginPage = lazyImport(() => import('@/features/auth/pages/LoginPage'));
const NotFoundPage = lazyImport(() => import('@/features/auth/pages/NotFoundPage'));

const ExampleListPage = lazyImport(() => import('@/features/example/pages/ExampleListPage'));
const ExampleDetailPage = lazyImport(() => import('@/features/example/pages/ExampleDetailPage'));
const ExampleCreatePage = lazyImport(() => import('@/features/example/pages/ExampleCreatePage'));
const ExampleEditPage = lazyImport(() => import('@/features/example/pages/ExampleEditPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },

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
          // TODO: 필요한 인증 페이지를 추가하세요 (signup, find-id, find-password 등)
        ],
      },
    ],
  },

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

  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
