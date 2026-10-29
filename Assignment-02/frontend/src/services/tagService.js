import axiosClient from '../api/axiosClient';

export const tagService = {
  getAll: () => {
    return axiosClient.get('/api/tags');
  },

  getById: (id) => {
    return axiosClient.get(`/api/tags/${id}`);
  },

  create: (tagData) => {
    return axiosClient.post('/api/tags', tagData);
  },

  update: (id, tagData) => {
    return axiosClient.put(`/api/tags/${id}`, tagData);
  },

  delete: (id) => {
    return axiosClient.delete(`/api/tags/${id}`);
  }
};

