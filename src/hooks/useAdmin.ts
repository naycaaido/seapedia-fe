import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  AdminSummary,
  AdminUser,
  AdminStore,
  Product,
  Order,
  DeliveryJob,
  AdminDiscountsResponse,
  OverdueOrderSummary,
  SystemTimeResponse,
  SimulateNextDayResponse,
  RefundOrderResult,
  RefundAllResponse,
  CreateVoucherPayload,
  CreatePromoPayload,
} from '../types';

export function useAdminSummary() {
  return useQuery({
    queryKey: ['admin-summary'],
    queryFn: () => api.get<AdminSummary>('/admin/summary'),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/admin/users'),
  });
}

export function useAdminStores() {
  return useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => api.get<AdminStore[]>('/admin/stores'),
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get<Product[]>('/admin/products'),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<Order[]>('/admin/orders'),
  });
}

export function useAdminOrder(id: number | undefined) {
  return useQuery({
    queryKey: ['admin-orders', id],
    queryFn: () => api.get<Order>(`/admin/orders/${id}`),
    enabled: !!id,
  });
}

export function useAdminDeliveryJobs() {
  return useQuery({
    queryKey: ['admin-delivery-jobs'],
    queryFn: () => api.get<DeliveryJob[]>('/admin/delivery-jobs'),
  });
}

export function useAdminDiscounts() {
  return useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => api.get<AdminDiscountsResponse>('/admin/discounts'),
  });
}

export function useOverdueOrders() {
  return useQuery({
    queryKey: ['admin-overdue-orders'],
    queryFn: () => api.get<OverdueOrderSummary[]>('/admin/overdue-orders'),
  });
}

export function useSystemTime() {
  return useQuery({
    queryKey: ['admin-system-time'],
    queryFn: () => api.get<SystemTimeResponse>('/admin/system-time'),
  });
}

export function useSimulateNextDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<SimulateNextDayResponse>('/admin/system-time/simulate-next-day'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-system-time'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-delivery-jobs'] });
    },
  });
}

export function useRefundOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<RefundOrderResult>(`/admin/orders/${id}/refund`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-orders'] });
    },
  });
}

export function useRefundAllOverdueOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<RefundAllResponse>('/admin/overdue-orders/refund-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overdue-orders'] });
    },
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVoucherPayload) =>
      api.post('/admin/vouchers', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
    },
  });
}

export function useCreatePromo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromoPayload) =>
      api.post('/admin/promos', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
    },
  });
}
