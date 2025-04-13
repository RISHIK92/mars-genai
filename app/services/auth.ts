import api from './api';

const isClient = typeof window !== 'undefined';

const setCookie = (name: string, value: string, days: number = 7) => {
  if (!isClient) return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;secure;samesite=lax`;
};

const getCookie = (name: string): string | null => {
  if (!isClient) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  if (!isClient) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    // @ts-ignore
    if (response.data.token) {
      // @ts-ignore
      setCookie('token', response.data.token);
    }
    return response.data;
  },

  async register(userData: { email: string; password: string; name: string }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      deleteCookie('token');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  isAuthenticated: () => {
    if (!isClient) return false;
    const token = getCookie('token');
    return !!token;
  },

  validateToken: async () => {
    if (!isClient) return false;
    try {
      const token = getCookie('token');
      if (!token) return false;
      
      await api.get('/users/me');
      return true;
    } catch (error) {
      deleteCookie('token');
      return false;
    }
  }
}; 