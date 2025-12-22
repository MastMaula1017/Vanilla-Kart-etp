import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch latest user data (validates cookie)
  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/auth/profile');
      setUser(data);
      
      // Update storage to keep UI in sync
      const storageKey = sessionStorage.getItem('userInfo') ? 'sessionStorage' : 'localStorage';
      if (storageKey === 'localStorage') {
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (error) {
       // If unauthorized, just clear state silently (expected behavior for non-logged-in users)
       if (error.response?.status === 401) {
         logout(false);
         return; 
       }
       console.error("Session check failed", error);
    }
  };

  useEffect(() => {
    // Cleanup legacy insecure token if present
    localStorage.removeItem('token');

    // Optimistically set user from storage if available (for fast UI)
    // Note: This data will NOT contain the token anymore
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(sessionStorage.getItem('userInfo'));
    
    if (userInfo) {
      setUser(userInfo);
    }
    
    // Always verify with backend on mount
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      setUser(data);
      
      if (rememberMe) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/auth/register', userData);
      setUser(data);
      // Default to localStorage for register
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = async (callApi = true) => {
    try {
      if (callApi) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      console.error("Logout API failed", error);
    }
    
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post('/auth/forgot-password', { email });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send reset email';
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await axios.post('/auth/reset-password', { email, otp, newPassword });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password';
    }
  };

  const updateUser = (data) => {
    setUser(data);
    
    // Update wherever it is stored
    if (localStorage.getItem('userInfo')) {
        localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
        sessionStorage.setItem('userInfo', JSON.stringify(data));
    }
  };

  const googleLogin = async (credential, additionalData = {}) => {
    try {
      const { data } = await axios.post('/auth/google', { credential, ...additionalData });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
       throw error.response?.data?.message || 'Google login failed';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleLogin, loading, updateUser, forgotPassword, resetPassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
