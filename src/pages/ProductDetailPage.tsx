import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useAddCartItem } from '../hooks/useBuyer';
import { useAuthStore } from '../store/auth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatPrice } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(Number(id));
  const addItemMutation = useAddCartItem();
  const { isAuthenticated, activeRole } = useAuthStore();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const canAddToCart = isAuthenticated && activeRole === 'Buyer' && product && product.stock > 0;

  const getErrorMessage = (err: any): string => {
    const msg = err?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.filter(Boolean).join('. ');
    if (msg && typeof msg === 'object') return JSON.stringify(msg);
    return 'Failed to add to cart.';
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setFeedback(null);
    try {
      await addItemMutation.mutateAsync({ productId: product.id, quantity: 1 });
      setFeedback({ type: 'success', message: 'Added to cart!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-2">Product not found.</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">&larr; Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; Back to products
      </Link>

      <Card>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <Link to={`/stores/${product.store.id}`} className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block">
              {product.store.name}
            </Link>
            <p className="text-3xl font-bold text-primary-600 mb-4">
              {formatPrice(product.price)}
            </p>
            <div className="mb-4">
              {product.stock > 0 ? (
                <Badge variant="green">In Stock ({product.stock} available)</Badge>
              ) : (
                <Badge variant="red">Out of Stock</Badge>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            {feedback && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="w-full sm:w-auto">Login to Add to Cart</Button>
              </Link>
            ) : activeRole !== 'Buyer' ? (
              <Button disabled className="w-full sm:w-auto">
                Switch to Buyer Role to Purchase
              </Button>
            ) : product.stock <= 0 ? (
              <Button disabled className="w-full sm:w-auto">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                loading={addItemMutation.isPending}
                disabled={addItemMutation.isPending}
                className="w-full sm:w-auto"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
