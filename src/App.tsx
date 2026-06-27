import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import StoreDetailPage from './pages/StoreDetailPage';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import AvailableJobsPage from './pages/driver/AvailableJobsPage';
import ActiveJobPage from './pages/driver/ActiveJobPage';
import EarningsPage from './pages/driver/EarningsPage';
import StoreManagementPage from './pages/seller/StoreManagementPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import CreateProductPage from './pages/seller/CreateProductPage';
import EditProductPage from './pages/seller/EditProductPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage';
import WalletPage from './pages/buyer/WalletPage';
import AddressesPage from './pages/buyer/AddressesPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrdersPage from './pages/buyer/OrdersPage';
import OrderDetailPage from './pages/buyer/OrderDetailPage';
import BuyerSpendingReportPage from './pages/buyer/BuyerSpendingReportPage';
import UsersPage from './pages/admin/UsersPage';
import StoresPage from './pages/admin/StoresPage';
import ProductsPage from './pages/admin/ProductsPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import DeliveryJobsPage from './pages/admin/DeliveryJobsPage';
import DiscountsPage from './pages/admin/DiscountsPage';
import OverdueOrdersPage from './pages/admin/OverdueOrdersPage';
import SystemTimePage from './pages/admin/SystemTimePage';
import SellerIncomeReportPage from './pages/seller/SellerIncomeReportPage';

export default function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/stores/:id" element={<StoreDetailPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/stores" element={<StoresPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="/admin/delivery-jobs" element={<DeliveryJobsPage />} />
            <Route path="/admin/discounts" element={<DiscountsPage />} />
            <Route path="/admin/overdue-orders" element={<OverdueOrdersPage />} />
            <Route path="/admin/system-time" element={<SystemTimePage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Seller']} />}>
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/seller/store" element={<StoreManagementPage />} />
            <Route path="/seller/products" element={<MyProductsPage />} />
            <Route path="/seller/products/new" element={<CreateProductPage />} />
            <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/orders/:id" element={<SellerOrderDetailPage />} />
            <Route path="/seller/reports/income" element={<SellerIncomeReportPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Buyer']} />}>
            <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
            <Route path="/buyer/wallet" element={<WalletPage />} />
            <Route path="/buyer/addresses" element={<AddressesPage />} />
            <Route path="/buyer/cart" element={<CartPage />} />
            <Route path="/buyer/checkout" element={<CheckoutPage />} />
            <Route path="/buyer/orders" element={<OrdersPage />} />
            <Route path="/buyer/orders/:id" element={<OrderDetailPage />} />
            <Route path="/buyer/reports/spending" element={<BuyerSpendingReportPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Driver']} />}>
            <Route path="/dashboard/driver" element={<DriverDashboard />} />
            <Route path="/driver/jobs" element={<AvailableJobsPage />} />
            <Route path="/driver/active" element={<ActiveJobPage />} />
            <Route path="/driver/earnings" element={<EarningsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
