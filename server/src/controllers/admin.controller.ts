import { Request, Response } from 'express';
import { pool } from '../config/database';
import { UserModel } from '../models/user.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const booksDir = path.join(process.cwd(), 'assets/books');
if (!fs.existsSync(booksDir)) fs.mkdirSync(booksDir, { recursive: true });

export const bookUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, booksDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const unique = `${Date.now()}_${safe}`;
      cb(null, unique);
    },
  }),
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

export class AdminController {

  // Проверка роли админа
  static async checkAdmin(req: Request, res: Response, next: any) {
    try {
      const userId = (req as any).userId;
      const result = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [userId]
      );
      if (!result.rows[0] || result.rows[0].role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Доступ запрещён'
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
  }

  // Получить всех пользователей
  static async getUsers(req: Request, res: Response) {
    try {
      const { role, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = `
        SELECT id, email, first_name, last_name, role, is_active, created_at
        FROM users
        WHERE 1=1
      `;
      const params: any[] = [];

      if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM users ${role ? 'WHERE role = $1' : ''}`,
        role ? [role] : []
      );

      res.json({
        success: true,
        data: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении пользователей' });
    }
  }

  // Заблокировать/разблокировать пользователя
  static async toggleUserActive(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await pool.query(
        `UPDATE users SET is_active = NOT is_active WHERE id = $1
         RETURNING id, email, is_active, role`,
        [userId]
      );
      if (!result.rows[0]) {
        return res.status(404).json({ success: false, message: 'Пользователь не найден' });
      }
      res.json({
        success: true,
        message: result.rows[0].is_active ? 'Пользователь разблокирован' : 'Пользователь заблокирован',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Toggle user error:', error);
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Получить всех психологов с их статусом
  static async getPsychologists(req: Request, res: Response) {
    try {
      const query = `
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at,
          p.id as psychologist_id, p.specialization, p.license_number,
          p.status, p.is_verified,
          COUNT(pp.id) as patients_count
        FROM users u
        JOIN psychologists p ON u.id = p.user_id
        LEFT JOIN psychologist_patients pp ON p.id = pp.psychologist_id AND pp.status = 'active'
        WHERE u.role = 'psychologist'
        GROUP BY u.id, p.id
        ORDER BY p.status ASC, u.created_at DESC
      `;
      const result = await pool.query(query);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Get psychologists error:', error);
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Верифицировать психолога
  static async verifyPsychologist(req: Request, res: Response) {
    try {
      const { psychologistId } = req.params;
      const { status } = req.body; // 'active' или 'rejected'

      if (!['active', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Неверный статус' });
      }

      const result = await pool.query(
        `UPDATE psychologists 
         SET status = $1, is_verified = $2
         WHERE id = $3
         RETURNING *`,
        [status, status === 'active', psychologistId]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ success: false, message: 'Психолог не найден' });
      }

      res.json({
        success: true,
        message: status === 'active' ? 'Психолог верифицирован' : 'Заявка отклонена',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Verify psychologist error:', error);
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Статистика 
  static async getStats(req: Request, res: Response) {
    try {
      const [users, psychologists, diary, emotions, pendingPsych] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM users WHERE role = 'user' AND is_active = true"),
        pool.query("SELECT COUNT(*) FROM users WHERE role = 'psychologist' AND is_active = true"),
        pool.query('SELECT COUNT(*) FROM smer_diary'),
        pool.query('SELECT COUNT(*) FROM emotion_tracker'),
        pool.query("SELECT COUNT(*) FROM psychologists WHERE status = 'pending'"),
      ]);

      res.json({
        success: true,
        data: {
          totalUsers: parseInt(users.rows[0].count),
          totalPsychologists: parseInt(psychologists.rows[0].count),
          totalDiaryEntries: parseInt(diary.rows[0].count),
          totalEmotionEntries: parseInt(emotions.rows[0].count),
          pendingPsychologists: parseInt(pendingPsych.rows[0].count),
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Управление книгами
  static async getComics(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM comics ORDER BY id');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  static async toggleComic(req: Request, res: Response) {
    try {
      const { comicId } = req.params;
      const result = await pool.query(
        'UPDATE comics SET is_active = NOT is_active WHERE id = $1 RETURNING *',
        [comicId]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Управление плейлистами
  static async getPlaylists(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM playlists ORDER BY id');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  static async togglePlaylist(req: Request, res: Response) {
    try {
      const { playlistId } = req.params;
      const result = await pool.query(
        'UPDATE playlists SET is_active = NOT is_active WHERE id = $1 RETURNING *',
        [playlistId]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  // Создание админа
static async createAdmin(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email и пароль обязательны' });
    }

    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, 'admin', true)
       RETURNING id, email, first_name, last_name, role`,
      [email.toLowerCase(), password_hash, firstName || null, lastName || null]
    );

    res.status(201).json({ success: true, message: 'Администратор создан', data: result.rows[0] });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при создании администратора' });
  }
}

// Добавление книги 
static async createComic(req: Request, res: Response) {
  try {
    const { title, author, description, cover_image_url } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!title) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ success: false, message: 'Название обязательно' });
    }
    if (!file) {
      return res.status(400).json({ success: false, message: 'PDF файл обязателен' });
    }

    // pdf_url хранит имя файла; сервер раздаёт его по /books/<filename>
    const pdfUrl = `books/${file.filename}`;

    const result = await pool.query(
      `INSERT INTO comics (title, author, description, cover_image_url, pdf_url, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [title, author || null, description || null, cover_image_url || null, pdfUrl]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create comic error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при создании книги' });
  }
}

// Удаление книги
static async deleteComic(req: Request, res: Response) {
  try {
    const { comicId } = req.params;
    await pool.query('DELETE FROM comics WHERE id = $1', [comicId]);
    res.json({ success: true, message: 'Комикс удалён' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка' });
  }
}

static async getAdmins(req: Request, res: Response) {
  try {
    const currentUserId = (req as any).userId;
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, is_active, created_at
       FROM users 
       WHERE role = 'admin' AND id != $1
       ORDER BY created_at DESC`,
      [currentUserId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: 'Ошибка' });
  }
}
}