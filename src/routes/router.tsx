/**
 * 라우터 설정
 *
 * React Router를 사용한 중첩 라우트 설정
 * 관리 페이지들은 DashboardLayout 하위에 중첩됩니다.
 * 페이지 컴포넌트는 lazy loading으로 코드 스플리팅을 적용합니다.
 */

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import { lazyImport } from '@/shared/utils/lazy';

// --------------- Example (예시, 개발 모드 전용) ---------------
const ExampleListPage = lazyImport(() => import('@/features/example/components/ExampleList'));
const ExampleDetailPage = lazyImport(() => import('@/features/example/components/ExampleDetail'));
const ExampleCreatePage = lazyImport(() => import('@/features/example/components/ExampleCreate'));
const ExampleEditPage = lazyImport(() => import('@/features/example/components/ExampleUpdate'));

// --------------- 라우터 설정 ---------------
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },

  // ============ Example (개발 모드 전용) ============
  ...(import.meta.env.DEV
    ? [
        {
          path: 'example',
          children: [
            {
              index: true,
              element: <ExampleListPage />,
            },
            {
              path: 'detail/:id',
              element: <ExampleDetailPage />,
            },
            {
              path: 'create',
              element: <ExampleCreatePage />,
            },
            {
              path: 'edit/:id',
              element: <ExampleEditPage />,
            },
          ],
        },
      ]
    : []),
]);

// 라우터 컴포넌트
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
