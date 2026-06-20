import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  Wallet,
  WalletTransaction,
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
  TopUpWalletPayload,
  Cart,
  AddCartItemPayload,
  UpdateCartItemPayload,
  Order,
  CheckoutPayload,
  DiscountValidationResult,
} from '../types';

// Wallet hooks

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get<Wallet>('/wallet'),
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => api.get<WalletTransaction[]>('/wallet/transactions'),
  });
}

export function useTopUpWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TopUpWalletPayload) =>
      api.post<Wallet>('/wallet/top-up', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
}

// Address hooks

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get<Address[]>('/addresses'),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      api.post<Address>('/addresses', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAddressPayload }) =>
      api.patch<Address>(`/addresses/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<{ message: string }>(`/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<Address>(`/addresses/${id}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

// Cart hooks

interface UseCartOptions {
  enabled?: boolean;
}

export function useCart(options?: UseCartOptions) {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get<Cart>('/cart'),
    enabled: options?.enabled ?? true,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCartItemPayload) =>
      api.post<Cart>('/cart/items', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCartItemPayload }) =>
      api.patch<Cart>(`/cart/items/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<Cart>(`/cart/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.delete<Cart>('/cart/clear'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Checkout hook

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      api.post<Order>('/checkout', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Order hooks

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<Order[]>('/orders'),
  });
}

export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => api.get<Order>(`/orders/${id}`),
    enabled: !!id,
  });
}

// Discount validation

export function useValidateDiscount(code: string, subtotal: number) {
  return useQuery({
    queryKey: ['discount-validation', code, subtotal],
    queryFn: () =>
      api.get<DiscountValidationResult>(
        `/discounts/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`
      ),
    enabled: !!code && subtotal > 0,
    staleTime: 30000,
  });
}
