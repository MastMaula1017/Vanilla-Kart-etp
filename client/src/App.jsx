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
import ProtectedRoute from './components/ProtectedRoute';

import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminExperts from './pages/admin/AdminExperts';
import AdminInquiries from './pages/admin/AdminInquiries';

import ScrollToTop from './components/ScrollToTop';

import { SocketProvider } from './context/SocketContext';

function App() {
  const location = useLocation();
  const isFullWidthNode = location.pathname === '/get-the-app' || location.pathname === '/become-expert';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      <SocketProvider>
       <ScrollToTop />
       <Navbar />
      <div className={`${isFullWidthNode ? '' : 'container mx-auto px-4 py-8'} flex-grow`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/get-the-app" element={<GetTheApp />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/become-expert" element={<BecomeExpert />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experts" element={<ExpertList />} />
          <Route path="/experts/:id" element={<ExpertProfile />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'inquiry_support', 'moderator']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard - Accessible to both (or restrict if needed) */}
            <Route index element={<AdminDashboard />} />

            {/* Inquiries - Accessible to both */}
            <Route path="inquiries" element={<AdminInquiries />} />

            {/* User Management - Admin Only */}
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="experts" element={
              <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                <AdminExperts />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </div>
      </SocketProvider>
      <Footer />
    </div>
  );
}

export default App;
