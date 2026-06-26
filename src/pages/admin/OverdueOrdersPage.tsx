import { useState } from 'react';
import { useOverdueOrders, useRefundOrder, useRefundAllOverdueOrders } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import { formatPrice } from '../../types';

export default function OverdueOrdersPage() {
  const { data: orders, isLoading, isError, error } = useOverdueOrders();
  const refundOrder = useRefundOrder();
  const refundAll = useRefundAllOverdueOrders();

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'single'; id: number } | { type: 'all' } | null>(null);

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message });
  }

  async function handleRefund(id: number) {
    setFeedback(null);
    try {
      await refundOrder.mutateAsync(id);
      setConfirmAction(null);
      showFeedback('success', `Order #${id} refunded successfully.`);
    } catch (e: any) {
      setConfirmAction(null);
      showFeedback('error', e.message || `Failed to refund order #${id}`);
    }
  }

  async function handleRefundAll() {
    setFeedback(null);
    try {
      const res = await refundAll.mutateAsync();
      setConfirmAction(null);
      showFeedback('success', `Processed ${res.processedCount} refund(s), skipped ${res.skippedCount}.`);
    } catch (e: any) {
      setConfirmAction(null);
      showFeedback('error', e.message || 'Failed to refund all overdue orders');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overdue Orders</h1>
        <Button
          variant="danger"
          onClick={() => setConfirmAction({ type: 'all' })}
          loading={refundAll.isPending}
          disabled={refundAll.isPending || refundOrder.isPending || (!isLoading && orders && orders.length === 0)}
        >
          Refund All
        </Button>
      </div>

      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          className="mb-6"
          onDismiss={() => setFeedback(null)}
        />
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
                    onClick={() => setConfirmAction({ type: 'single', id: order.id })}
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

      <ConfirmModal
        isOpen={confirmAction !== null}
        title={confirmAction?.type === 'all' ? 'Refund All Overdue Orders?' : 'Refund Order?'}
        message={
          confirmAction?.type === 'all'
            ? 'This will refund all overdue orders. This action cannot be undone.'
            : `Refund order #${confirmAction?.type === 'single' ? confirmAction.id : ''}? This action cannot be undone.`
        }
        confirmLabel={confirmAction?.type === 'all' ? 'Refund All' : 'Refund Order'}
        confirmVariant="danger"
        loading={refundOrder.isPending || refundAll.isPending}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.type === 'single') handleRefund(confirmAction.id);
          else if (confirmAction?.type === 'all') handleRefundAll();
        }}
      />
    </div>
  );
}
