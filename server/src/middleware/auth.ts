import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  userId?: number;
}

// Явная проверка и приведение типа
const JWT_SECRET: string = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

// Жесткая проверка
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET не определен в .env файле!');
}

if (JWT_SECRET.length < 10) {
  console.warn('⚠️ JWT_SECRET слишком короткий. Рекомендуется минимум 32 символа');
}

export const generateToken = (userId: number): string => {
  //any для обхода проверки типов
  const options: any = { expiresIn: JWT_EXPIRES_IN };
  return (jwt as any).sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Неверный формат токена' });
  }

  try {
    const decoded = (jwt as any).verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истек' });
    }
    if (error?.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Недействительный токен' });
    }
    return res.status(401).json({ message: 'Ошибка верификации токена' });
  }
};