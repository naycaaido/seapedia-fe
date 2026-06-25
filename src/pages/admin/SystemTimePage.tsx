import { useState } from 'react';
import { useSystemTime, useSimulateNextDay } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function SystemTimePage() {
  const { data: timeData, isLoading, isError, error } = useSystemTime();
  const simulateNextDay = useSimulateNextDay();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSimulate() {
    if (!window.confirm('Advance system time by 1 day and automatically process overdue refunds?')) return;
    setFeedback(null);
    try {
      const res = await simulateNextDay.mutateAsync();
      const processed = res.refundResult?.processedCount ?? 0;
      const skipped = res.refundResult?.skippedCount ?? 0;
      const refundMsg = processed > 0 || skipped > 0
        ? ` ${processed} overdue order(s) refunded, ${skipped} skipped.`
        : '';
      setFeedback({
        type: 'success',
        message: `Time advanced: ${new Date(res.previousTime).toLocaleString()} → ${new Date(res.newTime).toLocaleString()}.${refundMsg}`,
      });
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Failed to simulate next day' });
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Time</h1>

      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-lg mb-6 ${feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}
        >
          {feedback.message}
        </div>
      )}

      <Card header={<h2 className="font-semibold text-gray-900">Current System Time</h2>}>
        {isLoading && (
          <div className="animate-pulse h-10 bg-gray-200 rounded" />
        )}
        {isError && (
          <div className="text-red-600 text-sm">
            Failed to load system time: {(error as Error)?.message || 'Unknown error'}
          </div>
        )}
        {!isLoading && !isError && timeData && (
          <div className="text-center py-6">
            <p className="text-3xl font-bold text-gray-900">
              {timeData.currentDatetime ? new Date(timeData.currentDatetime).toLocaleString() : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">System Datetime</p>
          </div>
        )}
      </Card>

      <div className="mt-8">
        <Card header={<h2 className="font-semibold text-gray-900">Simulate Next Day</h2>}>
          <p className="text-sm text-gray-600 mb-4">
            Advance the system time by 1 day. This also automatically processes refunds for all
            overdue orders. You can still manually refund overdue orders from the Overdue Orders
            page if needed.
          </p>
          <Button
            onClick={handleSimulate}
            loading={simulateNextDay.isPending}
            disabled={simulateNextDay.isPending}
            className="w-full"
          >
            Simulate Next Day &amp; Process Overdue Refunds
          </Button>
        </Card>
      </div>
    </div>
  );
}
