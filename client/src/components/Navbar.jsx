import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X, ChevronDown, Settings, LayoutDashboard, HelpCircle } from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    navigate('/login');
    logout();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Experts', path: '/experts' },
    { name: 'Plans & Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-primary z-50 relative">
              ConsultPro
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
               <div className="flex space-x-6">
                  {navLinks.map(link => {
                      const isActive = link.path === '/' 
                        ? location.pathname === '/'
                        : location.pathname.startsWith(link.path);
                      
                      return (
                        <Link 
                            key={link.path}
                            to={link.path} 
                            id={link.path === '/experts' ? 'tour-experts-link' : undefined}
                            className={`text-sm transition-colors ${
                              isActive 
                                ? 'font-bold text-primary' 
                                : 'font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                      );
                  })}
               </div>

              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  
                  {user ? (
                      <div className="flex items-center space-x-4">
                          <NotificationDropdown />
                          <div className="relative" id="tour-profile-menu">
                              <button 
                                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                  className="flex items-center space-x-2 focus:outline-none"
                              >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-gray-200 dark:border-gray-700 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                      {user.profileImage ? (
                                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                      ) : (
                                          user.name[0]
                                      )}
                                  </div>
                                  <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Desktop Profile Dropdown */}
                              {isProfileMenuOpen && (
                                  <>
                                      <div 
                                          className="fixed inset-0 z-10" 
                                          onClick={() => setIsProfileMenuOpen(false)}
                                      ></div>
                                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animation-fade-in-up z-20 origin-top-right">
                                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                          </div>
                                          <div className="p-1">
                                              <Link 
                                                  to="/dashboard" 
                                                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                              >
                                                  <LayoutDashboard size={16} />
                                                  <span>Appointments</span>
                                              </Link>
                                              {(user.roles?.includes('admin') || user.roles?.includes('inquiry_support') || user.roles?.includes('moderator')) && (
                                              <Link 
                                                  to="/admin" 
                                                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                              >
                                                  <Settings size={16} />
                                                  <span>{user.roles.includes('admin') || user.roles.includes('moderator') ? 'Admin Panel' : 'Inquiries Panel'}</span>
                                              </Link>
                                              )}
                                              <Link 
                                                  to="/profile" 
                                                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                              >
                                                  <User size={16} />
                                                  <span>Profile & Settings</span>
                                              </Link>
                                          </div>
                                          <div className="border-t border-gray-100 dark:border-gray-800 p-1">
                                              <button 
                                                  onClick={handleLogout}
                                                  className="flex w-full items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                              >
                                                  <LogOut size={16} />
                                                  <span>Logout</span>
                                              </button>
                                          </div>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center space-x-3">
                          <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Login</Link>
                          <Link to="/register" className="btn-primary text-sm shadow-indigo-500/20">Get Started</Link>
                      </div>
                  )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
               <ThemeToggle />
               {user && <NotificationDropdown />}
               <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors z-50 relative"
               >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-gray-950 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
         <div className="flex flex-col min-h-screen pt-20 px-6 pb-32 space-y-6">
            
            {user && (
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                {navLinks.map(link => {
                    const isActive = link.path === '/' 
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);
                    
                    return (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between p-3 rounded-xl text-lg font-medium transition-colors ${
                                isActive
                                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                        >
                            {link.name}
                            <ChevronDown size={16} className={`text-gray-400 ${isActive ? '-rotate-90' : ''}`} />
                        </Link>
                    );
                })}
            </div>

            {user ? (
                <div className="space-y-2">
                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                     <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <LayoutDashboard size={20} className="text-indigo-500" />
                        <span className="font-medium">Appointments</span>
                     </Link>
                     <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <User size={20} className="text-purple-500" />
                        <span className="font-medium">Profile</span>
                     </Link>
                     {(user.roles?.includes('admin') || user.roles?.includes('inquiry_support') || user.roles?.includes('moderator')) && (
                        <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <Settings size={20} className="text-orange-500" />
                            <span className="font-medium">{user.roles.includes('admin') || user.roles.includes('moderator') ? 'Admin Panel' : 'Inquiries Panel'}</span>
                        </Link>
                     )}
                     <button 
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                     >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                     </button>
                </div>
            ) : (
                <div className="pt-6 mt-auto space-y-4">
                    <Link to="/login" className="btn-secondary w-full justify-center py-3 text-base">Login</Link>
                    <Link to="/register" className="btn-primary w-full justify-center py-3 text-base shadow-lg shadow-indigo-500/20">Get Started</Link>
                </div>
            )}
            
         </div>
      </div>
    </>
  );
};

export default Navbar;
