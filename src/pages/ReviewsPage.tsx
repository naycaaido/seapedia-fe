import { useState } from 'react';
import { useReviews, useCreateReview } from '../hooks/useReviews';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Rating from '../components/ui/Rating';

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useReviews();
  const createReview = useCreateReview();

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (rating < 1 || rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    if (!comment.trim()) newErrors.comment = 'Comment is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    createReview.mutate(
      { reviewerName: name, rating, comment },
      {
        onSuccess: () => {
          setName('');
          setRating(0);
          setComment('');
        },
      },
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Reviews</h1>
      <p className="text-gray-500 mb-8">
        Share your experience using SEAPEDIA. Your feedback helps us improve!
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit a Review</h2>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Enter your name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <Rating value={rating} onChange={setRating} size="md" />
                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Write your review..."
                />
                {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
              </div>

              <Button type="submit" loading={createReview.isPending} className="w-full">
                Submit Review
              </Button>
              {createReview.isSuccess && (
                <p className="text-sm text-green-600 text-center">Review submitted successfully!</p>
              )}
            </form>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Reviews</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Rating value={review.rating} readonly size="sm" />
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{review.comment}</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">- {review.reviewerName}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
