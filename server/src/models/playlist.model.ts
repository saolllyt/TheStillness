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
  static async getAll(): Promise<Playlist[]> {
    const query = `SELECT * FROM playlists WHERE is_active = true ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Playlist | null> {
    const query = `SELECT * FROM playlists WHERE id = $1 AND is_active = true`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getTracks(playlist_id: number): Promise<Track[]> {
    const query = `SELECT * FROM tracks WHERE playlist_id = $1 ORDER BY id`;
    const result = await pool.query(query, [playlist_id]);
    return result.rows;
  }

  static async getPlaylistWithTracks(id: number): Promise<Playlist & { tracks: Track[] } | null> {
    const playlist = await this.findById(id);
    if (!playlist) return null;
    const tracks = await this.getTracks(id);
    return { ...playlist, tracks };
  }

  static async saveDownloadedTrack(user_id: number, track_id: number, local_path: string): Promise<any> {
    const query = `
      INSERT INTO downloaded_tracks (user_id, track_id, local_path)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, track_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, track_id, local_path]);
    return result.rows[0] || null;
  }

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

  static async addToFavoriteTracks(user_id: number, track_id: number): Promise<any> {
    const query = `
      INSERT INTO favorite_tracks (user_id, track_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, track_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, track_id]);
    return result.rows[0];
  }

  static async removeFromFavoriteTracks(user_id: number, track_id: number): Promise<void> {
    const query = `DELETE FROM favorite_tracks WHERE user_id = $1 AND track_id = $2`;
    await pool.query(query, [user_id, track_id]);
  }

  static async getFavoriteTracks(user_id: number): Promise<any[]> {
    const query = `
      SELECT t.*, ft.created_at as favorited_at
      FROM favorite_tracks ft
      JOIN tracks t ON ft.track_id = t.id
      WHERE ft.user_id = $1
      ORDER BY ft.created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async addToFavoritePlaylists(user_id: number, playlist_id: number): Promise<any> {
    const query = `
      INSERT INTO favorite_playlists (user_id, playlist_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, playlist_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, playlist_id]);
    return result.rows[0];
  }

  // Найти или создать джамендо трек в таблице tracks
  static async findOrCreateJamendoTrack(
    playlist_id: number,
    jamendo_id: string,
    title: string,
    artist: string | null,
    duration_seconds: number | null,
    audio_url: string,
    image_url?: string | null,
  ): Promise<number> {
    const external_id = `jamendo_${jamendo_id}`;

    const existing = await pool.query(
      'SELECT id FROM tracks WHERE external_id = $1',
      [external_id],
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE tracks SET audio_url = $1, image_url = COALESCE($2, image_url) WHERE id = $3',
        [audio_url, image_url || null, existing.rows[0].id],
      );
      return existing.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO tracks (playlist_id, title, artist, duration_seconds, audio_url, download_url, source, external_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $5, 'jamendo', $6, $7)
       RETURNING id`,
      [playlist_id, title, artist, duration_seconds, audio_url, external_id, image_url || null],
    );
    return result.rows[0].id;
  }

  static async getFavoritePlaylists(user_id: number): Promise<any[]> {
    const query = `
      SELECT p.*, fp.created_at as favorited_at
      FROM favorite_playlists fp
      JOIN playlists p ON fp.playlist_id = p.id
      WHERE fp.user_id = $1
      ORDER BY fp.created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }
}