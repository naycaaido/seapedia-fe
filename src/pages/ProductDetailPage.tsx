import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useAddCartItem } from '../hooks/useBuyer';
import { useAuthStore } from '../store/auth';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatPrice } from '../types';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(Number(id));
  const addItemMutation = useAddCartItem();
  const { isAuthenticated, activeRole, roles } = useAuthStore();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
    setFeedback(null);
  }, [id]);

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
      await addItemMutation.mutateAsync({ productId: product.id, quantity });
      setFeedback({ type: 'success', message: 'Added to cart!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(err),
      });
    }
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    if (!product) return;
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
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
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-2">Product not found.</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">&larr; Back to products</Link>
      </div>
    );
  }

  const canBuy = product.stock > 0;
  const userHasBuyerRole = roles.includes('Buyer');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Panel */}
        <div className="aspect-square bg-gray-50 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex flex-col">
          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-bold text-primary-600 mb-6">
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Meta Section */}
          <div className="border-grey rounded-lg border p-4 mb-6 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Stock</span>
              <span>
                {canBuy ? (
                  <Badge variant="green">{product.stock} available</Badge>
                ) : (
                  <Badge variant="red">Out of Stock</Badge>
                )}
              </span>
            </div>
            {product.createdAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Added</span>
                <span className="text-gray-700">{formatDate(product.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Store Card */}
          <div className="border-grey rounded-lg border p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 text-sm font-bold shrink-0">
                {product.store.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.store.name}</p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
              <Link
                to={`/stores/${product.store.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-colors shrink-0"
              >
                Visit Store
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <span>{feedback.message}</span>
              {feedback.type === 'success' && (
                <Link to="/buyer/cart" className="ml-2 font-semibold underline hover:no-underline">
                  View in cart &rarr;
                </Link>
              )}
            </div>
          )}

          {/* CTA Area */}
          {!isAuthenticated ? (
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Login to Add to Cart</Button>
            </Link>
          ) : activeRole !== 'Buyer' ? (
            <div className="space-y-2">
              <Button disabled className="w-full sm:w-auto">
                Switch to Buyer Role to Purchase
              </Button>
              {userHasBuyerRole && (
                <p className="text-xs text-gray-500">
                  <Link to="/role-selection" className="text-primary-600 hover:text-primary-700 underline">
                    Switch to Buyer role
                  </Link>
                </p>
              )}
            </div>
          ) : !canBuy ? (
            <Button disabled className="w-full sm:w-auto">
              Out of Stock
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900 select-none" aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                loading={addItemMutation.isPending}
                disabled={addItemMutation.isPending}
                className="flex-1"
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
