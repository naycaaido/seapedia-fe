import { useParams, Link } from 'react-router-dom';
import { useAdminOrder } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';
import { getDeliverySlaLabel } from '../../utils/delivery';

const statusVariant: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'> = {
  SEDANG_DIKEMAS: 'yellow',
  MENUNGGU_PENGIRIM: 'blue',
  SEDANG_DIKIRIM: 'purple',
  PESANAN_SELESAI: 'green',
  DIKEMBALIKAN: 'red',
};

const statusLabel: Record<string, string> = {
  SEDANG_DIKEMAS: 'Packing',
  MENUNGGU_PENGIRIM: 'Awaiting Driver',
  SEDANG_DIKIRIM: 'In Transit',
  PESANAN_SELESAI: 'Completed',
  DIKEMBALIKAN: 'Refunded',
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDeliveryDeadlineDisplay(order: { status: string; expiredAt: string | null | undefined }): { text: string; className: string } {
  if (order.status === 'PESANAN_SELESAI') {
    return { text: 'Completed', className: 'text-green-600' };
  }

  if (order.status === 'DIKEMBALIKAN') {
    return { text: 'Returned / Refunded', className: 'text-gray-600' };
  }

  if (!order.expiredAt) {
    return { text: '—', className: 'text-gray-900' };
  }

  const expiredAt = new Date(order.expiredAt);

  if (Number.isNaN(expiredAt.getTime())) {
    return { text: '—', className: 'text-gray-900' };
  }

  if (Date.now() > expiredAt.getTime()) {
    return { text: `Overdue • ${formatDateTime(order.expiredAt)}`, className: 'text-red-600' };
  }

  return { text: formatDateTime(order.expiredAt), className: 'text-gray-900' };
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { data: order, isLoading, isError, error } = useAdminOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-60 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load order: {(error as Error)?.message || 'Unknown error'}
        </div>
        <Link to="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">&larr; Back to Orders</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <p className="text-gray-500 text-center py-8">Order not found.</p>
        </Card>
        <Link to="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">&larr; Back to Orders</Link>
      </div>
    );
  }

  const deliveryDeadline = getDeliveryDeadlineDisplay(order);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
        <Badge variant={statusVariant[order.status] || 'gray'}>
          {statusLabel[order.status] || order.status}
        </Badge>
      </div>

      <div className="space-y-6">
        <Card header={<h2 className="font-semibold text-gray-900">Order Info</h2>}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Store:</span>
              <p className="text-gray-900 font-medium">{order.store?.name ?? '—'}</p>
            </div>
            <div>
              <span className="text-gray-500">Buyer ID:</span>
              <p className="text-gray-900 font-medium">{order.buyerId}</p>
            </div>
            <div>
              <span className="text-gray-500">Delivery Method:</span>
              <p className="text-gray-900 font-medium">{getDeliverySlaLabel(order.deliveryMethod)}</p>
            </div>
            <div>
              <span className="text-gray-500">Paid At:</span>
              <p className="text-gray-900 font-medium">{order.paidAt ? formatDateTime(order.paidAt) : '—'}</p>
            </div>
            <div>
              <span className="text-gray-500">Delivery Deadline:</span>
              <p className={`font-medium ${deliveryDeadline.className}`}>{deliveryDeadline.text}</p>
            </div>
          </div>
        </Card>

        {order.voucher && (
          <Card header={<h2 className="font-semibold text-gray-900">Applied Voucher</h2>}>
            <p className="text-sm text-gray-700">{order.voucher.name} ({order.voucher.code})</p>
          </Card>
        )}

        {order.promo && (
          <Card header={<h2 className="font-semibold text-gray-900">Applied Promo</h2>}>
            <p className="text-sm text-gray-700">{order.promo.name} ({order.promo.code})</p>
          </Card>
        )}

        <Card header={<h2 className="font-semibold text-gray-900">Shipping Address</h2>}>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.shippingRecipientName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Items</h2>}>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.productPrice)}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="text-green-600">-{formatPrice(order.discountAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-gray-900">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">PPN (12%)</span>
              <span className="text-gray-900">{formatPrice(order.ppnAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(order.finalTotal)}</span>
            </div>
          </div>
        </Card>

        {order.statusHistory && order.statusHistory.length > 0 && (
          <Card header={<h2 className="font-semibold text-gray-900">Status History</h2>}>
            <div className="space-y-3">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="flex items-center gap-3 text-sm">
                  <Badge variant={statusVariant[h.status] || 'gray'}>
                    {statusLabel[h.status] || h.status}
                  </Badge>
                  <span className="text-gray-500">{formatDateTime(h.createdAt)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
