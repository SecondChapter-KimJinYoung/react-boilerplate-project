/**
 * 인증 필수 라우트 가드
 *
 * 액세스 토큰이 없으면 로그인 페이지로 리다이렉트합니다.
 * DashboardLayout 등 인증이 필요한 라우트의 상위에 배치합니다.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { STORAGE_KEYS } from '@/api/api.constants';
import { ROUTES } from '@/routes/routes';

const ProtectedRoute = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
