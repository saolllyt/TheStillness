import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { testConnection, pool } from './config/database';
import { seedPlaylists, seedComics } from './config/seed';
import { swaggerSpec } from './config/swagger';
import { sanitizeMiddleware } from './middleware/sanitize';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import diaryRoutes from './routes/diary.routes';
import emotionRoutes from './routes/emotion.routes';
import trackerRoutes from './routes/tracker.routes';
import comicsRoutes from './routes/comics.routes';
import playlistRoutes from './routes/playlist.routes';
import psychologistRoutes from './routes/psychologist.routes';
import adminRoutes from './routes/admin.routes';
import psychologistReportRoutes from './routes/psychologist_report.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(' JWT_SECRET не определен в .env файле!');
  process.exit(1);
}

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMiddleware);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Слишком много попыток. Попробуйте через 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TheStillness API Docs',
  swaggerOptions: { persistAuthorization: true },
}));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/books', express.static(path.join(process.cwd(), 'assets/books')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/comics', comicsRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/psychologist', psychologistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/psychologist-reports', psychologistReportRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running', jwt_configured: !!JWT_SECRET });
});

const initSchema = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'psychologist', 'admin')),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS psychologists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      specialization VARCHAR(255),
      license_number VARCHAR(100),
      status VARCHAR(20) DEFAULT 'pending',
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS psychologist_patients (
      id SERIAL PRIMARY KEY,
      psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
      patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(psychologist_id, patient_id)
    )`,
    `CREATE TABLE IF NOT EXISTS emotion_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      color VARCHAR(20),
      emoji VARCHAR(10)
    )`,
    `CREATE TABLE IF NOT EXISTS emotion_tracker (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      emotion_type_id INTEGER REFERENCES emotion_types(id),
      intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
      created_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, emotion_type_id, created_date)
    )`,
    `CREATE TABLE IF NOT EXISTS smer_diary (
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
    )`,
    `CREATE TABLE IF NOT EXISTS comics (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      description TEXT,
      cover_image_url VARCHAR(500),
      pdf_url VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS playlists (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      cover_image_url VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS tracks (
      id SERIAL PRIMARY KEY,
      playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      artist VARCHAR(255),
      duration_seconds INTEGER,
      audio_url TEXT NOT NULL,
      download_url TEXT,
      source VARCHAR(50) DEFAULT 'jamendo',
      external_id VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS downloaded_tracks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
      local_path TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, track_id)
    )`,
    `CREATE TABLE IF NOT EXISTS playlist_favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, playlist_id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS psychologist_reports (
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
    )`,
    `CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      report_type VARCHAR(50) DEFAULT 'monitoring',
      start_date DATE,
      end_date DATE,
      report_content JSONB,
      psychologist_email VARCHAR(255),
      sent_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS password_reset_codes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `INSERT INTO emotion_types (name, color, emoji) VALUES
      ('Радость', '#FFD700', '😊'),
      ('Грусть', '#6495ED', '😢'),
      ('Тревога', '#FF8C00', '😰'),
      ('Злость', '#DC143C', '😠'),
      ('Страх', '#8B008B', '😨'),
      ('Спокойствие', '#90EE90', '😌'),
      ('Удивление', '#FF69B4', '😲'),
      ('Отвращение', '#556B2F', '🤢')
    ON CONFLICT DO NOTHING`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_psych_patient_unique
     ON psychologist_patients(psychologist_id, patient_id)`,
    `INSERT INTO psychologists (user_id, specialization, license_number, status, is_verified)
     SELECT id, 'Не указана', 'Не указан', 'pending', false
     FROM users
     WHERE role = 'psychologist'
       AND id NOT IN (SELECT user_id FROM psychologists WHERE user_id IS NOT NULL)
    ON CONFLICT DO NOTHING`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token VARCHAR(500)`,
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (e: any) {
      console.warn(' Migration skipped:', e.message?.slice(0, 80));
    }
  }

  console.log(' Схема базы данных инициализирована');
};

const startServer = async () => {
  const isConnected = await testConnection();

  if (!isConnected) {
    console.error(' Failed to connect to database. Exiting...');
    process.exit(1);
  }

  await initSchema();

  try {
    const migrated = await pool.query(
      `UPDATE psychologists SET status = 'active', is_verified = true WHERE status = 'approved'`
    );
    if ((migrated.rowCount ?? 0) > 0) {
      console.log(` Мигрировано психологов approved→active: ${migrated.rowCount}`);
    }
  } catch (e) {
    console.warn(' Миграция psychologists пропущена:', e);
  }

  try {
    const activated = await pool.query(
      `UPDATE users SET is_active = true WHERE role = 'psychologist' AND is_active = false`
    );
    if ((activated.rowCount ?? 0) > 0) {
      console.log(` Активировано аккаунтов психологов: ${activated.rowCount}`);
    }
  } catch (e) {
    console.warn(' Активация психологов пропущена:', e);
  }

  try {
    await pool.query(`ALTER TABLE comics ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(255)`);
    await pool.query(`ALTER TABLE comics ALTER COLUMN cover_image_url DROP NOT NULL`);
  } catch (e) {
    console.warn(' Миграция comics пропущена:', e);
  }

  await seedPlaylists();
  await seedComics();

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` JWT Secret: ${JWT_SECRET!.substring(0, 3)}...`);
    console.log(` JWT Expires: ${process.env.JWT_EXPIRES_IN || '7d'}`);
  });
};

startServer();
