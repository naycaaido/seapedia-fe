import { useAdminProducts } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useAdminProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load products: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && products && products.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No products found.</p>
        </Card>
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.store?.name ?? '—'} &middot; Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                  {product.deletedAt ? (
                    <Badge variant="red">Deleted</Badge>
                  ) : (
                    <Badge variant="green">Active</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
