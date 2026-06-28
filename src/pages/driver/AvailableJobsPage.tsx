import { useState } from 'react';
import { useDriverJobs, useTakeDriverJob } from '../../hooks/useDriver';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import { formatPrice } from '../../types';
import { getDeliverySlaLabel } from '../../utils/delivery';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AvailableJobsPage() {
  const { data: jobs, isLoading, isError } = useDriverJobs();
  const takeJobMutation = useTakeDriverJob();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmJobId, setConfirmJobId] = useState<number | null>(null);

  const handleTakeJob = (jobId: number) => {
    setFeedback(null);
    takeJobMutation.mutate(jobId, {
      onSuccess: () => {
        setConfirmJobId(null);
        setFeedback({ type: 'success', message: 'Job taken successfully.' });
      },
      onError: (err: any) => {
        setConfirmJobId(null);
        setFeedback({ type: 'error', message: err.message || 'Failed to take job.' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Jobs</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-28 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Jobs</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load available jobs.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Jobs</h1>
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">No available jobs</p>
            <p className="text-sm text-gray-500">New delivery jobs will appear here when sellers process orders.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Jobs</h1>

      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          className="mb-4"
          onDismiss={() => setFeedback(null)}
        />
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{job.order?.orderNumber ?? job.orderId}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(job.createdAt)}</p>
              </div>
              <Badge variant="yellow">{getDeliverySlaLabel(job.deliveryMethod)}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              {job.order?.store && (
                <div>
                  <span className="text-gray-500">Store:</span>
                  <p className="font-medium text-gray-900">{job.order.store.name}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Delivery Fee:</span>
                <p className="font-medium text-gray-900">{formatPrice(job.deliveryFee)}</p>
              </div>
              <div>
                <span className="text-gray-500">Earning Estimate:</span>
                <p className="font-medium text-green-600">{formatPrice(job.deliveryFee ? String(Number(job.deliveryFee) * 0.9) : '0')}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium text-gray-900">{job.status}</p>
              </div>
            </div>

            {job.order?.address && (
              <div className="text-sm text-gray-600 mb-3 border-t pt-2">
                <span className="text-gray-500">Deliver to:</span>
                <p className="font-medium text-gray-900">{job.order.address.recipientName}</p>
                <p className="text-gray-600">{job.order.address.addressDetail}</p>
                {job.order.address.city && <p className="text-gray-600">{job.order.address.city}</p>}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                size="sm"
                  onClick={() => setConfirmJobId(job.id)}
                loading={takeJobMutation.isPending && takeJobMutation.variables === job.id}
                disabled={takeJobMutation.isPending}
              >
                Take Job
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmJobId !== null}
        title="Take Delivery Job?"
        message="You will be assigned to this delivery job."
        confirmLabel="Take Job"
        confirmVariant="primary"
        loading={takeJobMutation.isPending}
        onClose={() => setConfirmJobId(null)}
        onConfirm={() => { if (confirmJobId !== null) handleTakeJob(confirmJobId); }}
      />
    </div>
  );
}
