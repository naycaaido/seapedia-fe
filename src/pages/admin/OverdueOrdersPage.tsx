import { useState } from 'react';
import { useOverdueOrders, useRefundOrder, useRefundAllOverdueOrders } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../types';

export default function OverdueOrdersPage() {
  const { data: orders, isLoading, isError, error } = useOverdueOrders();
  const refundOrder = useRefundOrder();
  const refundAll = useRefundAllOverdueOrders();

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message });
  }

  async function handleRefund(id: number) {
    if (!window.confirm(`Refund order #${id}? This action cannot be undone.`)) return;
    setFeedback(null);
    try {
      await refundOrder.mutateAsync(id);
      showFeedback('success', `Order #${id} refunded successfully.`);
    } catch (e: any) {
      showFeedback('error', e.message || `Failed to refund order #${id}`);
    }
  }

  async function handleRefundAll() {
    if (!window.confirm('Refund ALL overdue orders? This action cannot be undone.')) return;
    setFeedback(null);
    try {
      const res = await refundAll.mutateAsync();
      showFeedback('success', `Processed ${res.processedCount} refund(s), skipped ${res.skippedCount}.`);
    } catch (e: any) {
      showFeedback('error', e.message || 'Failed to refund all overdue orders');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overdue Orders</h1>
        <Button
          variant="danger"
          onClick={handleRefundAll}
          loading={refundAll.isPending}
          disabled={refundAll.isPending || refundOrder.isPending || (!isLoading && orders && orders.length === 0)}
        >
          Refund All
        </Button>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-lg mb-6 ${feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}
        >
          {feedback.message}
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load overdue orders: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No overdue orders found.</p>
        </Card>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.orderNumber ?? `Order #${order.id}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.store?.name && `${order.store.name} · `}
                    {order.buyer?.fullName && `Buyer: ${order.buyer.fullName} · `}
                    Overdue: {order.overdueDuration ?? '—'}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{formatPrice(order.finalTotal)}</p>
                    <Badge variant="red">Overdue</Badge>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRefund(order.id)}
                    loading={refundOrder.isPending && refundOrder.variables === order.id}
                    disabled={refundOrder.isPending || refundAll.isPending}
                  >
                    Refund
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
