import api from '../utils/api';

/**
 * POST /api/v1/orders
 * Expects: { items, shippingAddress, paymentMethod, totalPrice }
 */
export const createOrderAPI = (data) => api.post('/orders', data);

/**
 * GET /api/v1/orders/myorders  (authenticated user)
 */
export const fetchMyOrdersAPI = () => api.get('/orders/me');

/**
 * GET /api/v1/orders/:id
 */
export const fetchOrderByIdAPI = (id) => api.get(`/orders/${id}`);

/**
 * GET /api/v1/orders  (admin)
 */
export const fetchAllOrdersAPI = (params = {}) => api.get('/orders', { params });

/**
 * PUT /api/v1/orders/:id/status  (admin)
 */
export const updateOrderStatusAPI = (id, status) =>
  api.put(`/orders/${id}/status`, { status });
