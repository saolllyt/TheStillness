import { Request, Response } from 'express';
import { ComicModel } from '../models/comic.model';

export class ComicsController {
  // Получение всех комиксов
  static async getAllComics(req: Request, res: Response) {
    try {
      const comics = await ComicModel.getAll();
      
      res.json({
        success: true,
        data: comics
      });
    } catch (error) {
      console.error('Get all comics error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка комиксов'
      });
    }
  }

  // Получение комикса по ID
  static async getComicById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'ID комикса не указан'
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
          message: 'Некорректный ID комикса'
        });
      }

      const comic = await ComicModel.findById(id);
      
      if (!comic) {
        return res.status(404).json({
          success: false,
          message: 'Комикс не найден'
        });
      }

      res.json({
        success: true,
        data: comic
      });
    } catch (error) {
      console.error('Get comic by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении комикса'
      });
    }
  }

  // Получение страниц комикса
  static async getComicPages(req: Request, res: Response) {
    try {
      const comicIdParam = req.params.id;
      
      if (!comicIdParam) {
        return res.status(400).json({
          success: false,
          message: 'ID комикса не указан'
        });
      }

      if (Array.isArray(comicIdParam)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный формат ID'
        });
      }

      const comicId = parseInt(comicIdParam, 10);
      if (isNaN(comicId)) {
        return res.status(400).json({
          success: false,
          message: 'Некорректный ID комикса'
        });
      }

      const pages = await ComicModel.getPages(comicId);
      
      res.json({
        success: true,
        data: pages
      });
    } catch (error) {
      console.error('Get comic pages error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении страниц комикса'
      });
    }
  }
}