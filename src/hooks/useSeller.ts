import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  SellerDashboard,
  Store,
  Product,
  CreateStorePayload,
  UpdateStorePayload,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types';

export function useSellerDashboard() {
  return useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: () => api.get<SellerDashboard>('/seller/dashboard'),
  });
}

export function useSellerStore() {
  return useQuery({
    queryKey: ['seller-store'],
    queryFn: () => api.get<Store>('/seller/store'),
    retry: false,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStorePayload) =>
      api.post<Store>('/seller/store', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-store'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStorePayload) =>
      api.patch<Store>('/seller/store', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-store'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

export function useSellerProducts() {
  return useQuery({
    queryKey: ['seller-products'],
    queryFn: () => api.get<Product[]>('/seller/products'),
  });
}

export function useSellerProduct(id: number) {
  return useQuery({
    queryKey: ['seller-products', id],
    queryFn: () => api.get<Product>(`/seller/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      api.post<Product>('/seller/products', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      api.patch<Product>(`/seller/products/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<Product>(`/seller/products/${id}`, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}
