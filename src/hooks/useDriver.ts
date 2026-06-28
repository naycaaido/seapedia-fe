import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { DeliveryJob, DriverEarningsSummary } from '../types';

export function useDriverJobs() {
  return useQuery({
    queryKey: ['driver-jobs'],
    queryFn: () => api.get<DeliveryJob[]>('/driver/jobs'),
  });
}

export function useDriverJob(id: number | undefined) {
  return useQuery({
    queryKey: ['driver-jobs', id],
    queryFn: () => api.get<DeliveryJob>(`/driver/jobs/${id}`),
    enabled: !!id,
  });
}

export function useTakeDriverJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<DeliveryJob>(`/driver/jobs/${id}/take`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['driver-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['driver-jobs', id] });
      queryClient.invalidateQueries({ queryKey: ['driver-history'] });
      queryClient.invalidateQueries({ queryKey: ['driver-earnings'] });
    },
  });
}

export function useCompleteDriverJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<DeliveryJob>(`/driver/jobs/${id}/complete`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['driver-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['driver-jobs', id] });
      queryClient.invalidateQueries({ queryKey: ['driver-history'] });
      queryClient.invalidateQueries({ queryKey: ['driver-earnings'] });
    },
  });
}

export function useDriverHistory() {
  return useQuery({
    queryKey: ['driver-history'],
    queryFn: () => api.get<DeliveryJob[]>('/driver/history'),
  });
}

export function useDriverEarnings() {
  return useQuery({
    queryKey: ['driver-earnings'],
    queryFn: () => api.get<DriverEarningsSummary>('/driver/earnings'),
  });
}
