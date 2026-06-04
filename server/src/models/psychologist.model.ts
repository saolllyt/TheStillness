import { pool } from '../config/database';

export class PsychologistModel {
  // Получить всех психологов
  static async getAll(): Promise<any[]> {
  const query = `
    SELECT 
      u.id, u.email, u.first_name, u.last_name,
      p.specialization, p.license_number,
      p.id as psychologist_id,
      p.status, p.is_verified
    FROM users u
    JOIN psychologists p ON u.id = p.user_id
    WHERE u.is_active = true 
      AND u.role = 'psychologist'
      AND p.status = 'active'
      AND p.is_verified = true
    ORDER BY u.first_name
  `;
  const result = await pool.query(query);
  return result.rows;
}

  // Получить психолога по id
  static async findByUserId(user_id: number): Promise<any | null> {
    const query = `
      SELECT u.id, u.email, u.first_name, u.last_name,
             p.specialization, p.license_number, p.id as psychologist_id,
             p.status, p.is_verified
      FROM users u
      JOIN psychologists p ON u.id = p.user_id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null;
  }

  // Отправить запрос на связь
  // psychologist_patients.psychologist_id = users.id (FK references users)
  static async sendRequest(psychologist_user_id: number, patient_id: number): Promise<any> {
    const verify = await pool.query(
      'SELECT id FROM psychologists WHERE user_id = $1 AND status = $2 AND is_verified = true',
      [psychologist_user_id, 'active']
    );
    if (!verify.rows[0]) throw new Error('Психолог не найден или не верифицирован');

    const query = `
      INSERT INTO psychologist_patients (psychologist_id, patient_id, status)
      VALUES ($1, $2, 'pending')
      ON CONFLICT (psychologist_id, patient_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [psychologist_user_id, patient_id]);
    return result.rows[0];
  }

  // Принять/отклонить запрос психолог
  static async updateRequestStatus(
    psychologist_user_id: number,
    patient_id: number,
    status: 'active' | 'rejected'
  ): Promise<any> {
    const query = `
      UPDATE psychologist_patients
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE psychologist_id = $2 AND patient_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, psychologist_user_id, patient_id]);
    return result.rows[0];
  }

  // Получить пациентов психолога
  static async getPatients(psychologist_user_id: number): Promise<any[]> {
    const query = `
      SELECT
        u.id, u.email, u.first_name, u.last_name,
        pp.status, pp.created_at as connected_at
      FROM psychologist_patients pp
      JOIN users u ON pp.patient_id = u.id
      WHERE pp.psychologist_id = $1
        AND u.is_active = true
      ORDER BY pp.created_at DESC
    `;
    const result = await pool.query(query, [psychologist_user_id]);
    return result.rows;
  }

  // Получить психологов пациента
  static async getMyPsychologists(patient_id: number): Promise<any[]> {
    const query = `
      SELECT
        u.id, u.email, u.first_name, u.last_name,
        p.specialization, p.id as psychologist_id,
        pp.status, pp.created_at as connected_at
      FROM psychologist_patients pp
      JOIN users u ON pp.psychologist_id = u.id
      JOIN psychologists p ON p.user_id = pp.psychologist_id
      WHERE pp.patient_id = $1
      ORDER BY pp.created_at DESC
    `;
    const result = await pool.query(query, [patient_id]);
    return result.rows;
  }

  // Отменить запрос пациент
  static async cancelRequest(psychologist_user_id: number, patient_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM psychologist_patients WHERE psychologist_id = $1 AND patient_id = $2',
      [psychologist_user_id, patient_id]
    );
  }

  // Проверить связь
  static async checkConnection(psychologist_user_id: number, patient_id: number): Promise<any> {
    const query = `
      SELECT pp.*
      FROM psychologist_patients pp
      WHERE pp.psychologist_id = $1 AND pp.patient_id = $2
    `;
    const result = await pool.query(query, [psychologist_user_id, patient_id]);
    return result.rows[0] || null;
  }
}