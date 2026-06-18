import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import Badge from '../ui/Badge';

export default function Navbar() {
  const { isAuthenticated, user, activeRole, roles, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleBadgeVariant = (role: string) => {
    const map: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple'> = {
      Admin: 'red',
      Seller: 'blue',
      Buyer: 'green',
      Driver: 'yellow',
    };
    return map[role] || 'gray';
  };

  const getDashboardLink = () => {
    if (!activeRole) return '/role-selection';
    const links: Record<string, string> = {
      Admin: '/dashboard/admin',
      Seller: '/dashboard/seller',
      Buyer: '/dashboard/buyer',
      Driver: '/dashboard/driver',
    };
    return links[activeRole] || '/role-selection';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              SEAPEDIA
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                Products
              </Link>
              <Link to="/reviews" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                Reviews
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {activeRole && (
                  <Link
                    to={getDashboardLink()}
                    className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {activeRole && (
                  <Badge variant={roleBadgeVariant(activeRole)} size="sm">
                    {activeRole}
                  </Badge>
                )}
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {user?.fullName || user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex pb-3 gap-4">
          <Link to="/products" className="text-sm text-gray-600">Products</Link>
          <Link to="/reviews" className="text-sm text-gray-600">Reviews</Link>
        </div>
      </div>
    </nav>
  );
}
