import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ROLE_OPTIONS = [
  {
    value: 'Buyer',
    label: 'Buyer',
    description: 'Browse and purchase products from various stores.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    value: 'Seller',
    label: 'Seller',
    description: 'Create a store and sell maritime products.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    value: 'Driver',
    label: 'Driver',
    description: 'Deliver orders and earn on your schedule.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
      </svg>
    ),
  },
];

const benefits = [
  'Choose one or more roles that fit you',
  'Switch roles anytime after registration',
  'All roles share a single account and wallet',
];

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errors: Record<string, string> = {};
    if (!form.username.trim()) errors.username = 'Username is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.password) errors.password = 'Password is required';
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (selectedRoles.length === 0) errors.roles = 'Select at least one role';

    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});

    try {
      await register({
        username: form.username,
        email: form.email,
        fullName: form.fullName,
        phone: form.phone || undefined,
        password: form.password,
        roles: selectedRoles,
      });
      const { activeRole, roles } = useAuthStore.getState();
      if (!activeRole && roles.length > 1) {
        navigate('/role-selection');
      } else {
        navigate('/');
      }
    } catch {
      // error set in store
    }
  };

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9f9ff] flex items-start lg:items-center justify-center px-4 py-8">
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
              Join SEAPEDIA
            </h1>
            <p className="text-primary-100 text-sm leading-relaxed mb-8">
              Create your account and start selling, shopping, or delivering today.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-200 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-primary-100">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 p-8 lg:p-10">
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1 mb-8">
              Fill in your details to get started.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Username" value={form.username} onChange={updateField('username')} error={formErrors.username} placeholder="Choose a username" />
                <Input label="Email" type="email" value={form.email} onChange={updateField('email')} error={formErrors.email} placeholder="your@email.com" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={form.fullName} onChange={updateField('fullName')} error={formErrors.fullName} placeholder="Your full name" />
                <Input label="Phone (optional)" value={form.phone} onChange={updateField('phone')} placeholder="08123456789" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Password" type="password" value={form.password} onChange={updateField('password')} error={formErrors.password} placeholder="Min 6 characters" />
                <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} error={formErrors.confirmPassword} placeholder="Repeat password" />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your roles
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((role) => {
                    const selected = selectedRoles.includes(role.value);
                    return (
                      <label
                        key={role.value}
                        className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selected
                            ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRole(role.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                            selected
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {role.icon}
                        </div>
                        <p className={`text-sm font-semibold ${selected ? 'text-primary-700' : 'text-gray-900'}`}>
                          {role.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {role.description}
                        </p>
                        {selected && (
                          <svg className="absolute top-2 right-2 w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    );
                  })}
                </div>
                {formErrors.roles && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.roles}</p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isLoading} className="w-full">
                Create Account
              </Button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
