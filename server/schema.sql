-- TheStillness Database Schema
-- Run this in Railway PostgreSQL Console to initialize all tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'psychologist', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Psychologists table
CREATE TABLE IF NOT EXISTS psychologists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Psychologist-patient relationships
CREATE TABLE IF NOT EXISTS psychologist_patients (
  id SERIAL PRIMARY KEY,
  psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
  patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(psychologist_id, patient_id)
);

-- Emotion types
CREATE TABLE IF NOT EXISTS emotion_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  emoji VARCHAR(10)
);

-- Emotion tracker
CREATE TABLE IF NOT EXISTS emotion_tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  emotion_type_id INTEGER REFERENCES emotion_types(id),
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
  created_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, emotion_type_id, created_date)
);

-- SMER diary
CREATE TABLE IF NOT EXISTS smer_diary (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE DEFAULT CURRENT_DATE,
  situation_place VARCHAR(255),
  situation_description TEXT NOT NULL,
  thoughts TEXT NOT NULL,
  reaction_description TEXT NOT NULL,
  selected_emotions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comics / books
CREATE TABLE IF NOT EXISTS comics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  description TEXT,
  cover_image_url VARCHAR(500),
  pdf_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Playlists
CREATE TABLE IF NOT EXISTS playlists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  duration_seconds INTEGER,
  audio_url TEXT NOT NULL,
  download_url TEXT,
  source VARCHAR(50) DEFAULT 'jamendo',
  external_id VARCHAR(100)
);

-- Downloaded tracks
CREATE TABLE IF NOT EXISTS downloaded_tracks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
  local_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Playlist favorites
CREATE TABLE IF NOT EXISTS playlist_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, playlist_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Psychologist reports
CREATE TABLE IF NOT EXISTS psychologist_reports (
  id SERIAL PRIMARY KEY,
  psychologist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  complaints TEXT,
  anamnesis TEXT,
  examinations TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed emotion types
INSERT INTO emotion_types (name, color, emoji) VALUES
  ('Радость', '#FFD700', '😊'),
  ('Грусть', '#6495ED', '😢'),
  ('Тревога', '#FF8C00', '😰'),
  ('Злость', '#DC143C', '😠'),
  ('Страх', '#8B008B', '😨'),
  ('Спокойствие', '#90EE90', '😌'),
  ('Удивление', '#FF69B4', '😲'),
  ('Отвращение', '#556B2F', '🤢')
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
  'admin@thestillness.app',
  '$2b$10$rOzJqQZJQ8Z1Q8Z1Q8Z1QOzJqQZJQ8Z1Q8Z1Q8Z1QOzJqQZJQ8Z1Q',
  'Admin',
  'TheStillness',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;
