import { useAdminDeliveryJobs } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

const statusVariant: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'> = {
  AVAILABLE: 'green',
  TAKEN: 'blue',
  COMPLETED: 'gray',
  CANCELLED: 'red',
  RETURNED: 'yellow',
};

export default function DeliveryJobsPage() {
  const { data: jobs, isLoading, isError, error } = useAdminDeliveryJobs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Delivery Jobs</h1>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load delivery jobs: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && jobs && jobs.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No delivery jobs found.</p>
        </Card>
      )}

      {!isLoading && !isError && jobs && jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Job #{job.id}
                    {job.order?.orderNumber && ` — ${job.order.orderNumber}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {job.order?.store?.name && `${job.order.store.name} · `}
                    {job.deliveryMethod}
                    {job.driver && ` · Driver: ${job.driver.fullName}`}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500">{formatPrice(job.deliveryFee)}</p>
                    <Badge variant={statusVariant[job.status] || 'gray'}>{job.status}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
