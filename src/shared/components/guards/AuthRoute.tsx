import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import { useAuthStore } from '@/shared/stores/auth.store';

const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
