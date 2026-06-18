import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ROLE_INFO: Record<string, { description: string; icon: string }> = {
  Admin: { description: 'Monitor and manage the marketplace', icon: '&#128272;' },
  Seller: { description: 'Manage your store and products', icon: '&#128230;' },
  Buyer: { description: 'Browse and purchase products', icon: '&#128722;' },
  Driver: { description: 'Deliver orders and earn', icon: '&#128666;' },
};

export default function RoleSelectionPage() {
  const { roles, activeRole, selectRole, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSelect = async (role: string) => {
    try {
      await selectRole(role);
      const links: Record<string, string> = {
        Admin: '/dashboard/admin',
        Seller: '/dashboard/seller',
        Buyer: '/dashboard/buyer',
        Driver: '/dashboard/driver',
      };
      navigate(links[role] || '/');
    } catch {
      // error handled in store
    }
  };

  const nonAdminRoles = roles.filter((r) => r !== 'Admin');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Select Your Role</h1>
        <p className="text-gray-500 text-center mb-6">
          {activeRole
            ? `Currently active: ${activeRole}. Switch to another role?`
            : 'You have multiple roles. Choose which one to use for this session.'}
        </p>

        <div className="space-y-3">
          {(nonAdminRoles.length > 0 ? nonAdminRoles : roles).map((role) => {
            const info = ROLE_INFO[role] || { description: '', icon: '&#128100;' };
            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                disabled={isLoading || role === activeRole}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  role === activeRole
                    ? 'border-primary-500 bg-primary-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl" dangerouslySetInnerHTML={{ __html: info.icon }} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{role}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                  {role === activeRole && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Active</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

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
