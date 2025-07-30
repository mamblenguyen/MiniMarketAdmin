import axios, { AxiosError } from 'axios';

const NEST_API_BASE_URL = 'https://mini-martket.onrender.com';

const nestApiInstance = axios.create({
  baseURL: NEST_API_BASE_URL,
});

nestApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    // eslint muốn reject bằng instance của Error
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  }
);

export { nestApiInstance };
