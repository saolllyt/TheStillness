import { Request, Response } from 'express';
import { EmotionModel } from '../models/emotion.model';

export class TrackerController {
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

  // Получение записей за сегодня
  static async getTodayEntries(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const today = new Date().toISOString().split('T')[0];
      
      const entries = await EmotionModel.getEntriesByDate(userId, today);

      res.json({
        success: true,
        data: entries
      });
    } catch (error) {
      console.error('Get today entries error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей'
      });
    }
  }

  // Создание записи
  static async createEntry(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { emotion_type_id, intensity } = req.body; // убрали note

    const entry = await EmotionModel.createEntry({
      user_id: userId,
      emotion_type_id,
      intensity,
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

  // Обновление записи
  static async updateEntry(req: Request, res: Response) {
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

      const { intensity, note } = req.body;

      const updatedEntry = await EmotionModel.updateEntry(id, userId, { intensity});

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Запись обновлена',
        data: updatedEntry
      });
    } catch (error) {
      console.error('Update entry error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении записи'
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