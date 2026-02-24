/**
 * 인증 필수 라우트 가드
 *
 * 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트합니다.
 * DashboardLayout 등 인증이 필요한 라우트의 상위에 배치합니다.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth.store';
import { ROUTES } from '@/routes/routes';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
