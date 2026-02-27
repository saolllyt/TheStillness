import api from '../services/api/client';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateLoginForm = (data: LoginFormData): { 
  isValid: boolean; 
  errors: Record<string, string> 
} => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email обязателен';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Введите корректный email';
  }
  
  if (!data.password) {
    errors.password = 'Пароль обязателен';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data.exists;
  } catch (error) {
    return false;
  }
};

export const validateRegisterForm = async (data: RegisterFormData): Promise<{ 
  isValid: boolean; 
  errors: Record<string, string> 
}> => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email обязателен';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Введите корректный email';
  } else {
    const exists = await checkEmailExists(data.email);
    if (exists) {
      errors.email = 'Пользователь с таким email уже существует';
    }
  }
  
  if (!data.password) {
    errors.password = 'Пароль обязателен';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Пароль должен быть не менее 6 символов';
  }
  
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Подтверждение пароля обязательно';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }
  
  if (data.firstName && data.firstName.length > 50) {
    errors.firstName = 'Имя не может быть длиннее 50 символов';
  }
  
  if (data.lastName && data.lastName.length > 50) {
    errors.lastName = 'Фамилия не может быть длиннее 50 символов';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};