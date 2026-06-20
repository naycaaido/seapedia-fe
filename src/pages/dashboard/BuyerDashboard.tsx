import { Link } from 'react-router-dom';
import { useWallet, useCart, useOrders } from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  SEDANG_DIKEMAS: 'Being Packed',
  MENUNGGU_PENGIRIM: 'Awaiting Delivery',
  SEDANG_DIKIRIM: 'In Transit',
  PESANAN_SELESAI: 'Completed',
  DIKEMBALIKAN: 'Refunded',
};

const STATUS_VARIANTS: Record<string, 'blue' | 'yellow' | 'purple' | 'green' | 'red'> = {
  SEDANG_DIKEMAS: 'blue',
  MENUNGGU_PENGIRIM: 'yellow',
  SEDANG_DIKIRIM: 'purple',
  PESANAN_SELESAI: 'green',
  DIKEMBALIKAN: 'red',
};

export default function BuyerDashboard() {
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your wallet, cart, and orders.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">My Wallet</h2>}>
          {walletLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(wallet?.balance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Available balance</p>
            </>
          )}
          <div className="mt-4">
            <Link to="/buyer/wallet">
              <Button variant="secondary" size="sm">View Wallet</Button>
            </Link>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">My Cart</h2>}>
          {cartLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ) : cartItemCount > 0 ? (
            <>
              <p className="text-2xl font-bold text-primary-600">{cartItemCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {cartItemCount === 1 ? 'item' : 'items'} in cart
              </p>
              {cart?.store && (
                <p className="text-xs text-gray-400 mt-0.5">from {cart.store.name}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          )}
          <div className="mt-4">
            <Link to="/buyer/cart">
              <Button variant="secondary" size="sm">View Cart</Button>
            </Link>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Order History</h2>}>
          {ordersLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ) : ordersError ? (
            <p className="text-sm text-red-600">Failed to load orders. Please try again.</p>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <Link key={order.id} to={`/buyer/orders/${order.id}`} className="block">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items</p>
                    </div>
                    <Badge variant={STATUS_VARIANTS[order.status] || 'blue'} size="sm">
                      {STATUS_LABELS[order.status] || order.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">No orders yet.</p>
          )}
          <div className="mt-3">
            <Link to="/buyer/orders">
              <Button variant="secondary" size="sm">View All Orders</Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Quick Links</h2>}>
        <div className="flex flex-wrap gap-4">
          <Link to="/buyer/wallet">
            <Button size="sm">Wallet</Button>
          </Link>
          <Link to="/buyer/addresses">
            <Button variant="secondary" size="sm">Addresses</Button>
          </Link>
          <Link to="/buyer/cart">
            <Button variant="secondary" size="sm">Cart</Button>
          </Link>
          <Link to="/buyer/orders">
            <Button variant="secondary" size="sm">Orders</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
