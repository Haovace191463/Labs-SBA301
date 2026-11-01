import axiosClient from '../api/axiosClient';

export const roomService = {
  getPublicRooms: async () => {
    const res = await axiosClient.get('/rooms');
    return res.data || [];
  },

  searchRooms: async (params) => {
    const res = await axiosClient.get('/rooms/search', { params });
    return res.data || [];
  },

  getRoomById: async (id) => {
    const res = await axiosClient.get(`/rooms/${id}`);
    return res.data;
  },

  getPublicRoomTypes: async () => {
    const res = await axiosClient.get('/room-types');
    return res.data || [];
  }
};

