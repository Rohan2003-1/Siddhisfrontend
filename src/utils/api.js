import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://siddhisbackend.onrender.com/api/v1',
  withCredentials: true, // send cookies (JWT) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor ---
// If you ever store a token in localStorage as a fallback, inject it here.
api.interceptors.request.use((config) => {
  return config;
});

// --- Response interceptor ---
// Normalise error messages so callers always get a plain string.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
