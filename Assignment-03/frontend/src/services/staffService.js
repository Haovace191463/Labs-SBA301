import axiosClient from '../api/axiosClient';

export const staffService = {
  // Rooms
  getAllRooms: async () => {
    const res = await axiosClient.get('/staff/rooms');
    return res.data || [];
  },

  getRoomById: async (id) => {
    const res = await axiosClient.get(`/staff/rooms/${id}`);
    return res.data;
  },

  createRoom: async (data) => {
    const res = await axiosClient.post('/staff/rooms', data);
    return res.data;
  },

  updateRoom: async (id, data) => {
    const res = await axiosClient.put(`/staff/rooms/${id}`, data);
    return res.data;
  },

  deleteRoom: async (id) => {
    // Returns message indicating whether physically deleted or soft deleted per assignment rules
    const res = await axiosClient.delete(`/staff/rooms/${id}`);
    return res.message;
  },

  // Room Types
  getAllRoomTypes: async () => {
    const res = await axiosClient.get('/staff/room-types');
    return res.data || [];
  },

  createRoomType: async (data) => {
    const res = await axiosClient.post('/staff/room-types', data);
    return res.data;
  },

  updateRoomType: async (id, data) => {
    const res = await axiosClient.put(`/staff/room-types/${id}`, data);
    return res.data;
  },

  deleteRoomType: async (id) => {
    const res = await axiosClient.delete(`/staff/room-types/${id}`);
    return res.message;
  },

  // Customers
  getAllCustomers: async (search) => {
    const params = search ? { search } : {};
    const res = await axiosClient.get('/staff/customers', { params });
    return res.data || [];
  },

  getCustomerById: async (id) => {
    const res = await axiosClient.get(`/staff/customers/${id}`);
    return res.data;
  },

  createCustomer: async (data) => {
    const res = await axiosClient.post('/staff/customers', data);
    return res.data;
  },

  updateCustomer: async (id, data) => {
    const res = await axiosClient.put(`/staff/customers/${id}`, data);
    return res.data;
  },

  deleteCustomer: async (id) => {
    const res = await axiosClient.delete(`/staff/customers/${id}`);
    return res.message;
  },

  // Bookings
  getAllBookings: async () => {
    const res = await axiosClient.get('/staff/bookings');
    return res.data || [];
  },

  getBookingById: async (id) => {
    const res = await axiosClient.get(`/staff/bookings/${id}`);
    return res.data;
  },

  createBooking: async (data) => {
    const res = await axiosClient.post('/staff/bookings', data);
    return res.data;
  },

  updateBookingStatus: async (id, status) => {
    const res = await axiosClient.put(`/staff/bookings/${id}/status`, { status });
    return res.data;
  },

  deleteBooking: async (id) => {
    const res = await axiosClient.delete(`/staff/bookings/${id}`);
    return res.message;
  }
};

