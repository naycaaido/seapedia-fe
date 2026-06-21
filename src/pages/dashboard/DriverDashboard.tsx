import { Link } from 'react-router-dom';
import { useDriverJobs, useDriverHistory, useDriverEarnings } from '../../hooks/useDriver';
import Card from '../../components/ui/Card';
import { formatPrice } from '../../types';

export default function DriverDashboard() {
  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useDriverJobs();
  const { data: history, isLoading: historyLoading, isError: historyError } = useDriverHistory();
  const { data: earnings, isLoading: earningsLoading, isError: earningsError } = useDriverEarnings();

  const availableCount = jobs?.length ?? 0;
  const activeJobs = (history ?? []).filter((j) => j.status === 'TAKEN');
  const activeCount = activeJobs.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
      <p className="text-gray-500 mb-8">Find delivery jobs and track your earnings.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">Available Jobs</h2>}>
          <p className="text-sm text-gray-500 mb-4">Browse and take delivery jobs.</p>
          {jobsLoading ? (
            <div className="animate-pulse h-6 w-16 bg-gray-200 rounded" />
          ) : jobsError ? (
            <p className="text-xs text-red-500 mb-2">Failed to load job count.</p>
          ) : (
            <p className="text-3xl font-bold text-primary-600 mb-3">{availableCount}</p>
          )}
          <Link
            to="/driver/jobs"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Available Jobs &rarr;
          </Link>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Active Job</h2>}>
          <p className="text-sm text-gray-500 mb-4">Track your current delivery.</p>
          {historyLoading ? (
            <div className="animate-pulse h-6 w-16 bg-gray-200 rounded" />
          ) : historyError ? (
            <p className="text-xs text-red-500 mb-2">Failed to load active job.</p>
          ) : activeCount > 0 ? (
            <div className="mb-3">
              <p className="text-lg font-bold text-gray-900 mb-1">
                Order #{activeJobs[0].order?.orderNumber ?? activeJobs[0].orderId}
              </p>
              <p className="text-sm text-gray-600">
                {activeJobs[0].deliveryMethod} &middot; {formatPrice(activeJobs[0].deliveryFee)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-3">No active job</p>
          )}
          <Link
            to="/driver/active"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Active Job &rarr;
          </Link>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Earnings</h2>}>
          <p className="text-sm text-gray-500 mb-4">View your delivery earnings.</p>
          {earningsLoading ? (
            <div className="animate-pulse h-6 w-24 bg-gray-200 rounded" />
          ) : earningsError ? (
            <p className="text-xs text-red-500 mb-2">Failed to load earnings.</p>
          ) : (
            <p className="text-2xl font-bold text-green-600 mb-3">
              {earnings ? formatPrice(earnings.totalEarnings) : 'Rp0'}
            </p>
          )}
          <Link
            to="/driver/earnings"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Earnings &rarr;
          </Link>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Delivery History</h2>}>
        <p className="text-sm text-gray-500">Your completed delivery jobs will appear here.</p>
        {historyLoading ? (
          <div className="mt-2 animate-pulse h-6 w-32 bg-gray-200 rounded" />
        ) : historyError ? (
          <p className="text-xs text-red-500 mt-2">Failed to load history.</p>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-gray-700">
              {history ? history.length : 0} total jobs
              &middot; {history ? history.filter((j) => j.status === 'COMPLETED').length : 0} completed
            </p>
            <Link
              to="/driver/earnings"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
            >
              View Full History &rarr;
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
