import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://mars-genai-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (token) {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 