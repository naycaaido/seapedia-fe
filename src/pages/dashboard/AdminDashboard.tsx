import Card from '../../components/ui/Card';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '—', color: 'bg-blue-500' },
    { label: 'Total Stores', value: '—', color: 'bg-green-500' },
    { label: 'Total Products', value: '—', color: 'bg-purple-500' },
    { label: 'Total Orders', value: '—', color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Marketplace monitoring and management.</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Monitoring (Coming Soon)</h2>}>
        <div className="space-y-3">
          {['Users', 'Stores', 'Products', 'Orders', 'Vouchers', 'Promos', 'Delivery Jobs', 'Overdue Orders'].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <span className="text-xs text-gray-400">Level 6</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
