import { Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../types';

export default function BuyerDashboard() {
  const { data: wallet, isLoading } = useWallet();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your wallet, cart, and orders.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">My Wallet</h2>}>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(wallet?.balance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Available balance</p>
            </>
          )}
          <div className="mt-4">
            <Link to="/buyer/wallet">
              <Button variant="secondary" size="sm">View Wallet</Button>
            </Link>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">My Cart</h2>}>
          <p className="text-sm text-gray-500 mb-4">View and manage your shopping cart.</p>
          <div className="text-sm text-gray-400 italic">Coming in Phase 3B</div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Order History</h2>}>
          <p className="text-sm text-gray-500 mb-4">Track your orders and view history.</p>
          <div className="text-sm text-gray-400 italic">Coming in Phase 3C</div>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Quick Links</h2>}>
        <div className="flex flex-wrap gap-4">
          <Link to="/buyer/wallet">
            <Button size="sm">Wallet</Button>
          </Link>
          <Link to="/buyer/addresses">
            <Button variant="secondary" size="sm">Addresses</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
