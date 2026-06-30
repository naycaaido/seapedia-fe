export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  profileImageUrl?: string | null;
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

export interface SellerIncomeReport {
  totalIncome: string;
  totalOrders: number;
  averageIncomePerOrder: string;
  highestIncomeMonth?: { month: string; label: string; totalIncome: string; totalOrders: number } | null;
  latestIncomeDate?: string | null;
  totalItemsSold?: number | null;
  grossSales?: string | null;
  totalDiscountGiven?: string | null;
  platformDiscountApplied?: string | null;
  netIncome?: string | null;
  monthlyTrend?: SellerIncomeMonthlyTrendItem[] | null;
  incomeByProduct?: IncomeByProductItem[] | null;
  incomeByStatus?: SellerIncomeByStatusItem[] | null;
  incomeByDeliveryMethod?: SellerIncomeByDeliveryMethodItem[] | null;
  exportRows?: SellerIncomeExportRow[] | null;
}

export interface SellerIncomeMonthlyTrendItem {
  month: string;
  totalIncome: string;
  totalOrders: number;
}

export interface IncomeByProductItem {
  productName: string | null;
  quantity: number;
  grossSales: string;
  totalIncome: string;
}

export interface SellerIncomeByStatusItem {
  status: string;
  totalIncome: string;
  totalOrders: number;
}

export interface SellerIncomeByDeliveryMethodItem {
  deliveryMethod: string;
  totalIncome: string;
  totalOrders: number;
}

export interface SellerIncomeExportRow {
  orderId: number;
  orderNumber: string;
  date: string;
  buyerName: string;
  status: string;
  deliveryMethod: string;
  subtotal: string;
  discountAmount: string;
  platformDiscountApplied?: string | null;
  sellerIncome: string;
  totalItems: number;
}

export interface BuyerSpendingReport {
  totalSpending: string;
  totalOrders: number;
  averageOrderValue: string;
  highestSpendingMonth?: { month: string; label: string; totalSpending: string; totalOrders: number } | null;
  latestOrderDate?: string | null;
  totalDiscountUsed?: string | null;
  totalDeliveryFees?: string | null;
  totalTaxPaid?: string | null;
  totalItemsPurchased?: number | null;
  monthlyTrend?: MonthlyTrendItem[] | null;
  spendingByStore?: SpendingByStoreItem[] | null;
  spendingByDeliveryMethod?: SpendingByDeliveryMethodItem[] | null;
  spendingByStatus?: SpendingByStatusItem[] | null;
  topProducts?: TopProductItem[] | null;
  exportRows?: ExportRow[] | null;
}

export interface MonthlyTrendItem {
  month: string;
  totalSpending: string;
  totalOrders: number;
}

export interface SpendingByStoreItem {
  storeName: string;
  totalSpending: string;
  totalOrders: number;
}

export interface SpendingByDeliveryMethodItem {
  deliveryMethod: string;
  totalSpending: string;
  totalOrders: number;
}

export interface SpendingByStatusItem {
  status: string;
  totalSpending: string;
  totalOrders: number;
}

export interface TopProductItem {
  productId: number;
  productName: string | null;
  quantity: number;
  totalSpending: string;
}

export interface ExportRow {
  orderId: number;
  orderNumber: string;
  date: string;
  storeName: string;
  status: string;
  deliveryMethod: string;
  subtotal: string;
  discountAmount: string;
  deliveryFee: string;
  taxAmount: string;
  totalAmount: string;
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

// Cart types

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    stock: number;
    imageUrl: string | null;
    deletedAt: string | null;
    storeId: number;
  };
}

