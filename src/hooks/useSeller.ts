import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  SellerDashboard,
  Store,
  SellerProduct,
  CreateStorePayload,
  UpdateStorePayload,
  CreateProductFormData,
  UpdateProductFormData,
  SellerOrder,
  SellerIncomeReport,
} from '../types';
import { toFormData } from '../types';

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
    queryFn: () => api.get<SellerProduct[]>('/seller/products'),
  });
}

export function useSellerProduct(id: number) {
  return useQuery({
    queryKey: ['seller-products', id],
    queryFn: () => api.get<SellerProduct>(`/seller/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductFormData) =>
      api.upload<SellerProduct>('/seller/products', toFormData(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductFormData }) =>
      api.uploadPatch<SellerProduct>(`/seller/products/${id}`, toFormData(payload)),
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
      api.delete<SellerProduct>(`/seller/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}

// Seller order hooks

export function useSellerOrders() {
  return useQuery({
    queryKey: ['seller-orders'],
    queryFn: () => api.get<SellerOrder[]>('/seller/orders'),
  });
}

export function useSellerOrder(id: number | undefined) {
  return useQuery({
    queryKey: ['seller-orders', id],
    queryFn: () => api.get<SellerOrder>(`/seller/orders/${id}`),
    enabled: !!id,
  });
}

export function useSellerIncome() {
  return useQuery({
    queryKey: ['seller-income'],
    queryFn: () => api.get<SellerIncomeReport>('/seller/reports/income'),
  });
}

export function useProcessSellerOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<SellerOrder>(`/seller/orders/${id}/process`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      queryClient.invalidateQueries({ queryKey: ['seller-orders', id] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });
}
