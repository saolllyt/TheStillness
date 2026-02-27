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
  note: string | null;
  created_date: Date;
  created_at: Date;
}

export interface CreateEmotionEntryDto {
  user_id: number;
  emotion_type_id: number;
  intensity: number;
  note?: string;
  created_date?: Date;
}

export class EmotionModel {
  // Получение всех типов эмоций
  static async getAllEmotionTypes(): Promise<EmotionType[]> {
    const query = 'SELECT * FROM emotion_types ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  // Создание записи в трекере
  static async createEntry(entryData: CreateEmotionEntryDto): Promise<EmotionEntry> {
    const { user_id, emotion_type_id, intensity, note, created_date } = entryData;
    
    const query = `
      INSERT INTO emotion_tracker (user_id, emotion_type_id, intensity, note, created_date)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
      ON CONFLICT (user_id, emotion_type_id, created_date) 
      DO UPDATE SET intensity = EXCLUDED.intensity, note = EXCLUDED.note
      RETURNING *
    `;
    
    const values = [user_id, emotion_type_id, intensity, note || null, created_date || null];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  // Получение записей пользователя за дату
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

  // Получение записей пользователя за период
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
  
  console.log('SQL Query:', query);
  console.log('Parameters:', [user_id, start_date, end_date]);
  
  const result = await pool.query(query, [user_id, start_date, end_date]);
  
  console.log(`Найдено ${result.rows.length} записей`);
  return result.rows;
}

  // Обновление записи
  static async updateEntry(id: number, user_id: number, data: { intensity?: number; note?: string }): Promise<EmotionEntry | null> {
    const { intensity, note } = data;
    
    const query = `
      UPDATE emotion_tracker
      SET intensity = COALESCE($1, intensity),
          note = COALESCE($2, note)
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;
    
    const values = [intensity || null, note || null, id, user_id];
    const result = await pool.query(query, values);
    
    return result.rows[0] || null;
  }

  // Удаление записи
  static async deleteEntry(id: number, user_id: number): Promise<boolean> {
    const query = 'DELETE FROM emotion_tracker WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, user_id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}