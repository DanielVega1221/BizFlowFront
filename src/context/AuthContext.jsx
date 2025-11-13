import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/services';
import axiosInstance from '../api/axios';
import { welcomeTour } from '../utils/appTour';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('bf_token');
      
      if (token) {
        try {
          // Set token in axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Clear invalid token
          localStorage.removeItem('bf_token');
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Listen for auth expiration events
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setError('Sesión expirada');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      // Store tokens
      localStorage.setItem('bf_token', response.data.accessToken);
      localStorage.setItem('bf_refresh_token', response.data.refreshToken);
      
      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      
      // Set user
      setUser(response.data.user);
      
      // Limpiar el flag del tour para que se muestre siempre al loguearse
      localStorage.removeItem('bizflow_tour_completed');
      
      // Iniciar tour después del login
      setTimeout(() => {
        welcomeTour();
      }, 1000);
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password });
      
      // Store tokens
      localStorage.setItem('bf_token', response.data.accessToken);
      localStorage.setItem('bf_refresh_token', response.data.refreshToken);
      
      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      
      // Set user
      setUser(response.data.user);
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrar usuario';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate refresh token
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Clear tokens
    localStorage.removeItem('bf_token');
    localStorage.removeItem('bf_refresh_token');
    
    // Remove axios header
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // Clear user
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
