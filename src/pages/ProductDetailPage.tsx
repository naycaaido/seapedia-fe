import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-8 h-64" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">Product not found.</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">&larr; Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to products
      </Link>

      <Card>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 text-4xl">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                '&#128230;'
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <Link to={`/stores/${product.store.id}`} className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
              {product.store.name}
            </Link>
            <p className="text-3xl font-bold text-primary-600 mb-4">
              Rp{Number(product.price).toLocaleString('id-ID')}
            </p>
            <div className="mb-4">
              {product.stock > 0 ? (
                <Badge variant="green">In Stock ({product.stock} available)</Badge>
              ) : (
                <Badge variant="red">Out of Stock</Badge>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
