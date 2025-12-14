import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios base URL
  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    // Check localStorage first, then sessionStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(sessionStorage.getItem('userInfo'));
    
    if (userInfo) {
      setUser(userInfo);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
