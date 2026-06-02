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

app.use(cors({
  origin: '*',
  credentials: true
}));
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

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TheStillness API Docs',
  swaggerOptions: { persistAuthorization: true },
}));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Статические файлы загруженные PDF книги
app.use('/books', express.static(path.join(process.cwd(), 'assets/books')));

// Маршруты
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

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    jwt_configured: !!JWT_SECRET
  });
});

const startServer = async () => {
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.error(' Failed to connect to database. Exiting...');
    process.exit(1);
  }

  // Миграция: старые записи со status='approved' → 'active' (совместимость)
  try {
    const migrated = await pool.query(
      `UPDATE psychologists SET status = 'active', is_verified = true
       WHERE status = 'approved'`
    );
    if ((migrated.rowCount ?? 0) > 0) {
      console.log(` Мигрировано психологов approved→active: ${migrated.rowCount}`);
    }
  } catch (e) {
    console.warn(' Миграция psychologists пропущена:', e);
  }

  // Активируем аккаунты психологов 
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

  // Инициализация плейлистов и книг
  await seedPlaylists();
  await seedComics();

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` JWT Secret: ${JWT_SECRET.substring(0, 3)}...`);
    console.log(` JWT Expires: ${process.env.JWT_EXPIRES_IN || '7d'}`);
  });
};

startServer();