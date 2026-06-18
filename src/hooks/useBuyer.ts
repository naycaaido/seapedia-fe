import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  Wallet,
  WalletTransaction,
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
  TopUpWalletPayload,
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
