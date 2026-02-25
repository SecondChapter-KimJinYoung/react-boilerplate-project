import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import { SIDEBAR_NAV_ITEMS } from '@/shared/constants/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';
import { cn } from '@/shared/utils/cn';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    void navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center px-6 text-lg font-bold text-gray-900">
          {import.meta.env.VITE_APP_NAME || '프로젝트'}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {SIDEBAR_NAV_ITEMS.filter((item) => !item.devOnly || import.meta.env.DEV).map((item) => (
            <SidebarLink key={item.to} to={item.to}>
              {item.label}
            </SidebarLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-end border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">{user.name}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

const SidebarLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        )
      }
    >
      {children}
    </NavLink>
  );
};
