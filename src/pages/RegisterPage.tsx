import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ROLE_OPTIONS = [
  { value: 'Buyer', label: 'Buyer', description: 'Browse and purchase products' },
  { value: 'Seller', label: 'Seller', description: 'Sell products in your own store' },
  { value: 'Driver', label: 'Driver', description: 'Deliver orders to customers' },
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={form.username} onChange={updateField('username')} error={formErrors.username} placeholder="Choose a username" />
          <Input label="Email" type="email" value={form.email} onChange={updateField('email')} error={formErrors.email} placeholder="your@email.com" />
          <Input label="Full Name" value={form.fullName} onChange={updateField('fullName')} error={formErrors.fullName} placeholder="Your full name" />
          <Input label="Phone (optional)" value={form.phone} onChange={updateField('phone')} placeholder="08123456789" />
          <Input label="Password" type="password" value={form.password} onChange={updateField('password')} error={formErrors.password} placeholder="Min 6 characters" />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} error={formErrors.confirmPassword} placeholder="Repeat password" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles</label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoles.includes(role.value)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {formErrors.roles && <p className="mt-1 text-sm text-red-600">{formErrors.roles}</p>}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" loading={isLoading} className="w-full">
            Register
          </Button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700">Login</Link>
        </p>
      </Card>
    </div>
  );
}
