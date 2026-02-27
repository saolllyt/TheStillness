import { Request, Response } from 'express';
import { SmerModel } from '../models/smer.model';

export class DiaryController {
  // Получение списка записей 
  static async getEntries(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const limitParam = req.query.limit;
      const offsetParam = req.query.offset;
      
      const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : 10;
      const offset = typeof offsetParam === 'string' ? parseInt(offsetParam, 10) : 0;

      const entries = await SmerModel.findByUserId(userId, limit, offset);
      const total = await SmerModel.countByUserId(userId);

      res.json({
        success: true,
        data: entries,
        total,
        limit,
        offset
      });
    } catch (error) {
      console.error('Get entries error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей'
      });
    }
  }

  // Получение одной записи
  static async getEntry(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      // Получаем id и проверяем, что это строка
      const idParam = req.params.id;
      
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'ID записи не указан'
        });
      }

      // Проверяем, что строка, а не массив
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

      const entry = await SmerModel.findById(id, userId);

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }

      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      console.error('Get entry error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записи'
      });
    }
  }

  // Создание записи
static async createEntry(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    let {
      entry_date,
      situation_place,
      situation_description,
      thoughts,
      reaction_description,
      selected_emotions
    } = req.body;

    // Валидация обязательных полей
    if (!situation_description || !thoughts || !reaction_description) {
      return res.status(400).json({
        success: false,
        message: 'Заполните обязательные поля'
      });
    }

    // Добавляем названия эмоций, если их нет
    if (selected_emotions && Array.isArray(selected_emotions)) {
      // Здесь можно сделать запрос к БД для получения названий
      // Но пока оставляем как есть
    }

    const entry = await SmerModel.create({
      user_id: userId,
      entry_date: entry_date ? new Date(entry_date) : undefined,
      situation_place,
      situation_description,
      thoughts,
      reaction_description,
      selected_emotions: selected_emotions || []
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
      
      // Получаем id и проверяем, что это строка
      const idParam = req.params.id;
      
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'ID записи не указан'
        });
      }

      // Проверяем, что строка, а не массив
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

      const updateData = req.body;

      const entry = await SmerModel.update(id, userId, updateData);

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Запись обновлена',
        data: entry
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
      
      // Получаем id и проверяем, что это строка
      const idParam = req.params.id;
      
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'ID записи не указан'
        });
      }

      // Проверяем, что строка, а не массив
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

      const deleted = await SmerModel.delete(id, userId);

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