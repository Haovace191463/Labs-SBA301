import axiosClient from '../api/axiosClient';

export const customerService = {
  getProfile: async () => {
    const res = await axiosClient.get('/customer/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await axiosClient.put('/customer/profile', data);
    return res.data;
  },

  createBooking: async (bookingData) => {
    const res = await axiosClient.post('/customer/bookings', bookingData);
    return res.data;
  },

  getBookingHistory: async () => {
    const res = await axiosClient.get('/customer/bookings');
    return res.data || [];
  },

  getBookingDetail: async (id) => {
    const res = await axiosClient.get(`/customer/bookings/${id}`);
    return res.data;
  }
};

