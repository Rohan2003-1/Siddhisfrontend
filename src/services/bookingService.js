import api from '../utils/api';

/**
 * POST /api/v1/bookings
 * Expects: { service, date, time, name, phone, notes }
 */
export const createBookingAPI = (data) => api.post('/bookings', data);

/**
 * GET /api/v1/bookings/mybookings
 */
export const fetchMyBookingsAPI = () => api.get('/bookings/me');

/**
 * GET /api/v1/bookings  (admin)
 */
export const fetchAllBookingsAPI = (params = {}) => api.get('/bookings', { params });

/**
 * PUT /api/v1/bookings/:id/status  (admin)
 */
export const updateBookingStatusAPI = (id, status) =>
  api.put(`/bookings/${id}`, { status });
