import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

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

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useAdminOrders();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load orders: {(error as Error)?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <Card>
          <p className="text-gray-500 text-center py-8">No orders found.</p>
        </Card>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/admin/orders/${order.id}`}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {order.store?.name ?? 'Unknown Store'}
                      {order.buyerId && ` · Buyer #${order.buyerId}`}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{formatPrice(order.finalTotal)}</p>
                      <Badge variant={statusVariant[order.status] || 'gray'}>
                        {statusLabel[order.status] || order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
