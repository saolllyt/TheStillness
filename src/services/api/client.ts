import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://thestillness-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Колбэк для выхода при истечении токена — регистрируется из AuthContext
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@TheStillness:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Превышено время ожидания' });
    }

    if (error.response?.status === 401) {
      // Токен истёк или недействителен — очищаем сессию
      await AsyncStorage.multiRemove(['@TheStillness:user', '@TheStillness:token']);
      delete api.defaults.headers.common['Authorization'];
      if (onUnauthorized) onUnauthorized();
    }

    if (!error.response) {
      return Promise.reject({ message: 'Нет подключения к серверу' });
    }

    return Promise.reject(error);
  }
);

export default api;