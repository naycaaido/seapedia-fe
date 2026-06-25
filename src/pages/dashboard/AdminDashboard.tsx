import { Link } from 'react-router-dom';
import { useAdminSummary } from '../../hooks/useAdmin';
import { formatPrice } from '../../types';

const modules = [
  {
    label: 'Users',
    path: '/admin/users',
    desc: 'View and manage all platform users',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: 'Stores',
    path: '/admin/stores',
    desc: 'View registered stores and sellers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    path: '/admin/products',
    desc: 'Oversee all product listings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    desc: 'Monitor and manage all orders',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Delivery Jobs',
    path: '/admin/delivery-jobs',
    desc: 'Track and manage deliveries',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
      </svg>
    ),
  },
  {
    label: 'Discounts',
    path: '/admin/discounts',
    desc: 'Manage vouchers and promos',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    label: 'Overdue Orders',
    path: '/admin/overdue-orders',
    desc: 'Review and process overdue orders',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'System Time',
    path: '/admin/system-time',
    desc: 'View and simulate system time',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { data: summary, isLoading, isError, error } = useAdminSummary();

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Control Center</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Admin
            </span>
          </div>
          <p className="text-base text-gray-500">
            Monitor marketplace activity, revenue, orders, and system operations.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="animate-pulse space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Failed to load admin summary</p>
                <p className="text-sm text-red-600 mt-1">{(error as Error)?.message || 'An unexpected error occurred. Please try again later.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !isError && summary && (
          <>
            {/* Key Metrics */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Link to="/admin/users" className="block group">
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalUsers}</p>
                  </div>
                </Link>

                <Link to="/admin/stores" className="block group">
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Stores</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalStores}</p>
                  </div>
                </Link>

                <Link to="/admin/products" className="block group">
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalProducts}</p>
                  </div>
                </Link>

                <Link to="/admin/orders" className="block group">
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalOrders}</p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Financial Summary */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.totalRevenue ? formatPrice(summary.totalRevenue) : '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Total platform revenue</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Seller Income</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.totalSellerIncome ? formatPrice(summary.totalSellerIncome) : '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Paid out to sellers</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Driver Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.totalDriverEarnings ? formatPrice(summary.totalDriverEarnings) : '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Paid out to drivers</p>
                </div>
              </div>
            </section>

            {/* Order & Delivery Health */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order &amp; Delivery Health</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {summary.totalCompletedOrders !== undefined && (
                  <Link to="/admin/orders" className="block group">
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{summary.totalCompletedOrders}</p>
                    </div>
                  </Link>
                )}

                {summary.totalReturnedOrders !== undefined && (
                  <Link to="/admin/orders" className="block group">
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-8 0v1m0 0a4 4 0 00-4 4h12a4 4 0 00-4-4zm-1-8a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Returned Orders</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{summary.totalReturnedOrders}</p>
                    </div>
                  </Link>
                )}

                {summary.totalDeliveryJobs !== undefined && (
                  <Link to="/admin/delivery-jobs" className="block group">
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Delivery Jobs</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{summary.totalDeliveryJobs}</p>
                    </div>
                  </Link>
                )}

                <Link to="/admin/overdue-orders" className="block group">
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-500">Overdue Orders</p>
                    </div>
                    <p className="text-sm text-gray-700">Review overdue orders</p>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}

        {/* Management Modules */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Management Modules</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.label}
                to={mod.path}
                className="block group bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {mod.icon}
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{mod.label}</p>
                <p className="text-xs text-gray-500 mt-1">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
