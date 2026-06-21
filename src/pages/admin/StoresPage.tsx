import { useAdminStores } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';

export default function StoresPage() {
  const { data: stores, isLoading, isError, error } = useAdminStores();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Stores</h1>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load stores: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && stores && stores.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No stores found.</p>
        </Card>
      )}

      {!isLoading && !isError && stores && stores.length > 0 && (
        <div className="space-y-3">
          {stores.map((store) => (
            <Card key={store.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{store.name}</p>
                  {store.sellerUser && (
                    <p className="text-sm text-gray-500">
                      Seller: {store.sellerUser.fullName}
                      {store.sellerUser.username && ` (@${store.sellerUser.username})`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-lg font-bold text-gray-900">{store._count?.products ?? 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
