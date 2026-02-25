import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">
            {import.meta.env.VITE_APP_NAME || '프로젝트'}
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
