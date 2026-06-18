import Card from '../../components/ui/Card';

export default function DriverDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
      <p className="text-gray-500 mb-8">Find delivery jobs and track your earnings.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">Available Jobs</h2>}>
          <p className="text-sm text-gray-500 mb-4">Browse and take delivery jobs.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 5</div>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">Active Job</h2>}>
          <p className="text-sm text-gray-500 mb-4">Track your current delivery.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 5</div>
        </Card>
        <Card header={<h2 className="font-semibold text-gray-900">Earnings</h2>}>
          <p className="text-sm text-gray-500 mb-4">View your delivery earnings.</p>
          <div className="text-sm text-gray-400 italic">Coming in Level 5</div>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Job History</h2>}>
        <p className="text-sm text-gray-500">Your completed delivery jobs will appear here.</p>
        <div className="text-sm text-gray-400 italic mt-2">Coming in Level 5</div>
      </Card>
    </div>
  );
}
