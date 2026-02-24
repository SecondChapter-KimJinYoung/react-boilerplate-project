/**
 * 비인증 전용 라우트 가드
 *
 * 이미 로그인된 사용자는 대시보드로 리다이렉트합니다.
 * 로그인, 회원가입 등 인증 페이지의 상위에 배치합니다.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth.store';
import { ROUTES } from '@/routes/routes';

const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
