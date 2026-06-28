import { useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStores';
import Card from '../components/ui/Card';
import { formatPrice } from '../types';

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, isLoading, isError } = useStore(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-4 bg-gray-200 rounded w-full mb-8" />
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-2">Store not found.</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">&larr; Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-500">No products in this store yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
