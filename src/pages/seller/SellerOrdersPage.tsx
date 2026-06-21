import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSellerOrders, useProcessSellerOrder } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SellerOrdersPage() {
  const { data: orders, isLoading, isError } = useSellerOrders();
  const processMutation = useProcessSellerOrder();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleProcess = (orderId: number) => {
    if (!window.confirm('Process this order and move it to delivery?')) return;
    setFeedback(null);
    processMutation.mutate(orderId, {
      onSuccess: () => {
        setFeedback({ type: 'success', message: 'Order processed successfully.' });
      },
      onError: (err: any) => {
        setFeedback({ type: 'error', message: err.message || 'Failed to process order.' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Incoming Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-28 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Incoming Orders</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load orders.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Incoming Orders</h1>
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">No orders yet</p>
            <p className="text-sm text-gray-500">When buyers place orders, they will appear here.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Incoming Orders</h1>

      {feedback && (
        <div
          role="alert"
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link
                  to={`/seller/orders/${order.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {order.orderNumber}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANTS[order.status] || 'blue'}>
                {STATUS_LABELS[order.status] || order.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>
                  {order.items?.length ?? 0} {order.items?.length === 1 ? 'item' : 'items'}
                </p>
                {order.buyer && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyer: {order.buyer.fullName} ({order.buyer.username})
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-primary-600">{formatPrice(order.finalTotal)}</p>
                {order.status === 'SEDANG_DIKEMAS' && (
                  <Button
                    size="sm"
                    onClick={() => handleProcess(order.id)}
                    loading={processMutation.isPending && processMutation.variables === order.id}
                    disabled={processMutation.isPending}
                  >
                    Process
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
