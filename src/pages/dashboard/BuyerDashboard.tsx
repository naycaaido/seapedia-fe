import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useWallet, useCart, useOrders, useAddresses } from '../../hooks/useBuyer';
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
  const { user, activeRole } = useAuthStore();
  const { data: wallet, isLoading: walletLoading, isError: walletError } = useWallet();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const recentOrders = orders?.slice(0, 3) || [];
  const userName = user?.fullName || user?.username || 'User';

  const getWelcomeText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {getWelcomeText()}, {userName}
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage your wallet, orders, and settings.</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {/* Wallet Card */}
          <Link to="/buyer/wallet" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Wallet Balance</p>
              {walletLoading ? (
                <div className="animate-pulse h-7 w-28 bg-gray-200 rounded" />
              ) : walletError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{formatPrice(wallet?.balance)}</p>
              )}
            </div>
          </Link>

          {/* Cart Card */}
          <Link to="/buyer/cart" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Shopping Cart</p>
              {cartLoading ? (
                <div className="animate-pulse h-7 w-20 bg-gray-200 rounded" />
              ) : cartItemCount > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">{cartItemCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cartItemCount === 1 ? '1 item' : `${cartItemCount} items`}
                    {cart?.store && ` from ${cart.store.name}`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Your cart is empty</p>
              )}
            </div>
          </Link>

          {/* Orders Card */}
          <Link to="/buyer/orders" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Orders</p>
              {ordersLoading ? (
                <div className="animate-pulse h-7 w-16 bg-gray-200 rounded" />
              ) : ordersError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : orders && orders.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total orders placed</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No orders yet</p>
              )}
            </div>
          </Link>

          {/* Addresses Card */}
          <Link to="/buyer/addresses" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Addresses</p>
              {addressesLoading ? (
                <div className="animate-pulse h-7 w-16 bg-gray-200 rounded" />
              ) : addresses && addresses.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {addresses.length === 1 ? '1 address saved' : `${addresses.length} addresses saved`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No addresses yet</p>
              )}
            </div>
          </Link>

          <Link to="/buyer/reports/spending" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Spending Report</p>
              <p className="text-2xl font-bold text-gray-900">Summary</p>
              <p className="text-xs text-gray-400 mt-0.5">View your spending summary</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/buyer/orders"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View All
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <p className="text-sm text-red-500">Failed to load orders. Please try again.</p>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/buyer/orders/${order.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        {' · '}
                        {formatPrice(order.finalTotal)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANTS[order.status] || 'blue'} size="sm">
                      {STATUS_LABELS[order.status] || order.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">No orders yet</p>
                <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Start shopping
                </Link>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
