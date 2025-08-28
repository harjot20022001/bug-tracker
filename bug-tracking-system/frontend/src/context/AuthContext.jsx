import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          const res = await axios.get('/auth/me');
          setUser(res.data.data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      }
      
      setLoading(false);
      setInitialized(true);
    };

    if (!initialized) {
      initializeAuth();
    }
  }, [initialized]);

  useEffect(() => {
    if (initialized) {
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    }
  }, [token, initialized]);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('/auth/register', { name, email, password, role });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

