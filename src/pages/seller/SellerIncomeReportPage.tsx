import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useSellerIncome } from '../../hooks/useSeller';
import { formatPrice } from '../../types';
import type {
  SellerIncomeMonthlyTrendItem,
  IncomeByProductItem,
  SellerIncomeByStatusItem,
  SellerIncomeByDeliveryMethodItem,
  SellerIncomeExportRow,
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

function generateCsv(rows: SellerIncomeExportRow[]): string {
  const headers = [
    'orderId', 'orderNumber', 'date', 'buyerName', 'status',
    'deliveryMethod', 'subtotal', 'discountAmount', 'sellerIncome',
    'totalItems',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      r.orderId, r.orderNumber, r.date, r.buyerName, r.status,
      r.deliveryMethod, r.subtotal, r.discountAmount, r.sellerIncome,
      r.totalItems,
    ].map(csvEscape).join(','));
  }
  return lines.join('\n');
}

function downloadCsv(rows: SellerIncomeExportRow[]) {
  const csv = generateCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'seapedia-seller-income-report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function MonthlyIncomeChart({ data }: { data: SellerIncomeMonthlyTrendItem[] }) {
  if (!data || data.length === 0) return null;
  const maxIncome = Math.max(...data.map((d) => Number(d.totalIncome)));
  if (maxIncome === 0) return null;

  if (data.length === 1) {
    const item = data[0];
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
        <p className="text-sm font-semibold text-gray-900">{item.month}</p>
        <p className="text-2xl font-bold text-primary-600 mt-1">{formatPrice(item.totalIncome)}</p>
        <p className="text-xs text-gray-500 mt-0.5">{item.totalOrders} order{item.totalOrders !== 1 ? 's' : ''}</p>
        <p className="text-xs text-gray-400 mt-2">Only one month of income data is available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => {
        const pct = (Number(item.totalIncome) / maxIncome) * 100;
        return (
          <div key={item.month} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16 shrink-0 text-right">{item.month}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-primary-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
            <span className="text-xs text-gray-700 w-24 shrink-0 text-right font-medium">
              {formatPrice(item.totalIncome)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function IncomeByProductTable({ data }: { data: IncomeByProductItem[] }) {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a, b) => Number(b.totalIncome) - Number(a.totalIncome));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <th className="pb-2 pr-3">Product</th>
            <th className="pb-2 pr-3 text-right">Qty</th>
            <th className="pb-2 pr-3 text-right">Gross</th>
            <th className="pb-2 text-right">Income</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 5).map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100 last:border-0">
              <td className="py-2 pr-3 text-gray-900 font-medium max-w-[180px] truncate">
                {item.productName || 'Unavailable product'}
              </td>
              <td className="py-2 pr-3 text-right text-gray-600">{item.quantity}</td>
              <td className="py-2 pr-3 text-right text-gray-900">{formatPrice(item.grossSales)}</td>
              <td className="py-2 text-right text-gray-900 font-medium">{formatPrice(item.totalIncome)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SellerIncomeReportPage() {
  const { data: report, isLoading, isError } = useSellerIncome();

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

  if (isError || !report) {
    return (
      <div className="bg-[#f9f9ff] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Income Report</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your seller earnings</p>
          </div>

          <Card>
            <div className="p-1">
              <p className="text-sm text-red-600">Failed to load income report. Please try again.</p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/seller/orders">
              <Button>View Orders</Button>
            </Link>
            <Link to="/seller/products">
              <Button variant="outline">Manage Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasOrders = report.totalOrders > 0;
  const topProduct = report.incomeByProduct && report.incomeByProduct.length > 0
    ? [...report.incomeByProduct].sort((a, b) => Number(b.totalIncome) - Number(a.totalIncome))[0]
    : null;

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Income Report</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your seller earnings</p>
          </div>
          <div className="flex items-center gap-3">
            {hasOrders && report.exportRows && report.exportRows.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => downloadCsv(report.exportRows!)}>
                Export CSV
              </Button>
            )}
            <Link to="/seller/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View Orders
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total Income"
            value={formatPrice(report.totalIncome)}
            subtitle="All recorded seller income"
          />
          <SummaryCard
            title="Total Orders"
            value={report.totalOrders.toLocaleString('id-ID')}
            subtitle="Orders included in this report"
          />
          <SummaryCard
            title="Average Income Per Order"
            value={formatPrice(report.averageIncomePerOrder)}
            subtitle="Average earnings per order"
          />
        </div>

        {hasOrders && (
          <Card header={<h2 className="text-lg font-semibold text-gray-900">Store Performance Insights</h2>}>
            <div className="space-y-2">
              {report.highestIncomeMonth ? (
                <p className="text-sm text-gray-700">
                  Your highest income was in <span className="font-semibold text-gray-900">{report.highestIncomeMonth.label}</span> with{' '}
                  <span className="font-semibold text-gray-900">{formatPrice(report.highestIncomeMonth.totalIncome)}</span>.
                </p>
              ) : (
                <p className="text-sm text-gray-500">No monthly income trend available yet.</p>
              )}
              {topProduct ? (
                <p className="text-sm text-gray-700">
                  Your best-selling product is <span className="font-semibold text-gray-900">{topProduct.productName || 'Unavailable product'}</span>.
                </p>
              ) : (
                <p className="text-sm text-gray-500">No product performance data available yet.</p>
              )}
              {report.totalItemsSold !== null && report.totalItemsSold !== undefined && (
                <p className="text-sm text-gray-700">
                  You sold <span className="font-semibold text-gray-900">{report.totalItemsSold}</span> item{report.totalItemsSold !== 1 ? 's' : ''} across{' '}
                  <span className="font-semibold text-gray-900">{report.totalOrders}</span> order{report.totalOrders !== 1 ? 's' : ''}.
                </p>
              )}
              {report.netIncome !== null && report.netIncome !== undefined && (
                <p className="text-sm text-gray-700">
                  Your current net income is <span className="font-semibold text-gray-900">{formatPrice(report.netIncome)}</span>.
                </p>
              )}
            </div>
          </Card>
        )}

        {hasOrders && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {report.grossSales !== null && report.grossSales !== undefined && (
              <InsightCard title="Gross Sales" value={formatPrice(report.grossSales)} />
            )}
            {report.netIncome !== null && report.netIncome !== undefined && (
              <InsightCard title="Net Income" value={formatPrice(report.netIncome)} />
            )}
            {report.totalDiscountGiven !== null && report.totalDiscountGiven !== undefined && (
              <InsightCard title="Discount Given" value={formatPrice(report.totalDiscountGiven)} />
            )}
            {report.totalItemsSold !== null && report.totalItemsSold !== undefined && (
              <InsightCard title="Items Sold" value={report.totalItemsSold.toLocaleString('id-ID')} />
            )}
            {report.highestIncomeMonth && (
              <InsightCard title="Highest Month" value={`${report.highestIncomeMonth.label} • ${formatPrice(report.highestIncomeMonth.totalIncome)}`} />
            )}
            {report.latestIncomeDate && (
              <InsightCard title="Latest Income" value={formatDate(report.latestIncomeDate)} />
            )}
          </div>
        )}

        {!hasOrders && (
          <Card>
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-900">No income data yet</p>
              <p className="text-sm text-gray-500 mt-1">Process orders to see your store income analytics here.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Link to="/seller/orders">
                  <Button>View Orders</Button>
                </Link>
                <Link to="/seller/products">
                  <Button variant="outline">Manage Products</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {hasOrders && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {report.monthlyTrend && report.monthlyTrend.length > 0 && (
                  <Card header={<h2 className="text-lg font-semibold text-gray-900">Monthly Income Trend</h2>}>
                    <MonthlyIncomeChart data={report.monthlyTrend} />
                  </Card>
                )}
              </div>

              <div>
                <Card header={<h2 className="text-lg font-semibold text-gray-900">Income Breakdown</h2>}>
                  {report.incomeByDeliveryMethod && report.incomeByDeliveryMethod.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Method</p>
                      <div className="space-y-1">
                        {report.incomeByDeliveryMethod.slice(0, 3).map((item) => (
                          <div key={item.deliveryMethod} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-700">{DELIVERY_LABELS[item.deliveryMethod] || item.deliveryMethod}</span>
                            <span className="text-xs text-gray-600">{formatPrice(item.totalIncome)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.incomeByStatus && report.incomeByStatus.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                      <div className="space-y-1">
                        {report.incomeByStatus.slice(0, 3).map((item) => (
                          <div key={item.status} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <Badge variant={STATUS_VARIANTS[item.status] || 'gray'} size="sm">
                              {STATUS_LABELS[item.status] || item.status}
                            </Badge>
                            <span className="text-xs text-gray-600">{formatPrice(item.totalIncome)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.totalDiscountGiven !== null && report.totalDiscountGiven !== undefined && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-1">
                      <span className="text-sm text-gray-700">Discount given</span>
                      <span className="text-xs text-amber-600 font-medium">{formatPrice(report.totalDiscountGiven)}</span>
                    </div>
                  )}
                  {report.grossSales !== null && report.grossSales !== undefined && report.netIncome !== null && report.netIncome !== undefined && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700">Gross → Net</span>
                      <span className="text-xs text-gray-600">{formatPrice(report.grossSales)} → {formatPrice(report.netIncome)}</span>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {report.incomeByProduct && report.incomeByProduct.length > 0 && (
                <Card header={<h2 className="text-lg font-semibold text-gray-900">Income by Product</h2>}>
                  <IncomeByProductTable data={report.incomeByProduct} />
                </Card>
              )}

              {report.exportRows && report.exportRows.length > 0 && (
                <Card
                  header={
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Income</h2>
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
                          <th className="pb-2 pr-3">Buyer</th>
                          <th className="pb-2 text-right">Income</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.exportRows.slice(0, 5).map((row) => (
                          <tr key={row.orderId} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{formatDate(row.date)}</td>
                            <td className="py-2 pr-3 text-gray-900 font-medium">{row.orderNumber}</td>
                            <td className="py-2 pr-3 text-gray-600">{row.buyerName}</td>
                            <td className="py-2 text-right text-gray-900 font-medium">
                              {formatPrice(row.sellerIncome)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Stay on top of store performance</p>
                <p className="text-xs text-gray-500 mt-0.5">Use your orders and products pages to keep fulfillment smooth.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/seller/orders">
                  <Button size="sm">View Orders</Button>
                </Link>
                <Link to="/seller/products">
                  <Button variant="outline" size="sm">Manage Products</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
