interface FeedbackBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message?: string | null;
  onDismiss?: () => void;
  className?: string;
}

const STYLES: Record<string, string> = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

export default function FeedbackBanner({
  type,
  message,
  onDismiss,
  className = '',
}: FeedbackBannerProps) {
  if (!message) return null;

  return (
    <div
      role={type === 'error' || type === 'warning' ? 'alert' : undefined}
      className={`px-4 py-3 rounded-lg border text-sm ${STYLES[type]} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
