import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/auth/profile');
      
      // We need to get the token, which updateProfile doesn't always return, but we have it in storage
      const token = axios.defaults.headers.common['Authorization']?.split(' ')[1];
      const updatedUser = { ...data, token };

      setUser(updatedUser);
      
      if (localStorage.getItem('userInfo')) {
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } else {
          sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }
    } catch (error) {
       console.error("Silent refresh failed", error);
    }
  };

  useEffect(() => {
    // Check localStorage first, then sessionStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(sessionStorage.getItem('userInfo'));
    
    if (userInfo) {
      setUser(userInfo);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
      
      // Trigger a silent refresh to get latest roles
      refreshUser();
    }
    setLoading(false);
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
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/auth/register', userData);
      setUser(data);
      // Default to localStorage for register for better UX, or could be argument. 
      // Let's default to localStorage as standard signup flow usually implies "keep me logged in"
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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
    // data should be the full user object with token
    
    // Check where it was stored to update the correct one
    if (localStorage.getItem('userInfo')) {
        localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
        // If not in local, put in session (or if it was in session)
        sessionStorage.setItem('userInfo', JSON.stringify(data));
    }
    
    if (data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
  };



  const googleLogin = async (credential, additionalData = {}) => {
    try {
      const { data } = await axios.post('/auth/google', { credential, ...additionalData });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
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
