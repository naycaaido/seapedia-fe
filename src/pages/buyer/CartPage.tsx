import { Link, useNavigate } from 'react-router-dom';
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatPrice } from '../../types';
import { useState } from 'react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading, isError } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemMutation.mutate({ id: itemId, payload: { quantity: newQuantity } });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => setClearModalOpen(false),
    });
  };

  const subtotal = cart?.items.reduce((sum, item) => {
    const price = Number(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Cart</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load cart.</p>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Browse products
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Cart</h1>
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-4">Start shopping to add items to your cart.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} from{' '}
            {cart.store?.name || 'your store'}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setClearModalOpen(true)}
        >
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <Card key={item.id}>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatPrice(item.product.price)} each
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || (updateItemMutation.isPending && updateItemMutation.variables?.id === item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || (updateItemMutation.isPending && updateItemMutation.variables?.id === item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeItemMutation.isPending}
                      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary-600">{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => navigate('/buyer/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Cart"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setClearModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleClearCart}
            loading={clearCartMutation.isPending}
          >
            Clear Cart
          </Button>
        </div>
      </Modal>
    </div>
  );
}
