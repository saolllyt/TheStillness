import { pool } from '../config/database';

export interface Playlist {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface Track {
  id: number;
  playlist_id: number;
  title: string;
  artist: string | null;
  duration_seconds: number | null;
  audio_url: string;
  download_url: string | null;
  source: string;
  external_id: string;
}

export class PlaylistModel {
  // Получение всех плейлистов
  static async getAll(): Promise<Playlist[]> {
    const query = `
      SELECT * FROM playlists 
      WHERE is_active = true 
      ORDER BY id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Получение плейлиста по ID
  static async findById(id: number): Promise<Playlist | null> {
    const query = 'SELECT * FROM playlists WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Получение треков плейлиста
  static async getTracks(playlist_id: number): Promise<Track[]> {
    const query = `
      SELECT * FROM tracks 
      WHERE playlist_id = $1 
      ORDER BY id
    `;
    const result = await pool.query(query, [playlist_id]);
    return result.rows;
  }

  // Получение плейлиста с треками
  static async findWithTracks(id: number): Promise<Playlist & { tracks: Track[] } | null> {
    const playlist = await this.findById(id);
    if (!playlist) return null;

    const tracks = await this.getTracks(id);
    return { ...playlist, tracks };
  }
  

  // Сохранение скачанного трека
  static async saveDownloadedTrack(
    user_id: number,
    track_id: number,
    local_path: string
  ): Promise<any> {
    const query = `
      INSERT INTO downloaded_tracks (user_id, track_id, local_path)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, track_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, track_id, local_path]);
    return result.rows[0] || null;
  }

  // Получение скачанных треков пользователя
  static async getDownloadedTracks(user_id: number): Promise<any[]> {
    const query = `
      SELECT t.*, dt.local_path, dt.downloaded_at
      FROM downloaded_tracks dt
      JOIN tracks t ON dt.track_id = t.id
      WHERE dt.user_id = $1
      ORDER BY dt.downloaded_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  
}