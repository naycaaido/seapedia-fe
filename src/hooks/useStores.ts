import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Store } from '../types';

export function useStore(id: number) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => api.get<Store>(`/stores/${id}`),
    enabled: !!id,
  });
}
