import { Request, Response } from 'express';
import { PsychologistReportModel } from '../models/psychologist_report.model';
import { pool } from '../config/database';

export class PsychologistReportController {
  static async create(req: Request, res: Response) {
    try {
      const psychologistId = (req as any).userId;
      const {
        patientId, reportDate, complaints,
        anamnesis, examinations, recommendations,
      } = req.body;

      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Пациент не указан' });
      }
      if (!reportDate) {
        return res.status(400).json({ success: false, message: 'Дата не указана' });
      }

      const report = await PsychologistReportModel.create({
        psychologist_id: psychologistId,
        patient_id: patientId,
        report_date: reportDate,
        complaints: complaints || '',
        anamnesis: anamnesis || '',
        examinations: examinations || '',
        recommendations: recommendations || '',
      });

      res.status(201).json({ success: true, data: report });
    } catch (error) {
      console.error('Create psych report error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при создании отчёта' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const psychologistId = (req as any).userId;
      const reports = await PsychologistReportModel.findByPsychologist(psychologistId);
      res.json({ success: true, data: reports });
    } catch (error) {
      console.error('Get psych reports error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении отчётов' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const psychologistId = (req as any).userId;
      const { id } = req.params;
      const report = await PsychologistReportModel.findById(Number(id), psychologistId);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Отчёт не найден' });
      }
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const psychologistId = (req as any).userId;
      const { id } = req.params;
      const { reportDate, complaints, anamnesis, examinations, recommendations } = req.body;

      const report = await PsychologistReportModel.update(Number(id), psychologistId, {
        report_date: reportDate,
        complaints: complaints || '',
        anamnesis: anamnesis || '',
        examinations: examinations || '',
        recommendations: recommendations || '',
      });

      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка при обновлении' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const psychologistId = (req as any).userId;
      const { id } = req.params;
      await PsychologistReportModel.delete(Number(id), psychologistId);
      res.json({ success: true, message: 'Отчёт удалён' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ошибка при удалении' });
    }
  }

  static async sendToPatient(req: Request, res: Response) {
  try {
    const psychologistId = (req as any).userId;
    const { id } = req.params;

    const report = await PsychologistReportModel.getForSending(Number(id), psychologistId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Отчёт не найден' });
    }

    // Формируем текст сообщения
    const formatD = (d: string) => new Date(d).toLocaleDateString('ru-RU');
    const messageContent = `Результат мониторинга от ${formatD(report.report_date)}`;

    // Отправляем как сообщение в чат
    await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [psychologistId, report.patient_user_id, messageContent]
    );

    // Также сохраняем полный отчёт как JSON в сообщение
    const reportJson = JSON.stringify({
      type: 'psychologist_report',
      id: report.id,
      report_date: report.report_date,
      complaints: report.complaints,
      anamnesis: report.anamnesis,
      examinations: report.examinations,
      recommendations: report.recommendations,
      psych_name: report.psych_first_name
        ? `${report.psych_first_name} ${report.psych_last_name || ''}`.trim()
        : null,
    });

    await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [psychologistId, report.patient_user_id, reportJson]
    );

    res.json({ success: true, message: 'Отчёт отправлен пациенту' });
  } catch (error) {
    console.error('Send report to patient error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при отправке' });
  }
}
}