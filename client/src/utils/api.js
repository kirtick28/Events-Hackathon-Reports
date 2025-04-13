import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    if (
      response?.status === 401 &&
      !config.url.endsWith('/auth/login') // ← skip login errors
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
