import axios from 'axios';
import { authStore } from '../features/auth/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Attach the stored token to every API request dynamically
api.interceptors.request.use(
  (config) => {
    const token = authStore.token;
    if (token && config.headers) {
      // Assuming Bearer authentication schema
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
