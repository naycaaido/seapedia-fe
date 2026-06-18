import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useCart } from '../../hooks/useBuyer';
import Badge from '../ui/Badge';

export default function Navbar() {
  const { isAuthenticated, user, activeRole, roles, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: cart } = useCart({ enabled: isAuthenticated && activeRole === 'Buyer' });

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

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
                {activeRole === 'Buyer' && (
                  <Link
                    to="/buyer/cart"
                    className="relative text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
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
