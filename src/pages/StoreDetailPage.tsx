import { useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStores';
import Card from '../components/ui/Card';

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, isLoading } = useStore(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-8 h-48" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">Store not found.</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">&larr; Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to products
      </Link>

      <Card header={
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Owner: {store.sellerUser.fullName}</p>
        </div>
      }>
        {store.description && <p className="text-gray-700 mb-6">{store.description}</p>}

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
        {store.products.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {store.products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600">
                    Rp{Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No products in this store yet.</p>
        )}
      </Card>
    </div>
  );
}
