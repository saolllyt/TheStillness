import { Request, Response } from 'express';
import { PlaylistModel } from '../models/playlist.model';
import { fetchJamendoTracks } from '../services/jamendo.service';

export class PlaylistController {
  // Получение всех плейлистов
  static async getAllPlaylists(req: Request, res: Response) {
    try {
      const playlists = await PlaylistModel.getAll();
      res.json({ success: true, data: playlists });
    } catch (error) {
      console.error('Get all playlists error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении плейлистов' });
    }
  }

  // Получение плейлиста по ID
  static async getPlaylistById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      
      if (!idParam) {
        return res.status(400).json({ success: false, message: 'ID плейлиста не указан' });
      }
      
      if (Array.isArray(idParam)) {
        return res.status(400).json({ success: false, message: 'Некорректный формат ID' });
      }
      
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Некорректный ID' });
      }
      
      const playlist = await PlaylistModel.findById(id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Плейлист не найден' });
      }
      
      res.json({ success: true, data: playlist });
    } catch (error) {
      console.error('Get playlist error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении плейлиста' });
    }
  }

  // Получение треков плейлиста
  static async getTracksByPlaylist(req: Request, res: Response) {
    try {
      const playlistIdParam = req.params.id;
      
      if (!playlistIdParam) {
        return res.status(400).json({ success: false, message: 'ID плейлиста не указан' });
      }
      
      if (Array.isArray(playlistIdParam)) {
        return res.status(400).json({ success: false, message: 'Некорректный формат ID' });
      }
      
      const playlistId = parseInt(playlistIdParam, 10);
      if (isNaN(playlistId)) {
        return res.status(400).json({ success: false, message: 'Некорректный ID' });
      }
      
      const tracks = await PlaylistModel.getTracks(playlistId);
      res.json({ success: true, data: tracks });
    } catch (error) {
      console.error('Get tracks error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении треков' });
    }
  }

  static async saveDownloadedTrack(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { trackId, localPath } = req.body;
      
      if (!trackId) {
        return res.status(400).json({ success: false, message: 'ID трека не указан' });
      }
      
      const result = await PlaylistModel.saveDownloadedTrack(userId, trackId, localPath);
      res.json({ success: true, message: 'Трек сохранен', data: result });
    } catch (error) {
      console.error('Save downloaded track error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при сохранении трека' });
    }
  }

  static async getMyDownloads(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const downloads = await PlaylistModel.getDownloadedTracks(userId);
      res.json({ success: true, data: downloads });
    } catch (error) {
      console.error('Get downloads error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении скачанных треков' });
    }
  }

  // Добавление в избранное
  static async addToFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { trackId, playlistId } = req.body;
      let result;
      
      if (trackId) {
        result = await PlaylistModel.addToFavoriteTracks(userId, trackId);
      } else if (playlistId) {
        result = await PlaylistModel.addToFavoritePlaylists(userId, playlistId);
      } else {
        return res.status(400).json({ success: false, message: 'Не указан ID' });
      }
      
      res.json({ success: true, message: 'Добавлено в избранное', data: result });
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при добавлении в избранное' });
    }
  }

  // Удаление из избранного
  static async removeFromFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const trackIdParam = req.params.trackId;
      
      if (!trackIdParam) {
        return res.status(400).json({ success: false, message: 'ID трека не указан' });
      }
      
      if (Array.isArray(trackIdParam)) {
        return res.status(400).json({ success: false, message: 'Некорректный формат ID' });
      }
      
      const trackId = parseInt(trackIdParam, 10);
      if (isNaN(trackId)) {
        return res.status(400).json({ success: false, message: 'Некорректный ID трека' });
      }
      
      await PlaylistModel.removeFromFavoriteTracks(userId, trackId);
      res.json({ success: true, message: 'Удалено из избранного' });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при удалении из избранного' });
    }
  }

  // Получение треков через Jamendo API 
  static async getJamendoTracks(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ success: false, message: 'Некорректный ID' });
      }
      const playlistId = parseInt(idParam, 10);
      if (isNaN(playlistId)) {
        return res.status(400).json({ success: false, message: 'Некорректный ID' });
      }

      const playlist = await PlaylistModel.findById(playlistId);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Плейлист не найден' });
      }

      const tracks = await fetchJamendoTracks(playlist.title);
      res.json({ success: true, data: tracks });
    } catch (error) {
      console.error('Get Jamendo tracks error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении треков' });
    }
  }

  // Добавление Jamendo-трека в избранное
  static async addJamendoFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { jamendoId, title, artist, durationSeconds, audioUrl, playlistId } = req.body;

      if (!jamendoId || !audioUrl || !playlistId) {
        return res.status(400).json({ success: false, message: 'Не хватает данных трека' });
      }

      const trackId = await PlaylistModel.findOrCreateJamendoTrack(
        parseInt(playlistId, 10),
        String(jamendoId),
        title || 'Неизвестный трек',
        artist || null,
        durationSeconds ? Number(durationSeconds) : null,
        audioUrl,
      );

      await PlaylistModel.addToFavoriteTracks(userId, trackId);
      res.json({ success: true, data: { id: trackId } });
    } catch (error) {
      console.error('Add Jamendo favorite error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при добавлении в избранное' });
    }
  }

  // Получение избранных треков
  static async getMyFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const favorites = await PlaylistModel.getFavoriteTracks(userId);
      res.json({ success: true, data: favorites });
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении избранного' });
    }
  }
}