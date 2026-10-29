import axiosClient from '../api/axiosClient';

export const categoryService = {
  getAll: (activeOnly = false) => {
    return axiosClient.get('/api/categories', {
      params: activeOnly ? { activeOnly: true } : {}
    });
  },

  getById: (id) => {
    return axiosClient.get(`/api/categories/${id}`);
  },

  create: (categoryData) => {
    return axiosClient.post('/api/categories', categoryData);
  },

  update: (id, categoryData) => {
    return axiosClient.put(`/api/categories/${id}`, categoryData);
  },

  delete: (id) => {
    return axiosClient.delete(`/api/categories/${id}`);
  }
};

