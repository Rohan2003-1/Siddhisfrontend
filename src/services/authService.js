import api from '../utils/api';

/**
 * POST /api/v1/auth/login
 * Expects: { email, password }
 * Returns: { success, user }
 */
export const loginAPI = (data) => api.post('/auth/login', data);

/**
 * POST /api/v1/auth/register
 * Expects: { name, email, password }
 * Returns: { success, message } — backend sends OTP first
 */
export const registerAPI = (data) => api.post('/auth/register', data);

/**
 * POST /api/v1/auth/verify-otp
 * Expects: { email, otp }
 * Returns: { success, user }
 */
export const verifyOTPAPI = (data) => api.post('/auth/verify-otp', data);

/**
 * GET /api/v1/auth/logout
 */
export const logoutAPI = () => api.get('/auth/logout');

/**
 * GET /api/v1/auth/me  (protected — needs cookie)
 */
export const getMeAPI = () => api.get('/auth/me');

/**
 * PUT /api/v1/auth/updatedetails
 */
export const updateDetailsAPI = (data) => api.put('/auth/updatedetails', data);

/**
 * PUT /api/v1/auth/updatepassword
 */
export const updatePasswordAPI = (data) => api.put('/auth/updatepassword', data);

/**
 * PUT /api/v1/auth/synccart
 */
export const syncCartAPI = (cartItems) => api.put('/auth/synccart', { cartItems });
