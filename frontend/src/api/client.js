import axios from 'axios';

const BACKEND_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: BACKEND_BASE_URL,
});

// Request interceptor — attach access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    // If request got a 401 and hasn't been retried yet
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available in storage');
        }

        const res = await axios.post(
          `${BACKEND_BASE_URL}/api/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newToken = res.data.access_token;
        localStorage.setItem('access_token', newToken);

        // Update Authorization header on original request and retry
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired or revoked) -> log user out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${BACKEND_BASE_URL}${imageUrl}`;
};

export default api;
