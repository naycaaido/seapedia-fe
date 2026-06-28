import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ALL_ROLES = ['Buyer', 'Seller', 'Driver'];

const ROLE_INFO: Record<string, { description: string }> = {
  Admin: { description: 'Monitor and manage the marketplace' },
  Seller: { description: 'Manage your store and products' },
  Buyer: { description: 'Browse and purchase products' },
  Driver: { description: 'Deliver orders and earn' },
};

const ROLE_REDIRECTS: Record<string, string> = {
  Admin: '/dashboard/admin',
  Seller: '/seller/store',
  Buyer: '/products',
  Driver: '/dashboard/driver',
};

const ADD_ROLE_REDIRECTS: Record<string, string> = {
  Seller: '/seller/store',
  Buyer: '/products',
  Driver: '/dashboard/driver',
};

export default function RoleSelectionPage() {
  const { roles, activeRole, selectRole, addRole, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [actionRole, setActionRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nonAdminRoles = roles.filter((r) => r !== 'Admin');
  const displayRoles = nonAdminRoles.length > 0 ? nonAdminRoles : roles;

  const missingRoles = ALL_ROLES.filter((r) => !roles.includes(r));

  const handleSelect = async (role: string) => {
    setActionRole(role);
    setError(null);
    try {
      await selectRole(role);
      navigate(ROLE_REDIRECTS[role] || '/');
    } catch {
      setError('Failed to switch role. Please try again.');
    } finally {
      setActionRole(null);
    }
  };

  const handleAddRole = async (role: string) => {
    setActionRole(role);
    setError(null);
    try {
      await addRole(role);
      await selectRole(role);
      navigate(ADD_ROLE_REDIRECTS[role] || '/');
    } catch (err: any) {
      setError(err?.message || `Failed to add ${role} role. Please try again.`);
    } finally {
      setActionRole(null);
    }
  };

  return (
    <div className="bg-[#f9f9ff] min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Roles</h1>
        <p className="text-gray-500 text-center mb-6">
          Manage your roles and access. Switch between existing roles or add new ones.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-6" role="alert">
            {error}
          </div>
        )}

        {/* Your Roles */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Roles</h2>
          <div className="space-y-2">
            {displayRoles.map((role) => {
              const info = ROLE_INFO[role] || { description: '' };
              const isActive = role === activeRole;
              const isBusy = actionRole !== null;
              return (
                <button
                  key={role}
                  onClick={() => handleSelect(role)}
                  disabled={isActive || isBusy}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-primary-500 bg-primary-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{role}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                    {isActive && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Active</span>
                    )}
                    {!isActive && (
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Roles */}
        {missingRoles.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Available Roles</h2>
            <div className="space-y-2">
              {missingRoles.map((role) => {
                const info = ROLE_INFO[role] || { description: '' };
                const isBusy = actionRole !== null;
                const isThisBusy = actionRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleAddRole(role)}
                    disabled={isBusy}
                    className={`w-full text-left p-4 rounded-lg border-2 border-dashed transition-colors ${
                      isThisBusy
                        ? 'border-primary-300 bg-primary-50 cursor-wait'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <svg className="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {isThisBusy ? `Adding ${role}...` : `Become ${role}`}
                        </p>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                      {isThisBusy && (
                        <svg className="w-5 h-5 text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeRole && (
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Continue to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