export interface Cart {
  id: number;
  buyerId: number;
  storeId: number | null;
  items: CartItem[];
  store: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// Checkout types

export type DeliveryMethod = 'INSTANT' | 'NEXT_DAY' | 'REGULAR';

export type OrderStatus = 'SEDANG_DIKEMAS' | 'MENUNGGU_PENGIRIM' | 'SEDANG_DIKIRIM' | 'PESANAN_SELESAI' | 'DIKEMBALIKAN';

export interface CheckoutPayload {
  addressId: number;
  deliveryMethod: DeliveryMethod;
  voucherCode?: string;
  promoCode?: string;
}

// Order types

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  productPrice: string;
  quantity: number;
  subtotal: string;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  storeId: number;
  addressId: number;
  voucherId: number | null;
  promoId: number | null;
  voucher: { code: string; name: string } | null;
  promo: { code: string; name: string } | null;
  shippingRecipientName: string;
  shippingPhone: string;
  shippingAddress: string;
  deliveryMethod: DeliveryMethod;
  subtotal: string;
  discountAmount: string;
  deliveryFee: string;
  ppnAmount: string;
  finalTotal: string;
  status: OrderStatus;
  paidAt: string;
  expiredAt: string;
  completedAt: string | null;
  returnedAt: string | null;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  store: { id: number; name: string } | null;
  address: {
    id: number;
    recipientName: string;
    phone: string;
    addressDetail: string;
    city: string | null;
    province: string | null;
    postalCode: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// Discount types

export interface DiscountValidationResult {
  code: string;
  type: 'voucher' | 'promo';
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  discountAmount: string;
  originalDiscount: string;
  minPurchaseAmount: string;
  maxDiscountAmount: string;
}

// Driver types

export type DeliveryJobStatus = 'AVAILABLE' | 'TAKEN' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';

export interface DeliveryJob {
  id: number;
  orderId: number;
  driverId: number | null;
  deliveryMethod: DeliveryMethod;
  deliveryFee: string;
  earning: string | null;
  status: DeliveryJobStatus;
  takenAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    store: { id: number; name: string };
    address?: {
      id: number;
      recipientName: string;
      phone: string;
      addressDetail: string;
      city: string | null;
      province: string | null;
      postalCode: string | null;
    } | null;
    items?: Array<{
      id: number;
      productName: string;
      productPrice: string;
      quantity: number;
    }>;
    deliveryMethod?: DeliveryMethod;
    subtotal?: string;
    deliveryFee?: string;
    finalTotal?: string;
  } | null;
  driver?: {
    id: number;
    username: string;
    fullName: string;
  } | null;
}

export interface DriverEarning {
  id: number;
  driverId: number;
  deliveryJobId: number;
  amount: string;
  createdAt: string;
  deliveryJob?: DeliveryJob | null;
}

export interface DriverEarningsSummary {
  totalEarnings: string;
  totalCompletedJobs: number;
  averageEarningPerJob: string;
  earnings: DriverEarning[];
  totalDeliveries?: number | null;
  averageEarningPerDelivery?: string | null;
  highestEarningMonth?: { month: string; label: string; totalEarnings: string; totalDeliveries: number } | null;
  latestEarningDate?: string | null;
  totalDeliveryFees?: string | null;
  averageDeliveryFee?: string | null;
  averageDriverShare?: string | null;
  monthlyTrend?: DriverMonthlyTrendItem[] | null;
  earningsByDeliveryMethod?: DriverEarningsByDeliveryMethodItem[] | null;
  earningsByStatus?: DriverEarningsByStatusItem[] | null;
  exportRows?: DriverEarningsExportRow[] | null;
}

export interface DriverMonthlyTrendItem {
  month: string;
  totalEarnings: string;
  totalDeliveries: number;
}

export interface DriverEarningsByDeliveryMethodItem {
  deliveryMethod: string;
  totalEarnings: string;
  totalDeliveries: number;
}

export interface DriverEarningsByStatusItem {
  status: string;
  totalEarnings: string;
  totalDeliveries: number;
}

export interface DriverEarningsExportRow {
  earningId: number;
  jobId: number;
  orderId: number;
  orderNumber: string;
  date: string;
  status: string;
  deliveryMethod: string;
  deliveryFee: string;
  driverEarning: string;
  storeName: string;
  buyerName: string;
}

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  INSTANT: 20000,
  NEXT_DAY: 12000,
  REGULAR: 8000,
};

// Admin types

export interface AdminSummary {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalCompletedOrders?: number;
  totalReturnedOrders?: number;
  totalDeliveryJobs?: number;
  totalRevenue?: string;
  totalSellerIncome?: string;
  totalDriverEarnings?: string;
  currentSystemTime?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userRoles?: Array<{
    id?: number;
    role?: {
      id?: number;
      name?: string;
    };
  }>;
}

export interface AdminStore {
  id: number;
  name: string;
  description?: string | null;
  sellerUserId?: number;
  sellerUser?: { fullName: string; username?: string } | null;
  _count?: { products?: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminVoucher {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  maxDiscountAmount?: string | null;
  minPurchaseAmount?: string | null;
  remainingUsage?: number;
  expiryDate: string;
  isActive: boolean;
  isExpired?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPromo {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  maxDiscountAmount?: string | null;
  minPurchaseAmount?: string | null;
  expiryDate: string;
  isActive: boolean;
  isExpired?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDiscountsResponse {
  vouchers: AdminVoucher[];
  promos: AdminPromo[];
}

export interface CreateVoucherPayload {
  name: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  remainingUsage: number;
  expiryDate: string;
  isActive?: boolean;
}

export interface CreatePromoPayload {
  name: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  expiryDate: string;
  isActive?: boolean;
}

export interface OverdueOrderSummary {
  id: number;
  orderNumber?: string;
  buyerId?: number;
  storeId?: number;
  finalTotal?: string;
  expiredAt?: string;
  overdueDuration?: string;
  status?: OrderStatus;
  buyer?: { id: number; username: string; fullName: string } | null;
  store?: { id: number; name: string } | null;
}

export interface SystemTimeResponse {
  currentDatetime: string;
}

export interface SimulateRefundResult {
  processedCount: number;
  skippedCount: number;
  processedOrderIds: number[];
  skippedOrders?: Array<{
    orderId: number;
    reason: string;
  }>;
}

export interface SimulateNextDayResponse {
  previousTime: string;
  newTime: string;
  refundResult?: SimulateRefundResult;
}

export interface RefundOrderResult {
  id?: number;
  orderId?: number;
  amount?: string;
  message?: string;
}

export interface RefundAllResponse {
  processedCount: number;
  skippedCount: number;
  processedOrderIds: number[];
  skippedOrders?: Array<{
    orderId: number;
    reason: string;
  }>;
}

// Seller order types

export interface SellerOrderBuyer {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string | null;
}

export interface SellerOrder {
  id: number;
  orderNumber: string;
  buyerId: number;
  storeId: number;
  addressId: number;
  voucherId: number | null;
  promoId: number | null;
  voucher: { code: string; name: string } | null;
  promo: { code: string; name: string } | null;
  shippingRecipientName: string;
  shippingPhone: string;
  shippingAddress: string;
  deliveryMethod: DeliveryMethod;
  subtotal: string;
  discountAmount: string;
  deliveryFee: string;
  ppnAmount: string;
  finalTotal: string;
  status: OrderStatus;
  paidAt: string;
  expiredAt: string;
  completedAt: string | null;
  returnedAt: string | null;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  store: { id: number; name: string } | null;
  buyer?: SellerOrderBuyer | null;
  address?: {
    id: number;
    recipientName: string;
    phone: string;
    addressDetail: string;
    city: string | null;
    province: string | null;
    postalCode: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}
