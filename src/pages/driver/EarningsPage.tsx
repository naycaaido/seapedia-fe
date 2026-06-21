import { useDriverEarnings } from '../../hooks/useDriver';
import Card from '../../components/ui/Card';
import { formatPrice } from '../../types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EarningsPage() {
  const { data: summary, isLoading, isError } = useDriverEarnings();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load earnings data.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No earnings data available yet.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(summary.totalEarnings)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Completed Deliveries</p>
          <p className="text-3xl font-bold text-gray-900">{summary.totalCompletedJobs}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Average Per Job</p>
          <p className="text-2xl font-bold text-primary-600">{formatPrice(summary.averageEarningPerJob)}</p>
        </Card>
      </div>

      {summary.earnings.length > 0 && (
        <Card header={<h2 className="font-semibold text-gray-900">Earnings History</h2>}>
          <div className="divide-y divide-gray-100">
            {summary.earnings.map((earning) => (
              <div key={earning.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(earning.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(earning.createdAt)}
                    {earning.deliveryJob?.order?.orderNumber && (
                      <> &middot; Order {earning.deliveryJob.order.orderNumber}</>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {earning.deliveryJob?.deliveryMethod || ''}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
