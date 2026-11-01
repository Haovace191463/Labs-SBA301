import axiosClient from '../api/axiosClient';

export const authService = {
  loginStaff: async (email, password) => {
    const res = await axiosClient.post('/auth/staff/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('auth-changed'));
    }
    return res;
  },

  loginCustomer: async (email, password) => {
    const res = await axiosClient.post('/auth/customer/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('auth-changed'));
    }
    return res;
  },

  registerCustomer: async (customerData) => {
    return await axiosClient.post('/auth/customer/register', customerData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-changed'));
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isStaff: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ROLE_STAFF';
  },

  isCustomer: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ROLE_CUSTOMER';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

