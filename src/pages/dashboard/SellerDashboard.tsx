import { Link } from 'react-router-dom';
import { useSellerDashboard, useSellerOrders } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function SellerDashboard() {
  const { data: dashboard, isLoading } = useSellerDashboard();
  const { data: orders, isError: ordersError } = useSellerOrders();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!dashboard?.hasStore) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-500 mb-8">Get started by creating your store.</p>

        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don&apos;t have a store yet. Create one to start selling products.</p>
            <Link to="/seller/store">
              <Button>Create Store</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {dashboard.store?.name}!</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">My Store</h2>}>
          <p className="text-sm text-gray-500 mb-2">{dashboard.store?.name}</p>
          <p className="text-xs text-gray-400 mb-4">
            Created {dashboard.store?.createdAt ? new Date(dashboard.store.createdAt).toLocaleDateString() : ''}
          </p>
          <Link to="/seller/store">
            <Button variant="secondary" size="sm">Manage Store</Button>
          </Link>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">My Products</h2>}>
          <p className="text-sm text-gray-500 mb-1">{dashboard.activeProducts} active products</p>
          <p className="text-xs text-gray-400 mb-4">{dashboard.totalProducts} total (including inactive)</p>
          <Link to="/seller/products">
            <Button variant="secondary" size="sm">Manage Products</Button>
          </Link>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">Incoming Orders</h2>}>
          {ordersError ? (
            <p className="text-sm text-red-500 mb-4">Failed to load orders.</p>
          ) : orders ? (
            <>
              <p className="text-sm text-gray-500 mb-1">{orders.length} total orders</p>
              <p className="text-sm text-orange-600 font-medium mb-4">
                {orders.filter((o) => o.status === 'SEDANG_DIKEMAS').length} need processing
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Loading orders...</p>
          )}
          <Link to="/seller/orders">
            <Button variant="secondary" size="sm">View Orders</Button>
          </Link>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Quick Actions</h2>}>
        <div className="flex gap-4">
          <Link to="/seller/products/new">
            <Button size="sm">Add New Product</Button>
          </Link>
          <Link to="/seller/store">
            <Button variant="secondary" size="sm">Edit Store</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
