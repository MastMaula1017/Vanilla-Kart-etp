import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpertList from './pages/ExpertList';
import ExpertProfile from './pages/ExpertProfile';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ExpertPayments from './pages/ExpertPayments';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Pricing from './pages/Pricing';
import GetTheApp from './pages/GetTheApp';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BecomeExpert from './pages/BecomeExpert';
import Careers from './pages/Careers';
import CookiePolicy from './pages/CookiePolicy';
import Contact from './pages/Contact';
import Maintenance from './pages/Maintenance';
import ProtectedRoute from './components/ProtectedRoute';

import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminExperts from './pages/admin/AdminExperts';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminVerification from './pages/admin/AdminVerification';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminEarnings from './pages/admin/AdminEarnings';

import ScrollToTop from './components/ScrollToTop';

import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import GlobalScratcher from './components/GlobalScratcher';

import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFullWidthNode = location.pathname === '/get-the-app' || location.pathname === '/become-expert' || isAdminRoute;

  // MAINTENANCE MODE TOGGLE
  // Set this to true to enable maintenance mode for the entire site
  const MAINTENANCE_MODE = false;

  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
        <Maintenance />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      <SocketProvider>
       <Toaster position="top-center" />
       <ScrollToTop />
       {!isAdminRoute && <Navbar />}
      <div className={`${isFullWidthNode ? '' : 'container mx-auto px-4 py-8'} flex-grow`}>
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/get-the-app" element={<PageTransition><GetTheApp /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/become-expert" element={<PageTransition><BecomeExpert /></PageTransition>} />
          <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
          <Route path="/cookie-policy" element={<PageTransition><CookiePolicy /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/experts" element={<PageTransition><ExpertList /></PageTransition>} />
          <Route path="/experts/:id" element={<PageTransition><ExpertProfile /></PageTransition>} />
          <Route path="/maintenance" element={<PageTransition><Maintenance /></PageTransition>} />
          
          <Route path="/expert/payments" element={
            <ProtectedRoute>
              <PageTransition><ExpertPayments /></PageTransition>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageTransition><ProfilePage /></PageTransition>
            </ProtectedRoute>
          } />

          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <PageTransition><ChatPage /></PageTransition>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'inquiry_support', 'moderator']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard - Accessible to both (or restrict if needed) */}
            <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />

            {/* Inquiries - Accessible to both */}
            <Route path="inquiries" element={<PageTransition><AdminInquiries /></PageTransition>} />

            {/* User Management - Admin Only */}
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <PageTransition><AdminUsers /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="experts" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <PageTransition><AdminExperts /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="coupons" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PageTransition><AdminCoupons /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="earnings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PageTransition><AdminEarnings /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="verifications" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <PageTransition><AdminVerification /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="announcements" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <PageTransition><AdminAnnouncements /></PageTransition>
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
        </AnimatePresence>
      </div>
      </SocketProvider>
      <Footer />
      <GlobalScratcher />
    </div>
  );
}

export default App;
// Force rebuild
