import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useBuyerSpending } from '../../hooks/useBuyer';
import { formatPrice } from '../../types';
import type {
  MonthlyTrendItem,
  SpendingByStoreItem,
  SpendingByDeliveryMethodItem,
  SpendingByStatusItem,
  TopProductItem,
  ExportRow,
} from '../../types';

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

const DELIVERY_LABELS: Record<string, string> = {
  INSTANT: 'Instant',
  NEXT_DAY: 'Next Day',
  REGULAR: 'Regular',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
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

function generateCsv(rows: ExportRow[]): string {
  const headers = [
    'orderId', 'orderNumber', 'date', 'storeName', 'status',
    'deliveryMethod', 'subtotal', 'discountAmount', 'deliveryFee',
    'taxAmount', 'totalAmount',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      r.orderId, r.orderNumber, r.date, r.storeName, r.status,
      r.deliveryMethod, r.subtotal, r.discountAmount, r.deliveryFee,
      r.taxAmount, r.totalAmount,
    ].map(csvEscape).join(','));
  }
  return lines.join('\n');
}

function downloadCsv(rows: ExportRow[]) {
  const csv = generateCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'seapedia-buyer-spending-report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function MonthlyTrendChart({ data }: { data: MonthlyTrendItem[] }) {
  if (!data || data.length === 0) return null;
  const maxSpending = Math.max(...data.map((d) => Number(d.totalSpending)));
  if (maxSpending === 0) return null;

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = (Number(item.totalSpending) / maxSpending) * 100;
        return (
          <div key={item.month} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-20 shrink-0 text-right">{item.month}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="bg-primary-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
            <span className="text-xs text-gray-700 w-28 shrink-0 text-right font-medium">
              {formatPrice(item.totalSpending)} ({item.totalOrders} order{item.totalOrders !== 1 ? 's' : ''})
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SpendingByStoreChart({ data }: { data: SpendingByStoreItem[] }) {
  if (!data || data.length === 0) return null;
  const maxSpending = Math.max(...data.map((d) => Number(d.totalSpending)));
  if (maxSpending === 0) return null;

  const sorted = [...data].sort((a, b) => Number(b.totalSpending) - Number(a.totalSpending));

  return (
    <div className="space-y-3">
      {sorted.map((item) => {
        const pct = (Number(item.totalSpending) / maxSpending) * 100;
        return (
          <div key={item.storeName}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 truncate mr-2">{item.storeName}</span>
              <span className="text-xs text-gray-500 shrink-0">
                {formatPrice(item.totalSpending)} · {item.totalOrders} order{item.totalOrders !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BuyerSpendingReportPage() {
  const { data: report, isLoading, isError } = useBuyerSpending();

  if (isLoading) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-56" />
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

  if (isError || !report) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Spending Report</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your purchase activity</p>
          </div>

          <Card>
            <div className="p-1">
              <p className="text-sm text-red-600">Failed to load spending report. Please try again.</p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/buyer/orders">
              <Button>View Orders</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasOrders = report.totalOrders > 0;

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Spending Report</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your purchase activity</p>
          </div>
          <div className="flex items-center gap-3">
            {hasOrders && report.exportRows && report.exportRows.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => downloadCsv(report.exportRows!)}>
                Export CSV
              </Button>
            )}
            <Link to="/buyer/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View Orders
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total Spending"
            value={formatPrice(report.totalSpending)}
            subtitle="All completed purchases"
          />
          <SummaryCard
            title="Total Orders"
            value={report.totalOrders.toLocaleString('id-ID')}
            subtitle="Orders recorded in your report"
          />
          <SummaryCard
            title="Average Order Value"
            value={formatPrice(report.averageOrderValue)}
            subtitle="Average spend per order"
          />
        </div>

        {hasOrders && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {report.totalDiscountUsed !== null && report.totalDiscountUsed !== undefined && (
              <InsightCard title="Discount Used" value={formatPrice(report.totalDiscountUsed)} />
            )}
            {report.totalDeliveryFees !== null && report.totalDeliveryFees !== undefined && (
              <InsightCard title="Delivery Fees" value={formatPrice(report.totalDeliveryFees)} />
            )}
            {report.totalTaxPaid !== null && report.totalTaxPaid !== undefined && (
              <InsightCard title="Tax Paid" value={formatPrice(report.totalTaxPaid)} />
            )}
            {report.totalItemsPurchased !== null && report.totalItemsPurchased !== undefined && (
              <InsightCard title="Items Purchased" value={report.totalItemsPurchased.toLocaleString('id-ID')} />
            )}
            {report.highestSpendingMonth && (
              <InsightCard title="Highest Month" value={report.highestSpendingMonth} />
            )}
            {report.latestOrderDate && (
              <InsightCard title="Latest Order" value={formatDate(report.latestOrderDate)} />
            )}
          </div>
        )}

        {!hasOrders && (
          <Card>
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-900">No spending data yet</p>
              <p className="text-sm text-gray-500 mt-1">You have not completed any purchases yet.</p>
              <Link to="/products" className="inline-block mt-4">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </Card>
        )}

        {hasOrders && (
          <>
            {report.monthlyTrend && report.monthlyTrend.length > 0 && (
              <Card header={<h2 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h2>}>
                <MonthlyTrendChart data={report.monthlyTrend} />
              </Card>
            )}

            {report.spendingByStore && report.spendingByStore.length > 0 && (
              <Card header={<h2 className="text-lg font-semibold text-gray-900">Spending by Store</h2>}>
                <SpendingByStoreChart data={report.spendingByStore} />
              </Card>
            )}

            {report.spendingByDeliveryMethod && report.spendingByDeliveryMethod.length > 0 && (
              <Card header={<h2 className="text-lg font-semibold text-gray-900">Spending by Delivery Method</h2>}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {report.spendingByDeliveryMethod.map((item) => (
                    <div
                      key={item.deliveryMethod}
                      className="bg-gray-50 rounded-lg border border-gray-100 p-4 text-center"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {DELIVERY_LABELS[item.deliveryMethod] || item.deliveryMethod}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.totalSpending)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.totalOrders} order{item.totalOrders !== 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {report.spendingByStatus && report.spendingByStatus.length > 0 && (
              <Card header={<h2 className="text-lg font-semibold text-gray-900">Spending by Status</h2>}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.spendingByStatus.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-100 px-4 py-3"
                    >
                      <Badge variant={STATUS_VARIANTS[item.status] || 'gray'} size="sm">
                        {STATUS_LABELS[item.status] || item.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(item.totalSpending)}</p>
                        <p className="text-xs text-gray-500">{item.totalOrders} order{item.totalOrders !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {report.topProducts && report.topProducts.length > 0 && (
              <Card header={<h2 className="text-lg font-semibold text-gray-900">Top Purchased Products</h2>}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="pb-2 pr-4">Product</th>
                        <th className="pb-2 pr-4 text-right">Qty</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topProducts.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="py-2.5 pr-4 text-gray-900 font-medium">
                            {item.productName || 'Unavailable product'}
                          </td>
                          <td className="py-2.5 pr-4 text-right text-gray-600">{item.quantity}</td>
                          <td className="py-2.5 text-right text-gray-900 font-medium">
                            {formatPrice(item.totalSpending)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {report.exportRows && report.exportRows.length > 0 && (
              <Card
                header={
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Spending</h2>
                    <Button variant="outline" size="sm" onClick={() => downloadCsv(report.exportRows!)}>
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
                        <th className="pb-2 pr-3">Status</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.exportRows.slice(0, 10).map((row) => (
                        <tr key={row.orderId} className="border-b border-gray-100 last:border-0">
                          <td className="py-2.5 pr-3 text-gray-600 whitespace-nowrap">{formatDate(row.date)}</td>
                          <td className="py-2.5 pr-3 text-gray-900 font-medium">{row.orderNumber}</td>
                          <td className="py-2.5 pr-3 text-gray-600">{row.storeName}</td>
                          <td className="py-2.5 pr-3">
                            <Badge variant={STATUS_VARIANTS[row.status] || 'gray'} size="sm">
                              {STATUS_LABELS[row.status] || row.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-right text-gray-900 font-medium">
                            {formatPrice(row.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Keep tracking your orders</h2>
                  <p className="text-sm text-gray-500 mt-1">Review your recent purchases and monitor future spending from your orders page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/buyer/orders">
                    <Button>View Orders</Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
