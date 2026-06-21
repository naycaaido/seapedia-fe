import { useAdminUsers } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function UsersPage() {
  const { data: users, isLoading, isError, error } = useAdminUsers();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load users: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && users && users.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No users found.</p>
        </Card>
      )}

      {!isLoading && !isError && users && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">@{user.username} &middot; {user.email}</p>
                  {user.phone && <p className="text-sm text-gray-400">{user.phone}</p>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {user.userRoles?.map((ur) => (
                    <Badge key={ur.role?.name || ur.id} variant={ur.role?.name === 'Admin' ? 'red' : 'blue'}>
                      {ur.role?.name || 'Unknown'}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
