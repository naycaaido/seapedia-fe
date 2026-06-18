import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Card from '../components/ui/Card';

export default function ProductListPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-500 mb-8">Browse products from our trusted stores.</p>

      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-48" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{product.store.name}</p>
                <p className="text-lg font-bold text-primary-600 mb-2">
                  Rp{Number(product.price).toLocaleString('id-ID')}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No products available yet.</p>
        </div>
      )}
    </div>
  );
}
