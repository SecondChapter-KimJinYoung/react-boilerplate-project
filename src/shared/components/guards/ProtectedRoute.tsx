import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import { useAuthStore } from '@/shared/stores/auth.store';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
