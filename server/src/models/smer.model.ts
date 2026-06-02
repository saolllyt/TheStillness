import { pool } from '../config/database';

export interface SmerEntry {
  id: number;
  user_id: number;
  entry_date: Date;
  situation_place: string | null;
  situation_description: string;
  thoughts: string;
  reaction_description: string;
  selected_emotions: any[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateSmerEntryDto {
  user_id: number;
  entry_date?: Date;
  situation_place?: string;
  situation_description: string;
  thoughts: string;
  reaction_description: string;
  selected_emotions: any[];
}

export class SmerModel {
  // Создание записи
  static async create(entryData: CreateSmerEntryDto): Promise<SmerEntry> {
    const {
      user_id,
      entry_date,
      situation_place,
      situation_description,
      thoughts,
      reaction_description,
      selected_emotions
    } = entryData;

    const query = `
      INSERT INTO smer_diary (
        user_id, entry_date, situation_place, situation_description,
        thoughts, reaction_description, selected_emotions
      )
      VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user_id,
      entry_date || null,
      situation_place || null,
      situation_description,
      thoughts,
      reaction_description,
      JSON.stringify(selected_emotions)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Получение записи по ID
  static async findById(id: number, user_id: number): Promise<SmerEntry | null> {
    const query = 'SELECT * FROM smer_diary WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0] || null;
  }

  // Получение всех записей пользователя
  static async findByUserId(user_id: number, limit: number, offset: number, search?: string): Promise<any[]> {
    if (search) {
      const query = `
        SELECT * FROM smer_diary
        WHERE user_id = $1
          AND (
            situation_description ILIKE $4
            OR thoughts ILIKE $4
            OR reaction_description ILIKE $4
            OR situation_place ILIKE $4
            OR TO_CHAR(entry_date, 'DD.MM.YYYY') ILIKE $4
            OR TO_CHAR(entry_date, 'YYYY-MM-DD') ILIKE $4
          )
        ORDER BY entry_date DESC, created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await pool.query(query, [user_id, limit, offset, `%${search}%`]);
      return result.rows;
    }
    const query = `
      SELECT * FROM smer_diary
      WHERE user_id = $1
      ORDER BY entry_date DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  }

  // Подсчет количества записей пользователя
  static async countByUserId(user_id: number, search?: string): Promise<number> {
    if (search) {
      const query = `
        SELECT COUNT(*) FROM smer_diary
        WHERE user_id = $1
          AND (
            situation_description ILIKE $2
            OR thoughts ILIKE $2
            OR reaction_description ILIKE $2
            OR situation_place ILIKE $2
            OR TO_CHAR(entry_date, 'DD.MM.YYYY') ILIKE $2
            OR TO_CHAR(entry_date, 'YYYY-MM-DD') ILIKE $2
          )
      `;
      const result = await pool.query(query, [user_id, `%${search}%`]);
      return parseInt(result.rows[0].count);
    }
    const query = 'SELECT COUNT(*) FROM smer_diary WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return parseInt(result.rows[0].count);
  }

  // Получение записей за период
  static async findByDateRange(
    user_id: number,
    start_date: string,
    end_date: string
  ): Promise<any[]> {
    const query = `
      SELECT * FROM smer_diary 
      WHERE user_id = $1 
        AND entry_date BETWEEN $2 AND $3
      ORDER BY entry_date DESC
    `;
    const result = await pool.query(query, [user_id, start_date, end_date]);
    return result.rows;
  }

  // Обновление записи
  static async update(
    id: number,
    user_id: number,
    entryData: Partial<CreateSmerEntryDto>
  ): Promise<SmerEntry | null> {
    const {
      entry_date,
      situation_place,
      situation_description,
      thoughts,
      reaction_description,
      selected_emotions
    } = entryData;

    const query = `
      UPDATE smer_diary
      SET entry_date = COALESCE($1, entry_date),
          situation_place = COALESCE($2, situation_place),
          situation_description = COALESCE($3, situation_description),
          thoughts = COALESCE($4, thoughts),
          reaction_description = COALESCE($5, reaction_description),
          selected_emotions = COALESCE($6, selected_emotions),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `;

    const values = [
      entry_date || null,
      situation_place || null,
      situation_description || null,
      thoughts || null,
      reaction_description || null,
      selected_emotions ? JSON.stringify(selected_emotions) : null,
      id,
      user_id
    ];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Удаление записи
  static async delete(id: number, user_id: number): Promise<boolean> {
    const query = 'DELETE FROM smer_diary WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, user_id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}