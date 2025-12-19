import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        location.pathname === to ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-semibold">
              CT
            </div>
            <div>
              <div className="text-base font-semibold">Collaborative Tasks</div>
              <div className="text-xs text-slate-500">Move work forward together</div>
            </div>
            <nav className="ml-6 flex items-center gap-2">
              {navItem('/', 'Dashboard')}
              {navItem('/tasks', 'Tasks')}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{user?.name}</div>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
