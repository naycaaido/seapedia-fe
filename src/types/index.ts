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
  price: number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store: {
    id: number;
    name: string;
    description?: string;
  };
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

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
}
