import { pool } from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
  is_active: boolean;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class UserModel {
  // Создание нового пользователя
  static async create(userData: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
    const { email, password, firstName, lastName } = userData;
    
    try {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, created_at, is_active)
        VALUES ($1, $2, $3, $4, NOW(), true)
        RETURNING id, email, first_name, last_name, created_at, is_active
      `;
      
      const values = [email.toLowerCase(), password_hash, firstName || null, lastName || null];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('Пользователь с таким email уже существует');
      }
      console.error('Create user error:', error);
      throw new Error('Ошибка при создании пользователя');
    }
  }

  // Поиск пользователя по эмейлу
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
      const result = await pool.query(query, [email.toLowerCase()]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Find by email error:', error);
      throw new Error('Ошибка при поиске пользователя');
    }
  }

  static async findByEmailAny(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email.toLowerCase()]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Find by email (any) error:', error);
      throw new Error('Ошибка при поиске пользователя');
    }
  }

  // Поиск пользователя по ID
  static async findById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const query = `
        SELECT id, email, first_name, last_name, role, created_at, is_active
        FROM users
        WHERE id = $1 AND is_active = true
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Find by id error:', error);
      throw new Error('Ошибка при поиске пользователя');
    }
  }

  // Проверка пароля
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Verify password error:', error);
      throw new Error('Ошибка при проверке пароля');
    }
  }

static async update(userId: number, data: { firstName?: string; lastName?: string }): Promise<Omit<User, 'password_hash'> | null> {
  try {
    const { firstName, lastName } = data;
    const query = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name)
      WHERE id = $3 AND is_active = true
      RETURNING id, email, first_name, last_name, created_at, is_active
    `;
    const result = await pool.query(query, [firstName || null, lastName || null, userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error('Ошибка при обновлении пользователя');
  }
}

static async findByEmailWithPassword(userId: number): Promise<User | null> {
  try {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Find by id with password error:', error);
    throw new Error('Ошибка при поиске пользователя');
  }
}

static async updatePassword(userId: number, newPassword: string): Promise<void> {
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    await pool.query(query, [password_hash, userId]);
  } catch (error) {
    console.error('Update password error:', error);
    throw new Error('Ошибка при обновлении пароля');
  }
}

static async createPsychologist(userData: CreateUserDTO): Promise<Omit<User, 'password_hash'>> {
  const { email, password, firstName, lastName } = userData;

  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, created_at, is_active)
      VALUES ($1, $2, $3, $4, 'psychologist', NOW(), true)
      RETURNING id, email, first_name, last_name, role, created_at, is_active
    `;

    const values = [email.toLowerCase(), password_hash, firstName || null, lastName || null];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Пользователь с таким email уже существует');
    }
    console.error('Create psychologist error:', error);
    throw new Error('Ошибка при создании пользователя');
  }
}
}