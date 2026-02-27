import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { generateToken } from '../middleware/auth';

export class AuthController {
  // Регистрация
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email и пароль обязательны' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: 'Пароль должен быть не менее 6 символов' 
        });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ 
          success: false,
          message: 'Введите корректный email' 
        });
      }

      const user = await UserModel.create({
        email,
        password,
        firstName,
        lastName
      });

      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Регистрация прошла успешно',
        user,
        token
      });
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.message === 'Пользователь с таким email уже существует') {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: 'Ошибка сервера при регистрации' 
      });
    }
  }

  // Вход
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email и пароль обязательны' 
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Неверный email или пароль' 
        });
      }

      const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          message: 'Неверный email или пароль' 
        });
      }

      const token = generateToken(user.id);

      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Вход выполнен успешно',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка сервера при входе' 
      });
    }
  }

  // Получение текущего пользователя
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          message: 'Не авторизован' 
        });
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Пользователь не найден' 
        });
      }

      res.json({ 
        success: true,
        user 
      });
    } catch (error) {
      console.error('GetMe error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка сервера' 
      });
    }
  }
}