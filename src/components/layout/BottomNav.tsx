import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const EXCLUDED_ROUTES = ['/', '/login', '/register', '/role-selection', '/buyer/checkout'];

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
  match: (path: string) => boolean;
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function BottomNav() {
  const { isAuthenticated, activeRole } = useAuthStore();
  const location = useLocation();

  const shouldShow = isAuthenticated && !EXCLUDED_ROUTES.includes(location.pathname);

  if (!shouldShow) return null;

  const getDashboardLink = () => {
    const links: Record<string, string> = {
      Admin: '/dashboard/admin',
      Seller: '/dashboard/seller',
      Buyer: '/dashboard/buyer',
      Driver: '/dashboard/driver',
    };
    return (activeRole && links[activeRole]) || '/role-selection';
  };

  const navItems: NavItem[] = [];

  navItems.push({
    label: 'Products',
    href: '/products',
    icon: <ProductsIcon />,
    match: (path) => path.startsWith('/products'),
  });

  if (activeRole === 'Buyer') {
    navItems.push({
      label: 'Cart',
      href: '/buyer/cart',
      icon: <CartIcon />,
      match: (path) => path.startsWith('/buyer/cart'),
    });
    navItems.push({
      label: 'Orders',
      href: '/buyer/orders',
      icon: <OrdersIcon />,
      match: (path) => path.startsWith('/buyer/orders'),
    });
  }

  navItems.push({
    label: 'Dashboard',
    href: getDashboardLink(),
    icon: <DashboardIcon />,
    match: (path) => path === getDashboardLink(),
  });

  navItems.push({
    label: 'Profile',
    href: '/profile',
    icon: <ProfileIcon />,
    match: (path) => path === '/profile',
  });

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
