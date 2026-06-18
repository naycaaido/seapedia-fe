import Card from '../../components/ui/Card';

export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your wallet, cart, and orders.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">Wallet</h2>}>
          <p className="text-sm text-gray-500 mb-4">Check your balance and top up.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 3</div>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">My Cart</h2>}>
          <p className="text-sm text-gray-500 mb-4">View and manage your shopping cart.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 3</div>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">Order History</h2>}>
          <p className="text-sm text-gray-500 mb-4">Track your orders and view history.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 3</div>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Spending Report</h2>}>
        <p className="text-sm text-gray-500">Your spending summary will appear here.</p>
        <div className="text-sm text-gray-400 italic mt-2">Coming in Level 4</div>
      </Card>
    </div>
  );
}
