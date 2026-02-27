import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// МОЙ IP!!!!!!!!!
const YOUR_IP = '192.168.0.185';
const API_URL = `http://${YOUR_IP}:3001/api`;

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@TheStillness:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Превышено время ожидания' });
    }
    
    if (!error.response) {
      console.log('🚫 Network error - server unreachable');
      return Promise.reject({ message: 'Нет подключения к серверу' });
    }
    
    return Promise.reject(error);
  }
);

export default api;