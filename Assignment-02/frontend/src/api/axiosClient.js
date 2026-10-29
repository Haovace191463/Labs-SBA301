import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach authenticated session Bearer token to outgoing requests
axiosClient.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('funews_current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user?.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch {
        // Ignore JSON parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const stored = localStorage.getItem('funews_current_user');
      if (stored) {
        localStorage.removeItem('funews_current_user');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    let message = 'An unexpected network error occurred';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
