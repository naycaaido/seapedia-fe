import { Link } from 'react-router-dom';
import { useDriverEarnings } from '../../hooks/useDriver';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';
import type {
  DriverMonthlyTrendItem,
  DriverEarningsByDeliveryMethodItem,
  DriverEarningsByStatusItem,
  DriverEarningsExportRow,
} from '../../types';

const DELIVERY_LABELS: Record<string, string> = {
  INSTANT: 'Instant',
  NEXT_DAY: 'Next Day',
  REGULAR: 'Regular',
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  TAKEN: 'Taken',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

const STATUS_VARIANTS: Record<string, 'blue' | 'yellow' | 'purple' | 'green' | 'red'> = {
  AVAILABLE: 'blue',
  TAKEN: 'yellow',
  COMPLETED: 'green',
  CANCELLED: 'red',
  RETURNED: 'purple',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShare(val: string | null | undefined): string {
  if (val === null || val === undefined) return '—';
  const n = Number(val);
  if (isNaN(n)) return val;
  const pct = n < 1 ? Math.round(n * 100) : Math.round(n);
  return `${pct}%`;
}

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </Card>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function csvEscape(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function generateCsv(rows: DriverEarningsExportRow[]): string {
  const headers = [
    'earningId', 'jobId', 'orderId', 'orderNumber', 'date',
    'status', 'deliveryMethod', 'deliveryFee', 'driverEarning',
    'storeName', 'buyerName',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      r.earningId, r.jobId, r.orderId, r.orderNumber, r.date,
      r.status, r.deliveryMethod, r.deliveryFee, r.driverEarning,
      r.storeName, r.buyerName,
    ].map(csvEscape).join(','));
  }
  return lines.join('\n');
}

function downloadCsv(rows: DriverEarningsExportRow[]) {
  const csv = generateCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'seapedia-driver-earnings-report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function MonthlyEarningsChart({ data }: { data: DriverMonthlyTrendItem[] }) {
  if (!data || data.length === 0) return null;
  const maxEarnings = Math.max(...data.map((d) => Number(d.totalEarnings)));
  if (maxEarnings === 0) return null;

  if (data.length === 1) {
    const item = data[0];
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
        <p className="text-sm font-semibold text-gray-900">{item.month}</p>
        <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(item.totalEarnings)}</p>
        <p className="text-xs text-gray-500 mt-0.5">{item.totalDeliveries} deliver{item.totalDeliveries !== 1 ? 'ies' : 'y'}</p>
        <p className="text-xs text-gray-400 mt-2">Only one month of earnings data is available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => {
        const pct = (Number(item.totalEarnings) / maxEarnings) * 100;
        return (
          <div key={item.month} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16 shrink-0 text-right">{item.month}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
            <span className="text-xs text-gray-700 w-24 shrink-0 text-right font-medium">
              {formatPrice(item.totalEarnings)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function EarningsPage() {
  const { data: summary, isLoading, isError } = useDriverEarnings();

  if (isLoading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-72" />
            </div>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your delivery earnings</p>
          </div>
          <Card>
            <div className="p-1">
              <p className="text-sm text-red-600">Failed to load earnings data.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your delivery earnings</p>
          </div>
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No earnings data available yet.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const hasDeliveries = (summary.totalCompletedJobs || summary.totalDeliveries || 0) > 0;
  const topMethod = summary.earningsByDeliveryMethod && summary.earningsByDeliveryMethod.length > 0
    ? [...summary.earningsByDeliveryMethod].sort((a, b) => Number(b.totalEarnings) - Number(a.totalEarnings))[0]
    : null;

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your delivery earnings</p>
          </div>
          {hasDeliveries && summary.exportRows && summary.exportRows.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => downloadCsv(summary.exportRows!)}>
              Export CSV
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total Earnings"
            value={formatPrice(summary.totalEarnings)}
            subtitle="All time driver earnings"
          />
          <SummaryCard
            title="Completed Deliveries"
            value={(summary.totalCompletedJobs || 0).toLocaleString('id-ID')}
            subtitle="Jobs completed in this report"
          />
          <SummaryCard
            title="Average Per Job"
            value={formatPrice(summary.averageEarningPerJob)}
            subtitle="Average earnings per delivery"
          />
        </div>

        {hasDeliveries && (
          <Card header={<h2 className="text-lg font-semibold text-gray-900">Delivery Performance Insights</h2>}>
            <div className="space-y-2">
              {summary.highestEarningMonth ? (
                <p className="text-sm text-gray-700">
                  Your highest earnings were in <span className="font-semibold text-gray-900">{summary.highestEarningMonth.label}</span> with{' '}
                  <span className="font-semibold text-gray-900">{formatPrice(summary.highestEarningMonth.totalEarnings)}</span>.
                </p>
              ) : (
                <p className="text-sm text-gray-500">No monthly earnings trend available yet.</p>
              )}
              {topMethod ? (
                <p className="text-sm text-gray-700">
                  Your most used delivery method is{' '}
                  <span className="font-semibold text-gray-900">{DELIVERY_LABELS[topMethod.deliveryMethod] || topMethod.deliveryMethod}</span>.
                </p>
              ) : (
                <p className="text-sm text-gray-500">No delivery method breakdown available yet.</p>
              )}
              {summary.averageDriverShare !== null && summary.averageDriverShare !== undefined && (
                <p className="text-sm text-gray-700">
                  You earned <span className="font-semibold text-gray-900">{formatShare(summary.averageDriverShare)}</span> of delivery fees on average.
                </p>
              )}
              {summary.latestEarningDate && (
                <p className="text-sm text-gray-700">
                  Your latest earning was recorded on{' '}
                  <span className="font-semibold text-gray-900">{formatDate(summary.latestEarningDate)}</span>.
                </p>
              )}
            </div>
          </Card>
        )}

        {hasDeliveries && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {summary.totalDeliveryFees !== null && summary.totalDeliveryFees !== undefined && (
              <InsightCard title="Total Delivery Fees" value={formatPrice(summary.totalDeliveryFees)} />
            )}
            {summary.averageDeliveryFee !== null && summary.averageDeliveryFee !== undefined && (
              <InsightCard title="Avg Delivery Fee" value={formatPrice(summary.averageDeliveryFee)} />
            )}
            {summary.averageDriverShare !== null && summary.averageDriverShare !== undefined && (
              <InsightCard title="Avg Driver Share" value={formatShare(summary.averageDriverShare)} />
            )}
            {summary.highestEarningMonth && (
              <InsightCard title="Highest Month" value={`${summary.highestEarningMonth.label} • ${formatPrice(summary.highestEarningMonth.totalEarnings)}`} />
            )}
            {summary.latestEarningDate && (
              <InsightCard title="Latest Earning" value={formatDate(summary.latestEarningDate)} />
            )}
            {summary.totalDeliveries !== null && summary.totalDeliveries !== undefined && (
              <InsightCard title="Total Deliveries" value={summary.totalDeliveries.toLocaleString('id-ID')} />
            )}
          </div>
        )}

        {!hasDeliveries && (
          <Card>
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-900">No earnings data yet</p>
              <p className="text-sm text-gray-500 mt-1">Complete deliveries to see your earnings analytics here.</p>
              <Link to="/driver/jobs" className="inline-block mt-4">
                <Button>Browse Available Jobs</Button>
              </Link>
            </div>
          </Card>
        )}

        {hasDeliveries && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {summary.monthlyTrend && summary.monthlyTrend.length > 0 && (
                  <Card header={<h2 className="text-lg font-semibold text-gray-900">Monthly Earnings Trend</h2>}>
                    <MonthlyEarningsChart data={summary.monthlyTrend} />
                  </Card>
                )}
              </div>

              <div>
                <Card header={<h2 className="text-lg font-semibold text-gray-900">Earnings Breakdown</h2>}>
                  {summary.earningsByDeliveryMethod && summary.earningsByDeliveryMethod.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Method</p>
                      <div className="space-y-1">
                        {summary.earningsByDeliveryMethod.slice(0, 3).map((item) => (
                          <div key={item.deliveryMethod} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-700">{DELIVERY_LABELS[item.deliveryMethod] || item.deliveryMethod}</span>
                            <span className="text-xs text-gray-600">{formatPrice(item.totalEarnings)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {summary.earningsByStatus && summary.earningsByStatus.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                      <div className="space-y-1">
                        {summary.earningsByStatus.slice(0, 3).map((item) => (
                          <div key={item.status} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <Badge variant={STATUS_VARIANTS[item.status] || 'gray'} size="sm">
                              {STATUS_LABELS[item.status] || item.status}
                            </Badge>
                            <span className="text-xs text-gray-600">{formatPrice(item.totalEarnings)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {summary.totalDeliveryFees !== null && summary.totalDeliveryFees !== undefined && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-1">
                      <span className="text-sm text-gray-700">Total delivery fees</span>
                      <span className="text-xs text-gray-600">{formatPrice(summary.totalDeliveryFees)}</span>
                    </div>
                  )}
                  {summary.averageDriverShare !== null && summary.averageDriverShare !== undefined && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700">Average driver share</span>
                      <span className="text-xs font-medium text-green-600">{formatShare(summary.averageDriverShare)}</span>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {summary.exportRows && summary.exportRows.length > 0 && (
              <Card
                header={
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Earnings</h2>
                    <Button variant="outline" size="sm" onClick={() => downloadCsv(summary.exportRows!)}>
                      Export CSV
                    </Button>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="pb-2 pr-3">Date</th>
                        <th className="pb-2 pr-3">Order</th>
                        <th className="pb-2 pr-3">Store</th>
                        <th className="pb-2 pr-3">Buyer</th>
                        <th className="pb-2 text-right">Earning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.exportRows.slice(0, 5).map((row) => (
                        <tr key={row.earningId} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{formatDate(row.date)}</td>
                          <td className="py-2 pr-3 text-gray-900 font-medium">{row.orderNumber}</td>
                          <td className="py-2 pr-3 text-gray-600">{row.storeName}</td>
                          <td className="py-2 pr-3 text-gray-600">{row.buyerName}</td>
                          <td className="py-2 text-right text-green-600 font-medium">
                            {formatPrice(row.driverEarning)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Keep delivering</p>
                <p className="text-xs text-gray-500 mt-0.5">Browse available jobs and track your delivery history.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/driver/jobs">
                  <Button size="sm">Available Jobs</Button>
                </Link>
                <Link to="/driver/active">
                  <Button variant="outline" size="sm">Active Delivery</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
