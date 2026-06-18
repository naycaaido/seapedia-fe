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
import StoreManagementPage from './pages/seller/StoreManagementPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import CreateProductPage from './pages/seller/CreateProductPage';
import EditProductPage from './pages/seller/EditProductPage';

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
          </Route>

          <Route element={<ProtectedRoute roles={['Seller']} />}>
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/seller/store" element={<StoreManagementPage />} />
            <Route path="/seller/products" element={<MyProductsPage />} />
            <Route path="/seller/products/new" element={<CreateProductPage />} />
            <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Buyer']} />}>
            <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Driver']} />}>
            <Route path="/dashboard/driver" element={<DriverDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
