import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, ChevronDown, Settings } from 'lucide-react';

import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">ConsultPro</Link>
          <div className="flex items-center space-x-4">
            <Link to="/experts" className="hidden md:block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white">Find Experts</Link>
            <Link to="/pricing" className="hidden md:block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white">Plans & Pricing</Link>
            <Link to="/about" className="hidden md:block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white">About Us</Link>
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors focus:outline-none"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>
                    <span className="hidden md:block font-medium">{user.name}</span>
                    <ChevronDown size={16} className={`hidden md:block transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 py-1 animation-fade-in-up">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 md:hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    {(user.roles?.includes('admin') || user.roles?.includes('inquiry_support')) && (
                      <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setIsMenuOpen(false)}
                      >
                          {user.roles.includes('admin') ? 'Admin Panel' : 'Inquiries Panel'}
                      </Link>
                    )}
                    <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span>Profile & Settings</span>
                        <Settings size={14} />
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-between"
                    >
                        <span>Logout</span>
                        <LogOut size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary hidden md:block">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
