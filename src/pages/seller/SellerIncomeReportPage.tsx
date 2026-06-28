import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useSellerIncome } from '../../hooks/useSeller';
import { formatPrice } from '../../types';

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </Card>
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

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Income Report</h1>
            <p className="text-base text-gray-500 mt-1">Summary of your seller earnings</p>
          </div>
          <Link to="/seller/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View Orders
          </Link>
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

        {!hasOrders && (
          <Card>
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-900">No income data yet</p>
              <p className="text-sm text-gray-500 mt-1">No completed seller orders yet.</p>
              <Link to="/seller/products" className="inline-block mt-4">
                <Button>Manage Products</Button>
              </Link>
            </div>
          </Card>
        )}

        {hasOrders && (
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Stay on top of store performance</h2>
                <p className="text-sm text-gray-500 mt-1">Use your orders and products pages to keep fulfillment smooth and maintain healthy earnings.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
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
      </div>
    </div>
  );
}
