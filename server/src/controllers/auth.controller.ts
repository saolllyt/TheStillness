import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { generateToken } from '../middleware/auth';
import { pool } from '../config/database';
import { sendResetCode } from '../services/email.service';
import bcrypt from 'bcrypt';

export class AuthController {
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

  static async registerPsychologist(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, specialization, licenseNumber } = req.body;

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

      if (!specialization) {
        return res.status(400).json({
          success: false,
          message: 'Специализация обязательна'
        });
      }

      if (!licenseNumber) {
        return res.status(400).json({
          success: false,
          message: 'Номер лицензии обязателен'
        });
      }

      // Создаём пользователя с ролью психолог
      const user = await UserModel.createPsychologist({
        email,
        password,
        firstName,
        lastName,
      });

      await pool.query(
        `INSERT INTO psychologists (user_id, specialization, license_number, status, is_verified)
         VALUES ($1, $2, $3, 'pending', false)`,
        [user.id, specialization, licenseNumber]
      );

      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Заявка отправлена. Ожидайте подтверждения администратора.',
        user,
        token
      });
    } catch (error: any) {
      console.error('Register psychologist error:', error);

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

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email и пароль обязательны'
        });
      }

      const user = await UserModel.findByEmailAny(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Неверный email или пароль'
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Ваш аккаунт заблокирован. Обратитесь к администратору.'
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

  static async forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email обязателен' });
    }

    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'Если такой email зарегистрирован, вы получите письмо'
      });
    }

    const userId = userResult.rows[0].id;

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    // Удаляем старые коды для этого пользователя
    await pool.query('DELETE FROM password_reset_codes WHERE user_id = $1', [userId]);

    // Сохраняем новый код
    await pool.query(
      'INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );

   
    res.json({
      success: true,
      message: 'Если такой email зарегистрирован, вы получите письмо',
      ...(process.env.NODE_ENV === 'development' && { dev_code: code }),
    });

    sendResetCode(email, code).catch(() => {
      console.warn('⚠️ Email не отправлен. Код для разработки:', code);
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

static async deleteAccount(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    await pool.query('DELETE FROM password_reset_codes WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM smer_diary WHERE user_id = $1', [userId]);

    // Опциональные таблицы, которые могут отсутствовать
    const optionals = [
      'DELETE FROM emotion_logs WHERE user_id = $1',
      'DELETE FROM tracker_entries WHERE user_id = $1',
      'DELETE FROM messages WHERE sender_id = $1',
      'DELETE FROM messages WHERE receiver_id = $1',
      'DELETE FROM psychologist_reports WHERE patient_id = $1',
      'DELETE FROM psychologist_reports WHERE psychologist_user_id = $1',
      'DELETE FROM chat_messages WHERE user_id = $1',
    ];
    for (const q of optionals) {
      try { await pool.query(q, [userId]); } catch { /* таблица может не существовать */ }
    }

    // Профиль психолога 
    await pool.query('DELETE FROM psychologists WHERE user_id = $1', [userId]);

    // Сам пользователь
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ success: true, message: 'Аккаунт удалён' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении аккаунта' });
  }
}

static async testEmail(req: Request, res: Response) {
  try {
    const { sendResetCode } = await import('../services/email.service');
    await sendResetCode(req.query.to as string || 'test@test.com', '123456');
    res.json({ success: true, message: 'Email отправлен' });
  } catch (error: any) {
    res.json({ success: false, error: error.message, code: error.code, response: error.response });
  }
}

static async resetPassword(req: Request, res: Response) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Все поля обязательны' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Пароль минимум 6 символов' });
    }

    // Находим пользователя
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Неверный код или email' });
    }

    const userId = userResult.rows[0].id;

    // Проверяем код
    const codeResult = await pool.query(
      `SELECT id FROM password_reset_codes 
       WHERE user_id = $1 AND code = $2 AND expires_at > NOW()`,
      [userId, code]
    );

    if (codeResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Неверный код или срок его действия истёк'
      });
    }

    // Обновляем пароль
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );

    // Удаляем использованный код
    await pool.query('DELETE FROM password_reset_codes WHERE user_id = $1', [userId]);

    res.json({ success: true, message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}
}