import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Product } from '../types';

export function useProducts(search?: string) {
  return useQuery({
    queryKey: search ? ['products', { search }] : ['products'],
    queryFn: () => {
      const endpoint = search
        ? `/products?search=${encodeURIComponent(search)}`
        : '/products';
      return api.get<Product[]>(endpoint);
    },
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}
