import { pool } from '../config/database';

export interface EmotionType {
  id: number;
  name: string;
  color: string | null;
  emoji: string | null;
}

export interface EmotionEntry {
  id: number;
  user_id: number;
  emotion_type_id: number;
  intensity: number;
  created_date: Date;
  created_at: Date;
}

export interface CreateEmotionEntryDto {
  user_id: number;
  emotion_type_id: number;
  intensity: number;
  created_date?: Date;
}

export class EmotionModel {
  static async getAllEmotionTypes(): Promise<EmotionType[]> {
    const query = 'SELECT * FROM emotion_types ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async createEntry(entryData: CreateEmotionEntryDto): Promise<EmotionEntry> {
    const { user_id, emotion_type_id, intensity, created_date } = entryData;
    
    const query = `
      INSERT INTO emotion_tracker (user_id, emotion_type_id, intensity, created_date)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
      ON CONFLICT (user_id, emotion_type_id, created_date) 
      DO UPDATE SET intensity = EXCLUDED.intensity
      RETURNING *
    `;
    
    const values = [user_id, emotion_type_id, intensity, created_date || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getEntriesByDate(user_id: number, date: string): Promise<any[]> {
    const query = `
      SELECT et.*, e.name as emotion_name, e.color, e.emoji
      FROM emotion_tracker et
      JOIN emotion_types e ON et.emotion_type_id = e.id
      WHERE et.user_id = $1 AND et.created_date = $2
      ORDER BY et.intensity DESC
    `;
    const result = await pool.query(query, [user_id, date]);
    return result.rows;
  }

  static async getEntriesByDateRange(
    user_id: number,
    start_date: string,
    end_date: string
  ): Promise<any[]> {
    const query = `
      SELECT et.*, e.name as emotion_name, e.color, e.emoji
      FROM emotion_tracker et
      JOIN emotion_types e ON et.emotion_type_id = e.id
      WHERE et.user_id = $1 
        AND et.created_date BETWEEN $2 AND $3
      ORDER BY et.created_date DESC, et.intensity DESC
    `;
    const result = await pool.query(query, [user_id, start_date, end_date]);
    return result.rows;
  }

  static async updateEntry(
    id: number,
    user_id: number,
    data: { intensity?: number }
  ): Promise<EmotionEntry | null> {
    const query = `
      UPDATE emotion_tracker
      SET intensity = COALESCE($1, intensity)
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [data.intensity || null, id, user_id]);
    return result.rows[0] || null;
  }

  static async deleteEntry(id: number, user_id: number): Promise<boolean> {
    const query = 'DELETE FROM emotion_tracker WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, user_id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}