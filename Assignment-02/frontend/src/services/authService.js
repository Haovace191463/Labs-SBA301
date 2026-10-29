import axiosClient from '../api/axiosClient';

const USER_STORAGE_KEY = 'funews_current_user';

export const authService = {
  login: async (email, password) => {
    const data = await axiosClient.post('/api/auth/login', { email, password });
    if (data) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  },

  logout: async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  saveUser: (user) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};
