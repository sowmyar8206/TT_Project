import axios from 'axios';

const BASE = 'http://localhost:8080/api';
const api  = axios.create({ baseURL: BASE });

// Users
export const registerUser  = (d)    => api.post('/users/register', d);
export const loginUser     = (d)    => api.post('/users/login', d);
export const getAllUsers    = ()     => api.get('/users');
export const deleteUser    = (id)   => api.delete(`/users/${id}`);

// Rooms
export const getAllRooms           = ()     => api.get('/rooms');
export const getAvailableRooms    = ()     => api.get('/rooms/available');
export const getRoomById          = (id)   => api.get(`/rooms/${id}`);
export const getRoomsByType       = (type) => api.get(`/rooms/type/${type}`);
export const getAvailByType       = (type) => api.get(`/rooms/available/type/${type}`);
export const addRoom              = (d)    => api.post('/rooms', d);
export const updateRoom           = (id,d) => api.put(`/rooms/${id}`, d);
export const deleteRoom           = (id)   => api.delete(`/rooms/${id}`);
export const countAvailableRooms  = ()     => api.get('/rooms/stats/available-count');

// Bookings
export const createBooking       = (d)      => api.post('/bookings', d);
export const getAllBookings       = ()       => api.get('/bookings');
export const getBookingById      = (id)     => api.get(`/bookings/${id}`);
export const getBookingsByUser   = (id)     => api.get(`/bookings/user/${id}`);
export const getBookingsByStatus = (status) => api.get(`/bookings/status/${status}`);
export const updateBookingStatus = (id, s)  => api.put(`/bookings/${id}/status?status=${s}`);
export const confirmPayment      = (id, m)  => api.put(`/bookings/${id}/payment?method=${m}`);
export const cancelBooking       = (id)     => api.put(`/bookings/${id}/cancel`);
export const getTotalBookings    = ()       => api.get('/bookings/stats/total');

export default api;
