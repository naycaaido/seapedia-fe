import { useState } from 'react';
import { useWallet, useWalletTransactions, useTopUpWallet } from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

const MIN_TOP_UP = 1000;

export default function WalletPage() {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWallet();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions();
  const topUpMutation = useTopUpWallet();

  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpError, setTopUpError] = useState('');

  const handleTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!topUpAmount || isNaN(amount)) {
      setTopUpError('Please enter a valid amount.');
      return;
    }
    if (amount < MIN_TOP_UP) {
      setTopUpError(`Minimum top-up is ${formatPrice(MIN_TOP_UP)}.`);
      return;
    }
    setTopUpError('');
    try {
      await topUpMutation.mutateAsync({ amount });
      setTopUpAmount('');
    } catch {
      // error handled by mutation
    }
  };

  if (walletLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Wallet</h1>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Failed to load wallet.</p>
            <p className="text-sm text-gray-500">{walletError.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wallet</h1>
      <p className="text-gray-500 mb-8">Manage your wallet balance and view transaction history.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">Balance</h2>}>
          <div className="py-4">
            <p className="text-3xl font-bold text-primary-600">
              {formatPrice(wallet?.balance)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Available balance</p>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Top Up</h2>}>
          <div className="space-y-4">
            <Input
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              error={topUpError}
              helperText={`Minimum: ${formatPrice(MIN_TOP_UP)}`}
            />
            <Button
              onClick={handleTopUp}
              loading={topUpMutation.isPending}
              disabled={topUpMutation.isPending}
            >
              Top Up
            </Button>
          </div>
        </Card>
      </div>

      <Card header={<h2 className="font-semibold text-gray-900">Transaction History</h2>}>
        {txLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet.</p>
            <p className="text-sm mt-1">Your transaction history will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <Badge
                      variant={
                        tx.type === 'TOP_UP'
                          ? 'green'
                          : tx.type === 'REFUND'
                          ? 'blue'
                          : tx.type === 'PAYMENT'
                          ? 'red'
                          : 'gray'
                      }
                    >
                      {tx.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(tx.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    Number(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Number(tx.amount) >= 0 ? '+' : ''}{formatPrice(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
