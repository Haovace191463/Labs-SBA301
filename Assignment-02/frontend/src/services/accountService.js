import axiosClient from '../api/axiosClient';

export const accountService = {
  getAll: () => {
    return axiosClient.get('/api/accounts');
  },

  getById: (id) => {
    return axiosClient.get(`/api/accounts/${id}`);
  },

  create: (accountData) => {
    return axiosClient.post('/api/accounts', accountData);
  },

  update: (id, accountData) => {
    return axiosClient.put(`/api/accounts/${id}`, accountData);
  },

  updateProfile: (id, profileData) => {
    return axiosClient.put(`/api/accounts/profile/${id}`, profileData);
  },

  delete: (id) => {
    return axiosClient.delete(`/api/accounts/${id}`);
  }
};

