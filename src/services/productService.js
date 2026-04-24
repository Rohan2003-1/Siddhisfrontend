import api from '../utils/api';

/**
 * GET /api/v1/products
 * Query params: category, search, sort, page, limit, minPrice, maxPrice
 */
export const fetchProductsAPI = (params = {}) => api.get('/products', { params });

/**
 * GET /api/v1/products/:id
 */
export const fetchProductByIdAPI = (id) => api.get(`/products/${id}`);

/**
 * POST /api/v1/products  (admin only)
 */
export const createProductAPI = (data) => api.post('/products', data);

/**
 * PUT /api/v1/products/:id  (admin only)
 */
export const updateProductAPI = (id, data) => api.put(`/products/${id}`, data);

/**
 * DELETE /api/v1/products/:id  (admin only)
 */
export const deleteProductAPI = (id) => api.delete(`/products/${id}`);
