import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSellerOrder, useProcessSellerOrder } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import { formatPrice } from '../../types';
import { getDeliverySlaLabel } from '../../utils/delivery';

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDeliveryDeadlineDisplay(order: { status: string; expiredAt: string | null | undefined }): { text: string; className: string } {
  if (order.status === 'PESANAN_SELESAI') {
    return { text: 'Completed', className: 'font-medium text-green-600' };
  }

  if (order.status === 'DIKEMBALIKAN') {
    return { text: 'Returned / Refunded', className: 'font-medium text-gray-600' };
  }

  if (!order.expiredAt) {
    return { text: '-', className: 'font-medium text-gray-900' };
  }

  const expiredAt = new Date(order.expiredAt);

  if (Number.isNaN(expiredAt.getTime())) {
    return { text: '-', className: 'font-medium text-gray-900' };
  }

  if (Date.now() > expiredAt.getTime()) {
    return { text: `Overdue • ${formatDate(order.expiredAt)}`, className: 'font-medium text-red-600' };
  }

  return { text: formatDate(order.expiredAt), className: 'font-medium text-gray-900' };
}

export default function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { data: order, isLoading, isError } = useSellerOrder(orderId);
  const processMutation = useProcessSellerOrder();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleProcess = () => {
    if (!order) return;
    setFeedback(null);
    processMutation.mutate(order.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setFeedback({ type: 'success', message: 'Order processed successfully.' });
      },
      onError: (err: any) => {
        setConfirmOpen(false);
        setFeedback({ type: 'error', message: err.message || 'Failed to process order.' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Detail</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Order not found.</p>
            <Link to="/seller/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Back to orders
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const deliveryDeadline = getDeliveryDeadlineDisplay(order);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/seller/orders" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
            &larr; Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        </div>
        <Badge variant={STATUS_VARIANTS[order.status] || 'blue'}>
          {STATUS_LABELS[order.status] || order.status}
        </Badge>
      </div>

      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          className="mb-6"
          onDismiss={() => setFeedback(null)}
        />
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer Info */}
          {order.buyer && (
            <Card header={<h2 className="font-semibold text-gray-900">Buyer</h2>}>
              <div className="space-y-1 text-sm">
                <p className="text-gray-900 font-medium">{order.buyer.fullName}</p>
                <p className="text-gray-500">@{order.buyer.username}</p>
                {order.buyer.email && <p className="text-gray-500">{order.buyer.email}</p>}
                {order.buyer.phone && <p className="text-gray-500">{order.buyer.phone}</p>}
              </div>
            </Card>
          )}

          {/* Items */}
          <Card header={<h2 className="font-semibold text-gray-900">Items</h2>}>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(item.productPrice)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping Info */}
          <Card header={<h2 className="font-semibold text-gray-900">Shipping</h2>}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient</span>
                <span className="font-medium">{order.shippingRecipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{order.shippingPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
                <span className="font-medium text-right max-w-[250px]">{order.shippingAddress}</span>
              </div>
              {order.address && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City</span>
                    <span className="font-medium">{order.address.city || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Province</span>
                    <span className="font-medium">{order.address.province || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Postal Code</span>
                    <span className="font-medium">{order.address.postalCode || '-'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-right max-w-[250px]">{getDeliverySlaLabel(order.deliveryMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Deadline</span>
                <span className={`text-right max-w-[250px] ${deliveryDeadline.className}`}>{deliveryDeadline.text}</span>
              </div>
            </div>
          </Card>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <Card header={<h2 className="font-semibold text-gray-900">Status History</h2>}>
              <div className="space-y-3">
                {order.statusHistory.map((h) => (
                  <div key={h.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {STATUS_LABELS[h.status] || h.status}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(h.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Price Breakdown */}
          <Card header={<h2 className="font-semibold text-gray-900">Price Breakdown</h2>}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600 font-medium">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PPN (12%)</span>
                <span className="font-medium">{formatPrice(order.ppnAmount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">{formatPrice(order.finalTotal)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Process Action */}
          {order.status === 'SEDANG_DIKEMAS' && (
            <Button
              className="w-full"
              onClick={() => setConfirmOpen(true)}
              loading={processMutation.isPending}
              disabled={processMutation.isPending}
            >
              Process Order
            </Button>
          )}

          <Link to="/seller/orders">
            <Button variant="outline" className="w-full">Back to Orders</Button>
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Process Order?"
        message="This will move the order to delivery."
        confirmLabel="Process Order"
        confirmVariant="primary"
        loading={processMutation.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleProcess}
      />
    </div>
  );
}
