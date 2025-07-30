import axios from 'axios';

const NEST_API_BASE_URL = 'https://mini-martket.onrender.com';

const nestApiInstance = axios.create({
  baseURL: NEST_API_BASE_URL,
});

// Gắn token vào mọi request nếu tồn tại
nestApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { nestApiInstance };
