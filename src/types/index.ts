export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
}

export interface AuthResponse {
  user: User;
  roles: string[];
  activeRole: string | null;
  accessToken: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  password: string;
  roles: string[];
}

export interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl?: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  store: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface SellerProduct extends Product {
  imagePath: string | null;
}

export interface Store {
  id: number;
  name: string;
  description?: string | null;
  sellerUser: { fullName: string };
  products: Product[];
  createdAt: string;
}

export interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface SellerDashboard {
  hasStore: boolean;
  store: {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
  } | null;
  totalProducts: number;
  activeProducts: number;
}

export interface CreateStorePayload {
  name: string;
  description: string;
}

export interface UpdateStorePayload {
  name?: string;
  description?: string;
}

export interface CreateProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: File;
}

export interface UpdateProductFormData {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  image?: File;
}

export function toFormData(payload: CreateProductFormData | UpdateProductFormData): FormData {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.price !== undefined) formData.append('price', payload.price);
  if (payload.stock !== undefined) formData.append('stock', payload.stock);
  if (payload.image !== undefined) formData.append('image', payload.image);
  return formData;
}

export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === '') return 'Rp0';
  const num = Number(price);
  if (isNaN(num)) return 'Rp0';
  return `Rp${num.toLocaleString('id-ID')}`;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are accepted.';
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

// Buyer types

export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: number;
  walletId: number;
  type: 'TOP_UP' | 'PAYMENT' | 'REFUND' | 'ADJUSTMENT';
  amount: string;
  description: string;
  referenceId: number | null;
  createdAt: string;
}

export interface Address {
  id: number;
  buyerId: number;
  recipientName: string;
  phone: string;
  addressDetail: string;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  recipientName: string;
  phone: string;
  addressDetail: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  recipientName?: string;
  phone?: string;
  addressDetail?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface TopUpWalletPayload {
  amount: number;
}
