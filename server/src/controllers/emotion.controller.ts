import { Request, Response } from 'express';
import { EmotionModel } from '../models/emotion.model';

export class EmotionController {
  // Получение всех типов эмоций
  static async getEmotionTypes(req: Request, res: Response) {
    try {
      const emotions = await EmotionModel.getAllEmotionTypes();
      res.json({
        success: true,
        data: emotions
      });
    } catch (error) {
      console.error('Get emotion types error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка эмоций'
      });
    }
  }

  // Создание записи в трекере
  static async createEntry(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { emotion_type_id, intensity, created_date } = req.body; // убрали note

    const entry = await EmotionModel.createEntry({
      user_id: userId,
      emotion_type_id,
      intensity,
      created_date: created_date ? new Date(created_date) : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Запись создана',
      data: entry
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании записи'
    });
  }
}

  // Получение записей за дату
  static async getEntriesByDate(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const dateParam = req.params.date;

      if (!dateParam) {
        return res.status(400).json({
          success: false,
          message: 'Дата не указана'
        });
      }

      if (Array.isArray(dateParam)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный формат даты'
        });
      }

      const entries = await EmotionModel.getEntriesByDate(userId, dateParam);

      res.json({
        success: true,
        data: entries
      });
    } catch (error) {
      console.error('Get entries by date error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей'
      });
    }
  }

  // Получение записей за период
  static async getEntriesByDateRange(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const startDateParam = req.query.startDate;
      const endDateParam = req.query.endDate;

      if (!startDateParam || !endDateParam) {
        return res.status(400).json({
          success: false,
          message: 'Начальная и конечная дата обязательны'
        });
      }

      if (Array.isArray(startDateParam) || Array.isArray(endDateParam)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный формат дат'
        });
      }

      const entries = await EmotionModel.getEntriesByDateRange(
        userId, 
        startDateParam as string, 
        endDateParam as string
      );

      res.json({
        success: true,
        data: entries
      });
    } catch (error) {
      console.error('Get entries by range error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей'
      });
    }
  }

  // Удаление записи
  static async deleteEntry(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const idParam = req.params.id;

      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'ID записи не указан'
        });
      }

      if (Array.isArray(idParam)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный формат ID'
        });
      }

      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный ID записи'
        });
      }

      const deleted = await EmotionModel.deleteEntry(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Запись удалена'
      });
    } catch (error) {
      console.error('Delete entry error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении записи'
      });
    }
  }
}