import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface ProtectedRouteProps {
  roles?: string[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, activeRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    if (!activeRole || !roles.includes(activeRole)) {
      return <Navigate to="/role-selection" replace />;
    }
  }

  return <Outlet />;
}
