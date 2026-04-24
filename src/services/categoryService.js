import api from '../utils/api';

/**
 * GET /api/v1/categories
 */
export const fetchCategoriesAPI = () => api.get('/categories');

/**
 * POST /api/v1/categories  (admin)
 */
export const createCategoryAPI = (data) => api.post('/categories', data);

/**
 * DELETE /api/v1/categories/:id  (admin)
 */
export const deleteCategoryAPI = (id) => api.delete(`/categories/${id}`);
