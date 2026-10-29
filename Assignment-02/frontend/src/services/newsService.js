import axiosClient from '../api/axiosClient';

export const newsService = {
  getAll: (params = {}) => {
    return axiosClient.get('/api/news-articles', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/api/news-articles/${id}`);
  },

  create: (articleData) => {
    return axiosClient.post('/api/news-articles', articleData);
  },

  update: (id, articleData) => {
    return axiosClient.put(`/api/news-articles/${id}`, articleData);
  },

  delete: (id) => {
    return axiosClient.delete(`/api/news-articles/${id}`);
  }
};

