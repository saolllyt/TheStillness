import { pool } from '../config/database';

export interface Report {
  id: number;
  user_id: number;
  report_type: string;
  start_date: string;
  end_date: string;
  report_content: any;
  psychologist_email: string | null;
  sent_at: Date | null;
  created_at: Date;
}

export interface CreateReportDto {
  user_id: number;
  report_type: string;
  start_date: string;
  end_date: string;
  report_content: any;
  psychologist_email?: string;
}

export class ReportModel {
  // Создание отчета
  static async create(reportData: CreateReportDto): Promise<Report> {
    const {
      user_id,
      report_type,
      start_date,
      end_date,
      report_content,
      psychologist_email
    } = reportData;

    const query = `
      INSERT INTO reports (user_id, report_type, start_date, end_date, report_content, psychologist_email)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      user_id,
      report_type,
      start_date,
      end_date,
      JSON.stringify(report_content),
      psychologist_email || null
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  }

  // Получение отчета по ID
  static async findById(id: number, user_id: number): Promise<Report | null> {
    const query = 'SELECT * FROM reports WHERE id = $1 AND user_id = $2';
    try {
      const result = await pool.query(query, [id, user_id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Find report by id error:', error);
      throw error;
    }
  }

  // Получение всех отчетов пользователя
  static async findByUserId(user_id: number): Promise<Report[]> {
    const query = 'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC';
    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error('Find reports by user id error:', error);
      throw error;
    }
  }

  // Отметить отчет как отправленный
  static async markAsSent(id: number, user_id: number): Promise<Report | null> {
    const query = `
      UPDATE reports
      SET sent_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [id, user_id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Mark report as sent error:', error);
      throw error;
    }
  }
}