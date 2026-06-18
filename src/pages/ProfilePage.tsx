import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, roles, activeRole, selectRole } = useAuthStore();
  const navigate = useNavigate();

  const roleBadgeVariant = (role: string) => {
    const map: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple'> = {
      Admin: 'red',
      Seller: 'blue',
      Buyer: 'green',
      Driver: 'yellow',
    };
    return map[role] || 'gray';
  };

  const handleSwitchRole = async (role: string) => {
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
      // handled in store
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card header={<h1 className="text-xl font-bold text-gray-900">Profile</h1>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || '—'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Owned Roles</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant={roleBadgeVariant(role)} size="md">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Active Role</p>
            {activeRole ? (
              <div className="flex items-center gap-2">
                <Badge variant={roleBadgeVariant(activeRole)} size="md">{activeRole}</Badge>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No active role selected</p>
            )}
          </div>

          {roles.length > 1 && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-3">Switch Active Role</p>
              <div className="flex flex-wrap gap-2">
                {roles.filter((r) => r !== activeRole).map((role) => (
                  <Button key={role} variant="outline" size="sm" onClick={() => handleSwitchRole(role)}>
                    Switch to {role}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
