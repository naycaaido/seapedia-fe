import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Review, CreateReviewPayload } from '../types';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.get<Review[]>('/reviews'),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      api.post<Review>('/reviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
