import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const EXCLUDED_BOTTOM_NAV_ROUTES = ['/', '/login', '/register', '/role-selection', '/buyer/checkout'];

export default function AppLayout() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore();
  const showBottomNav = isAuthenticated && !EXCLUDED_BOTTOM_NAV_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 mt-16 ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
