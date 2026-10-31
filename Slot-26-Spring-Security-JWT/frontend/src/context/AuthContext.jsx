import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  }, []);

  // Login handler
  const login = useCallback(async (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    try {
      const userInfo = await authService.getMe();
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      logout();
      throw err;
    }
  }, [logout]);

  // Load user profile on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('jwt_token');
      if (savedToken) {
        try {
          const userInfo = await authService.getMe();
          setUser(userInfo);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth expiration triggered by response interceptor
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [logout]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
