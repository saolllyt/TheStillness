import { pool } from '../config/database';

export interface Comic {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string;
  pdf_url: string | null;
  author: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface ComicPage {
  id: number;
  comic_id: number;
  page_number: number;
  image_url: string;
  text_content: string | null;
}

export class ComicModel {
  // Получение всех активных комиксов
  static async getAll(): Promise<Comic[]> {
    const query = `
      SELECT * FROM comics 
      WHERE is_active = true 
      ORDER BY id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Получение комикса по ID
  static async findById(id: number): Promise<Comic | null> {
    const query = 'SELECT * FROM comics WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Получение страниц комикса для будущего функционала
  static async getPages(comic_id: number): Promise<ComicPage[]> {
    const query = `
      SELECT * FROM comic_pages 
      WHERE comic_id = $1 
      ORDER BY page_number
    `;
    const result = await pool.query(query, [comic_id]);
    return result.rows;
  }
}