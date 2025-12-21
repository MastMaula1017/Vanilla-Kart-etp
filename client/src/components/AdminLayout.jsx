import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  LogOut, 

  ChevronRight,
  Tag,
  CheckCircle,
  Bell,
  Menu,
  X,
  Home,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Define allowed roles for each item
  const allNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin', 'inquiry_support', 'moderator'] },
    { name: 'Users', path: '/admin/users', icon: Users, roles: ['admin', 'moderator'] },
    { name: 'Experts', path: '/admin/experts', icon: Briefcase, roles: ['admin', 'moderator'] },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare, roles: ['admin', 'inquiry_support', 'moderator'] },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell, roles: ['admin', 'moderator'] },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag, roles: ['admin'] },
    { name: 'Earnings', path: '/admin/earnings', icon: DollarSign, roles: ['admin'] },
    { name: 'Verifications', path: '/admin/verifications', icon: CheckCircle, roles: ['admin', 'moderator'] },
  ];

  const navItems = allNavItems.filter(item => 
    user?.roles?.some(role => item.roles.includes(role))
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
         <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Panel
         </h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
              {isActive(item.path) && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <Home size={20} className="mr-3" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar (Mobile Overlay) */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      {/* Mobile Dropdown Menu (Vertical) */}
      <div className={`fixed top-[60px] left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 transform transition-all duration-300 md:hidden flex flex-col shadow-xl overflow-hidden ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 overflow-y-auto">

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
              {isActive(item.path) && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <Home size={20} className="mr-3" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
