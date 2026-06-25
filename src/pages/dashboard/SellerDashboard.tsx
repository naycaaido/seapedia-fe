import { Link } from 'react-router-dom';
import { useSellerDashboard, useSellerOrders, useSellerIncome } from '../../hooks/useSeller';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  SEDANG_DIKEMAS: 'Being Packed',
  MENUNGGU_PENGIRIM: 'Awaiting Driver',
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function SellerDashboard() {
  const { data: dashboard, isLoading } = useSellerDashboard();
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useSellerOrders();
  const { data: income, isLoading: incomeLoading, isError: incomeError } = useSellerIncome();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-72" />
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-40" />
                  <div className="h-4 bg-gray-200 rounded w-56" />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No-store empty state
  if (!dashboard?.hasStore) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start your seller journey</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Create your store to start listing products and receiving orders on SEAPEDIA.
            </p>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 mb-8 text-left">
              <div className="space-y-4">
                {[
                  { title: 'Manage your storefront', desc: 'Customize your store name, description, and branding.' },
                  { title: 'Upload and organize products', desc: 'List your maritime products with images and pricing.' },
                  { title: 'Process customer orders', desc: 'Receive, pack, and dispatch orders seamlessly.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/seller/store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Store
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const storeName = dashboard.store?.name || 'Your Store';
  const storeInitial = storeName.charAt(0).toUpperCase();
  const createdDate = dashboard.store?.createdAt ? formatDate(dashboard.store.createdAt) : '';
  const needProcessing = orders?.filter((o) => o.status === 'SEDANG_DIKEMAS') || [];
  const displayOrders = needProcessing.length > 0 ? needProcessing : (orders?.slice(0, 5) || []);

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-base text-gray-500 mt-1">Manage your store, products, and orders.</p>
        </div>

        {/* Store Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-100 text-primary-700 text-xl sm:text-2xl font-bold shrink-0">
              {storeInitial}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{storeName}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back to your seller dashboard.
              </p>
              {createdDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Store created {createdDate}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                to="/seller/store"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Store
              </Link>
              <Link
                to="/seller/products/new"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Active Products */}
          <Link to="/seller/products" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard.activeProducts}</p>
              <p className="text-xs text-gray-400 mt-0.5">Currently listed</p>
            </div>
          </Link>

          {/* Total Products */}
          <Link to="/seller/products" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{dashboard.totalProducts}</p>
              <p className="text-xs text-gray-400 mt-0.5">All time</p>
            </div>
          </Link>

          {/* Need Processing */}
          <Link to="/seller/orders" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Need Processing</p>
              {ordersLoading ? (
                <div className="animate-pulse h-7 w-16 bg-gray-200 rounded" />
              ) : ordersError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{needProcessing.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{needProcessing.length === 1 ? 'Order to pack' : 'Orders to pack'}</p>
                </>
              )}
            </div>
          </Link>

          {/* Total Orders */}
          <Link to="/seller/orders" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
              {ordersLoading ? (
                <div className="animate-pulse h-7 w-16 bg-gray-200 rounded" />
              ) : ordersError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{orders?.length || 0}</p>
                  <p className="text-xs text-gray-400 mt-0.5">All orders received</p>
                </>
              )}
            </div>
          </Link>

          {/* Seller Income */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Seller Income</p>
            {incomeLoading ? (
              <div className="animate-pulse h-7 w-20 bg-gray-200 rounded" />
            ) : incomeError ? (
              <p className="text-sm text-red-500">Failed to load</p>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900">
                  {income?.totalIncome ? formatPrice(income.totalIncome) : '—'}
                </p>
                {income && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {income.totalOrders} order{income.totalOrders !== 1 ? 's' : ''} · avg {formatPrice(income.averageIncomePerOrder)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {needProcessing.length > 0 ? 'Orders Needing Attention' : 'Recent Orders'}
            </h2>
            <Link
              to="/seller/orders"
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
          ) : displayOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {displayOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/seller/orders/${order.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      {order.finalTotal ? ` · ${formatPrice(order.finalTotal)}` : ''}
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
              <Link to="/seller/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Start promoting your products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
