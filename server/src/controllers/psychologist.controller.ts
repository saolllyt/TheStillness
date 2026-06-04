import { Request, Response } from 'express';
import { PsychologistModel } from '../models/psychologist.model';
import { MessageModel } from '../models/message.model';
import { ReportModel } from '../models/report.model';

export class PsychologistController {
  // Получаем профиль текущего психолога 
  static async getMyProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const result = await PsychologistModel.findByUserId(userId);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Профиль психолога не найден' });
      }
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Get my profile error:', error);
      res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
  }

  // Получаем всех психологов
  static async getAll(req: Request, res: Response) {
    try {
      const psychologists = await PsychologistModel.getAll();
      res.json({ success: true, data: psychologists });
    } catch (error) {
      console.error('Get psychologists error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении психологов' });
    }
  }

  // Запрос психологу
  static async sendRequest(req: Request, res: Response) {
    try {
      const patientId = (req as any).userId;
      const { psychologistUserId } = req.body;

      if (!psychologistUserId) {
        return res.status(400).json({ success: false, message: 'ID психолога не указан' });
      }

      const result = await PsychologistModel.sendRequest(psychologistUserId, patientId);
      res.json({ success: true, message: 'Запрос отправлен', data: result });
    } catch (error) {
      console.error('Send request error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке запроса' });
    }
  }

  // Получение моих психологов для пациента
  static async getMyPsychologists(req: Request, res: Response) {
    try {
      const patientId = (req as any).userId;
      const psychologists = await PsychologistModel.getMyPsychologists(patientId);
      res.json({ success: true, data: psychologists });
    } catch (error) {
      console.error('Get my psychologists error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении психологов' });
    }
  }

  // Отменить запрос психологу
  static async cancelRequest(req: Request, res: Response) {
    try {
      const patientId = (req as any).userId;
      const psychologistUserId = parseInt(req.params.psychologistUserId as string, 10);
      if (!psychologistUserId) {
        return res.status(400).json({ success: false, message: 'ID психолога не указан' });
      }
      await PsychologistModel.cancelRequest(psychologistUserId, patientId);
      res.json({ success: true, message: 'Запрос отменён' });
    } catch (error) {
      console.error('Cancel request error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отмене запроса' });
    }
  }

  // Получить пациентов для психолога
  static async getMyPatients(req: Request, res: Response) {
    try {
      const psychologistUserId = (req as any).userId;
      const patients = await PsychologistModel.getPatients(psychologistUserId);
      res.json({ success: true, data: patients });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении пациентов' });
    }
  }

  // Принять/отклонить запрос для психолога
  static async updateRequestStatus(req: Request, res: Response) {
    try {
      const psychologistUserId = (req as any).userId;
      const { patientId, status } = req.body;

      if (!patientId || !status) {
        return res.status(400).json({ success: false, message: 'Не указаны обязательные поля' });
      }

      if (!['active', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Неверный статус' });
      }

      const result = await PsychologistModel.updateRequestStatus(
        psychologistUserId, patientId, status
      );
      res.json({ success: true, message: 'Статус обновлён', data: result });
    } catch (error) {
      console.error('Update request status error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при обновлении статуса' });
    }
  }

  // Получить диалоги
  static async getDialogs(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const dialogs = await MessageModel.getDialogs(userId);
      res.json({ success: true, data: dialogs });
    } catch (error) {
      console.error('Get dialogs error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении диалогов' });
    }
  }

  // Получить переписку
  static async getConversation(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    
    const userIdParam = req.params.userId;
    
    if (!userIdParam || Array.isArray(userIdParam)) {
      return res.status(400).json({ success: false, message: 'Неверный ID пользователя' });
    }
    
    const otherUserId = parseInt(userIdParam as string, 10);

    if (isNaN(otherUserId)) {
      return res.status(400).json({ success: false, message: 'Неверный ID пользователя' });
    }

    const messages = await MessageModel.getConversation(userId, otherUserId);
    await MessageModel.markAsRead(otherUserId, userId);

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении переписки' });
  }
}

  // Отправить сообщение
  static async sendMessage(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { receiverId, content, reportId } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ success: false, message: 'Не указаны обязательные поля' });
      }

      const message = await MessageModel.create(senderId, receiverId, content, reportId);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке сообщения' });
    }
  }

  // Отправить клинический отчёт психолога в чат (создаём JSON на сервере)
  static async sendPsychReport(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { receiverId, reportId } = req.body;
      if (!receiverId || !reportId) {
        return res.status(400).json({ success: false, message: 'Не указаны обязательные поля' });
      }
      const { pool } = await import('../config/database');
      const reportRes = await pool.query(
        `SELECT pr.*, u.first_name as psych_first, u.last_name as psych_last
         FROM psychologist_reports pr
         JOIN users u ON pr.psychologist_id = u.id
         WHERE pr.id = $1 AND pr.psychologist_id = $2`,
        [reportId, senderId]
      );
      if (!reportRes.rows[0]) {
        return res.status(404).json({ success: false, message: 'Отчёт не найден' });
      }
      const report = reportRes.rows[0];
      const content = JSON.stringify({
        type: 'psychologist_report',
        id: report.id,
        report_date: report.report_date,
        psych_name: `${report.psych_first || ''} ${report.psych_last || ''}`.trim(),
        complaints: report.complaints,
        anamnesis: report.anamnesis,
        examinations: report.examinations,
        recommendations: report.recommendations,
      });
      const message = await MessageModel.create(senderId, receiverId, content);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error('Send psych report error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке отчёта' });
    }
  }

  // Отправить отчёт в чат
  static async sendReport(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { receiverId, reportId } = req.body;

      if (!receiverId || !reportId) {
        return res.status(400).json({ success: false, message: 'Не указаны обязательные поля' });
      }

      const report = await ReportModel.findById(reportId, senderId);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Отчёт не найден' });
      }

      const message = await MessageModel.create(
        senderId,
        receiverId,
        'Отправлен отчёт',
        reportId
      );

      await ReportModel.markAsSent(reportId, senderId);

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error('Send report error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при отправке отчёта' });
    }
  }

  // Удалить пациента из списка
  static async removePatient(req: Request, res: Response) {
    try {
      const psychologistUserId = (req as any).userId;
      const patientId = parseInt(req.params.patientId as string, 10);
      if (isNaN(patientId)) {
        return res.status(400).json({ success: false, message: 'Неверный ID пациента' });
      }
      const { pool } = await import('../config/database');
      await pool.query(
        'DELETE FROM psychologist_patients WHERE psychologist_id = $1 AND patient_id = $2',
        [psychologistUserId, patientId]
      );
      res.json({ success: true, message: 'Пациент удалён' });
    } catch (error) {
      console.error('Remove patient error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при удалении пациента' });
    }
  }

  // Количество непрочитанных
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const count = await MessageModel.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ success: false, message: 'Ошибка' });
    }
  }
}