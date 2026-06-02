import { pool } from '../config/database';

export class PsychologistReportModel {
  static async create(data: {
    psychologist_id: number;
    patient_id: number;
    report_date: string;
    complaints: string;
    anamnesis: string;
    examinations: string;
    recommendations: string;
  }): Promise<any> {
    const query = `
      INSERT INTO psychologist_reports 
        (psychologist_id, patient_id, report_date, complaints, anamnesis, examinations, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.psychologist_id,
      data.patient_id,
      data.report_date,
      data.complaints,
      data.anamnesis,
      data.examinations,
      data.recommendations,
    ]);
    return result.rows[0];
  }

  static async findByPsychologist(psychologist_id: number): Promise<any[]> {
    const query = `
      SELECT 
        pr.*,
        u.first_name as patient_first_name,
        u.last_name as patient_last_name,
        u.email as patient_email,
        p.first_name as psych_first_name,
        p.last_name as psych_last_name
      FROM psychologist_reports pr
      JOIN users u ON pr.patient_id = u.id
      JOIN users p ON pr.psychologist_id = p.id
      WHERE pr.psychologist_id = $1
      ORDER BY pr.report_date DESC
    `;
    const result = await pool.query(query, [psychologist_id]);
    return result.rows;
  }

  static async findById(id: number, psychologist_id: number): Promise<any> {
    const query = `
      SELECT 
        pr.*,
        u.first_name as patient_first_name,
        u.last_name as patient_last_name,
        u.email as patient_email,
        p.first_name as psych_first_name,
        p.last_name as psych_last_name
      FROM psychologist_reports pr
      JOIN users u ON pr.patient_id = u.id
      JOIN users p ON pr.psychologist_id = p.id
      WHERE pr.id = $1 AND pr.psychologist_id = $2
    `;
    const result = await pool.query(query, [id, psychologist_id]);
    return result.rows[0] || null;
  }

  static async update(id: number, psychologist_id: number, data: {
    report_date: string;
    complaints: string;
    anamnesis: string;
    examinations: string;
    recommendations: string;
  }): Promise<any> {
    const query = `
      UPDATE psychologist_reports
      SET report_date = $1, complaints = $2, anamnesis = $3,
          examinations = $4, recommendations = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND psychologist_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.report_date,
      data.complaints,
      data.anamnesis,
      data.examinations,
      data.recommendations,
      id,
      psychologist_id,
    ]);
    return result.rows[0];
  }

  static async delete(id: number, psychologist_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM psychologist_reports WHERE id = $1 AND psychologist_id = $2',
      [id, psychologist_id]
    );
  }

  static async getForSending(id: number, psychologist_id: number): Promise<any> {
  const query = `
    SELECT 
      pr.*,
      u.first_name as patient_first_name,
      u.last_name as patient_last_name,
      u.email as patient_email,
      u.id as patient_user_id,
      p.first_name as psych_first_name,
      p.last_name as psych_last_name
    FROM psychologist_reports pr
    JOIN users u ON pr.patient_id = u.id
    JOIN users p ON pr.psychologist_id = p.id
    WHERE pr.id = $1 AND pr.psychologist_id = $2
  `;
  const result = await pool.query(query, [id, psychologist_id]);
  return result.rows[0] || null;
}
}