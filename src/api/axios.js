import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fourminesserver.onrender.com/api',
});

// Attach JWT from stored user on every request
API.interceptors.request.use((req) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Kick to login on an expired / invalid token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
