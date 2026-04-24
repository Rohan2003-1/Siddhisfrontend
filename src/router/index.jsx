import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../features/authSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import CartDrawer from '../components/cart/CartDrawer';

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Booking = lazy(() => import('../pages/Booking'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-surface border-t-secondary rounded-full animate-spin" />
      <p className="text-secondary font-semibold">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuthenticated);
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppRouter = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <CartDrawer />
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="*" element={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl font-extrabold text-primary mb-4">404</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
    <Footer />
  </>
);

export default AppRouter;
