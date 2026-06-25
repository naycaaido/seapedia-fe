import { Link } from 'react-router-dom';
import { useDriverJobs, useDriverHistory, useDriverEarnings } from '../../hooks/useDriver';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

const DELIVERY_LABELS: Record<string, string> = {
  INSTANT: 'Instant',
  NEXT_DAY: 'Next Day',
  REGULAR: 'Regular',
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DriverDashboard() {
  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useDriverJobs();
  const { data: history, isLoading: historyLoading, isError: historyError } = useDriverHistory();
  const { data: earnings, isLoading: earningsLoading, isError: earningsError } = useDriverEarnings();

  const availableCount = jobs?.length ?? 0;
  const activeJobs = (history ?? []).filter((j) => j.status === 'TAKEN');
  const activeCount = activeJobs.length;
  const completedCount = history ? history.filter((j) => j.status === 'COMPLETED').length : 0;
  const activeJob = activeJobs[0];

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Dashboard</h1>
          <p className="text-base text-gray-500 mt-1">
            Find delivery jobs, track active deliveries, and monitor earnings.
          </p>
        </div>

        {/* Active Job — Primary Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active Delivery</h2>
                <p className="text-sm text-gray-500">Your current delivery status</p>
              </div>
            </div>
            {!historyLoading && !historyError && activeCount > 0 && (
              <Badge variant="blue" size="sm">In Progress</Badge>
            )}
          </div>

          {historyLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
          ) : historyError ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 mb-3">Failed to load active delivery info.</p>
              <Link
                to="/driver/active"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                Go to Active Job
              </Link>
            </div>
          ) : activeCount > 0 && activeJob ? (
            <div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Order</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {activeJob.order?.orderNumber ?? `#${activeJob.orderId}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Delivery</span>
                  <span className="text-sm font-medium text-gray-700">
                    {DELIVERY_LABELS[activeJob.deliveryMethod] || activeJob.deliveryMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatPrice(activeJob.deliveryFee)}
                  </span>
                </div>
                {activeJob.order?.store?.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Store</span>
                    <span className="text-sm text-gray-700 truncate ml-2">{activeJob.order.store.name}</span>
                  </div>
                )}
              </div>
              <Link
                to="/driver/active"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                View Active Job
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
              </svg>
              <p className="text-sm font-semibold text-gray-900 mb-1">No active delivery</p>
              <p className="text-xs text-gray-500 mb-4">Take an available job to start delivering.</p>
              <Link
                to="/driver/jobs"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                Browse Available Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Available Jobs */}
          <Link to="/driver/jobs" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Available Jobs</p>
              {jobsLoading ? (
                <div className="animate-pulse h-7 w-12 bg-gray-200 rounded" />
              ) : jobsError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Jobs ready to take</p>
                </>
              )}
            </div>
          </Link>

          {/* Active Jobs */}
          <Link to="/driver/active" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs</p>
              {historyLoading ? (
                <div className="animate-pulse h-7 w-12 bg-gray-200 rounded" />
              ) : historyError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activeCount === 1 ? 'In progress' : 'In progress'}</p>
                </>
              )}
            </div>
          </Link>

          {/* Total Earnings */}
          <Link to="/driver/earnings" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
              {earningsLoading ? (
                <div className="animate-pulse h-7 w-20 bg-gray-200 rounded" />
              ) : earningsError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(earnings?.totalEarnings)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">All time earnings</p>
                </>
              )}
            </div>
          </Link>

          {/* Completed Jobs */}
          <Link to="/driver/earnings" className="block group">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 h-full">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed Jobs</p>
              {historyLoading ? (
                <div className="animate-pulse h-7 w-12 bg-gray-200 rounded" />
              ) : historyError ? (
                <p className="text-sm text-red-500">Failed to load</p>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Deliveries done</p>
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Available Jobs CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Ready to deliver?</h2>
              <p className="text-sm text-primary-100">
                Browse available delivery jobs and take one that fits your route.
              </p>
            </div>
            <Link
              to="/driver/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              View Available Jobs
            </Link>
          </div>
        </div>

        {/* Delivery History */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Delivery History</h2>
            <Link
              to="/driver/earnings"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : historyError ? (
            <p className="text-sm text-red-500">Failed to load delivery history.</p>
          ) : history && history.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {history.slice(0, 5).map((job) => {
                const statusLabel: Record<string, string> = {
                  AVAILABLE: 'Available',
                  TAKEN: 'In Progress',
                  COMPLETED: 'Completed',
                  CANCELLED: 'Cancelled',
                  RETURNED: 'Returned',
                };
                const statusBadgeColor: Record<string, 'blue' | 'yellow' | 'green' | 'red' | 'gray'> = {
                  AVAILABLE: 'blue',
                  TAKEN: 'yellow',
                  COMPLETED: 'green',
                  CANCELLED: 'red',
                  RETURNED: 'gray',
                };
                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.order?.orderNumber ?? `Order #${job.orderId}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {DELIVERY_LABELS[job.deliveryMethod] || job.deliveryMethod}
                        {job.completedAt && ` · ${formatTime(job.completedAt)}`}
                        {!job.completedAt && job.createdAt && ` · ${formatTime(job.createdAt)}`}
                      </p>
                    </div>
                    <Badge variant={statusBadgeColor[job.status] || 'gray'} size="sm">
                      {statusLabel[job.status] || job.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m10 0l2-1m-2 1v.5M9 16v.5M20 16l2-1V6a1 1 0 00-1-1h-6a1 1 0 00-1 1v10l2-1m-2 1v.5M9 16l2-1m-2 1v.5" />
              </svg>
              <p className="text-sm text-gray-500 mb-1">No deliveries yet</p>
              <Link to="/driver/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Find your first job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
