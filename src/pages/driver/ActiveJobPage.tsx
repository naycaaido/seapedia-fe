import { useState } from 'react';
// Deriving active job from /driver/history because there is no dedicated
// active-job endpoint in the API contract. We filter for status === 'TAKEN'.
import { useDriverHistory, useCompleteDriverJob } from '../../hooks/useDriver';
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

export default function ActiveJobPage() {
  const { data: history, isLoading, isError } = useDriverHistory();
  const completeMutation = useCompleteDriverJob();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [completedJobId, setCompletedJobId] = useState<number | null>(null);
  const [confirmJobId, setConfirmJobId] = useState<number | null>(null);

  const activeJobs = (history ?? []).filter((j) => j.status === 'TAKEN');
  const activeJob = activeJobs.length > 0 ? activeJobs[0] : null;

  const handleComplete = (jobId: number) => {
    setFeedback(null);
    completeMutation.mutate(jobId, {
      onSuccess: () => {
        setConfirmJobId(null);
        setCompletedJobId(jobId);
        setFeedback({ type: 'success', message: 'Job completed successfully.' });
      },
      onError: (err: any) => {
        setConfirmJobId(null);
        setFeedback({ type: 'error', message: err.message || 'Failed to complete job.' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Job</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Job</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load active job.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!activeJob) {
    if (completedJobId) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Job</h1>
          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              className="mb-4"
              onDismiss={() => setFeedback(null)}
            />
          )}
          <Card>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">Job completed successfully</p>
              <p className="text-sm text-gray-500">This delivery has been marked as delivered.</p>
            </div>
          </Card>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Job</h1>
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">No active job</p>
            <p className="text-sm text-gray-500">Take a job from the available jobs page to start delivering.</p>
          </div>
        </Card>
      </div>
    );
  }

  const job = activeJob;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Job</h1>

      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          className="mb-4"
          onDismiss={() => setFeedback(null)}
        />
      )}

      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Order #{job.order?.orderNumber ?? job.orderId}
            </p>
            <p className="text-sm text-gray-500 mt-1">{formatDate(job.createdAt)}</p>
          </div>
          <Badge variant="purple">{getDeliverySlaLabel(job.deliveryMethod)}</Badge>
        </div>

        {job.order?.store && (
          <div className="mb-4">
            <span className="text-sm text-gray-500">Store:</span>
            <p className="font-medium text-gray-900">{job.order.store.name}</p>
          </div>
        )}

        {job.order?.items && job.order.items.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 block mb-1">Items:</span>
            <ul className="text-sm text-gray-900 space-y-1">
              {job.order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.productName} x{item.quantity}</span>
                  <span className="text-gray-600">{formatPrice(item.productPrice)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.order?.address && (
          <div className="mb-4 border-t pt-3">
            <span className="text-sm text-gray-500 block mb-1">Deliver to:</span>
            <p className="font-medium text-gray-900">{job.order.address.recipientName}</p>
            <p className="text-sm text-gray-600">{job.order.address.phone}</p>
            <p className="text-sm text-gray-600">{job.order.address.addressDetail}</p>
            {job.order.address.city && <p className="text-sm text-gray-600">{job.order.address.city}</p>}
            {job.order.address.province && <p className="text-sm text-gray-600">{job.order.address.province}</p>}
          </div>
        )}

        <div className="border-t pt-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Delivery Fee:</span>
            <p className="font-semibold text-gray-900">{formatPrice(job.deliveryFee)}</p>
          </div>
          {!completedJobId && (
            <Button
              onClick={() => setConfirmJobId(job.id)}
              loading={completeMutation.isPending && completeMutation.variables === job.id}
              disabled={completeMutation.isPending}
            >
              Complete Job
            </Button>
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={confirmJobId !== null}
        title="Complete Delivery Job?"
        message="This will mark the delivery as completed."
        confirmLabel="Complete Job"
        confirmVariant="primary"
        loading={completeMutation.isPending}
        onClose={() => setConfirmJobId(null)}
        onConfirm={() => { if (confirmJobId !== null) handleComplete(confirmJobId); }}
      />
    </div>
  );
}