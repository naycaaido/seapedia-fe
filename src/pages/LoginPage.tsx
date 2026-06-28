import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const benefits = [
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Transaksi lebih terarah',
    description: 'From browsing to delivery, everything is tracked end-to-end.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Wallet & pesanan tercatat',
    description: 'Your wallet balance and order history are always in one place.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Akses sesuai role',
    description: 'Buyer, Seller, or Driver — each role gets a tailored experience.',
  },
];

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});

    try {
      await login({ username, password });
      const { activeRole, roles } = useAuthStore.getState();
      if (!activeRole && roles.length > 1) {
        navigate('/role-selection');
      } else {
        navigate('/products');
      }
    } catch {
      // error is set in store
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9f9ff] flex items-center justify-center px-4 py-8">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Brand Panel */}
        <div className="hidden lg:flex lg:w-[420px] bg-gradient-to-br from-primary-600 to-primary-800 p-8 lg:p-10 flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2" />
                <path d="M16 8l7 4v8l-7 4-7-4v-8l7-4z" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
              <span className="text-xl font-bold text-white">SEAPEDIA</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-3">
              Welcome back
            </h1>
            <p className="text-primary-100 text-sm leading-relaxed mb-8">
              Kelola belanja, toko, dan pengiriman dalam satu marketplace terpadu.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 shrink-0">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-primary-200 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900">Login to your account</h2>
            <p className="text-sm text-gray-500 mt-1 mb-8">
              Continue managing your SEAPEDIA activity.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={formErrors.username}
                placeholder="Enter your username"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
                placeholder="Enter your password"
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Login
              </Button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
