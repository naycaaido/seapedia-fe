import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { useAdminSummary } from '../../hooks/useAdmin';
import { formatPrice } from '../../types';

const quickLinks = [
  { label: 'Users', path: '/admin/users', color: 'bg-blue-500' },
  { label: 'Stores', path: '/admin/stores', color: 'bg-green-500' },
  { label: 'Products', path: '/admin/products', color: 'bg-purple-500' },
  { label: 'Orders', path: '/admin/orders', color: 'bg-yellow-500' },
  { label: 'Delivery Jobs', path: '/admin/delivery-jobs', color: 'bg-indigo-500' },
  { label: 'Discounts', path: '/admin/discounts', color: 'bg-pink-500' },
  { label: 'Overdue Orders', path: '/admin/overdue-orders', color: 'bg-red-500' },
  { label: 'System Time', path: '/admin/system-time', color: 'bg-teal-500' },
];

export default function AdminDashboard() {
  const { data: summary, isLoading, isError, error } = useAdminSummary();

  const statCards = [
    { label: 'Total Users', value: summary?.totalUsers ?? '—', color: 'bg-blue-500' },
    { label: 'Total Stores', value: summary?.totalStores ?? '—', color: 'bg-green-500' },
    { label: 'Total Products', value: summary?.totalProducts ?? '—', color: 'bg-purple-500' },
    { label: 'Total Orders', value: summary?.totalOrders ?? '—', color: 'bg-yellow-500' },
  ];

  const extraCards = summary
    ? [
        { label: 'Completed Orders', value: summary.totalCompletedOrders ?? '—', color: 'bg-emerald-500' },
        { label: 'Returned Orders', value: summary.totalReturnedOrders ?? '—', color: 'bg-orange-500' },
        { label: 'Delivery Jobs', value: summary.totalDeliveryJobs ?? '—', color: 'bg-indigo-500' },
        { label: 'Revenue', value: summary.totalRevenue ? formatPrice(summary.totalRevenue) : '—', color: 'bg-amber-500' },
        { label: 'Seller Income', value: summary.totalSellerIncome ? formatPrice(summary.totalSellerIncome) : '—', color: 'bg-cyan-500' },
        { label: 'Driver Earnings', value: summary.totalDriverEarnings ? formatPrice(summary.totalDriverEarnings) : '—', color: 'bg-rose-500' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Marketplace monitoring and management.</p>

      {isLoading && (
        <div className="animate-pulse grid md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="h-16 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          Failed to load admin summary: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {extraCards.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {extraCards.map((stat) => (
                <Card key={stat.label}>
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Card header={<h2 className="font-semibold text-gray-900">Quick Links</h2>}>
        <div className="grid md:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${link.color}`} />
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
