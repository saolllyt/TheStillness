// глобальные типы для всего приложения

// Типы для пользователя
export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  is_active: boolean;
}

// Типы для авторизации
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Типы для эмоций
export interface EmotionType {
  id: number;
  name: string;
  color: string | null;
  emoji: string | null;
}

export interface EmotionEntry {
  id: number;
  user_id: number;
  emotion_type_id: number;
  intensity: number; 
  note: string | null;
  created_date: string;
  emotion?: EmotionType; 
}

// Типы для дневника СМЭР
export interface SmerDiaryEntry {
  id: number;
  user_id: number;
  entry_date: string;
  situation_place: string | null;
  situation_description: string;
  thoughts: string;
  reaction_description: string;
  selected_emotions: {
    emotionId: number;
    emotionName?: string;
    intensity?: number;
  }[];
  created_at: string;
  updated_at: string;
}

// Типы для комиксов
export interface Comic {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string;
  author: string | null;
  is_active: boolean;
}

export interface ComicPage {
  id: number;
  comic_id: number;
  page_number: number;
  image_url: string;
  text_content: string | null;
}

// Типы для музыки
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

export interface Playlist {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  tracks?: Track[];
}

// Типы для отчетов
export interface Report {
  id: number;
  user_id: number;
  report_type: string;
  start_date: string;
  end_date: string;
  psychologist_email: string | null;
  sent_at: string | null;
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}