import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../services/api/client';

interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      setLoading(true);
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('@TheStillness:user'),
        AsyncStorage.getItem('@TheStillness:token')
      ]);

      if (storedUser && storedToken && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(storedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(parsedUser);
          console.log('✅ Session restored for:', parsedUser.email);
        } catch (parseError) {
          console.log('❌ Error parsing stored user');
          await AsyncStorage.multiRemove(['@TheStillness:user', '@TheStillness:token']);
        }
      }
    } catch (error) {
      console.log('❌ Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      // Проверяем что user и token существуют
      if (!user || !token) {
        throw new Error('Неверный ответ от сервера');
      }

      // Проверяем что user - это объект
      if (typeof user !== 'object' || user === null) {
        throw new Error('Неверный формат данных пользователя');
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Сохраняем только если данные валидны
      await Promise.all([
        AsyncStorage.setItem('@TheStillness:user', JSON.stringify(user)),
        AsyncStorage.setItem('@TheStillness:token', token)
      ]);

      setUser(user);
      return { success: true, message: 'Вход выполнен успешно' };
    } catch (error: any) {
      let errorMessage = 'Ошибка при входе';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Неверный email или пароль';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Проверьте введенные данные';
            break;
          case 500:
            errorMessage = 'Ошибка сервера. Попробуйте позже';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.message === 'Network Error') {
        errorMessage = 'Нет подключения к серверу';
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName
      });

      const { user, token } = response.data;

      // Проверяем что user и token существуют
      if (!user || !token) {
        throw new Error('Неверный ответ от сервера');
      }

      // Проверяем что user это объект
      if (typeof user !== 'object' || user === null) {
        throw new Error('Неверный формат данных пользователя');
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Сохраняем только если данные валидны
      await Promise.all([
        AsyncStorage.setItem('@TheStillness:user', JSON.stringify(user)),
        AsyncStorage.setItem('@TheStillness:token', token)
      ]);

      setUser(user);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      let errorMessage = 'Ошибка при регистрации';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Пользователь с таким email уже существует';
        } else if (error.response.status === 500) {
          errorMessage = 'Ошибка сервера. Попробуйте позже';
        }
      } else if (error.message === 'Network Error') {
        errorMessage = 'Нет подключения к серверу';
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.multiRemove(['@TheStillness:user', '@TheStillness:token']);
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};