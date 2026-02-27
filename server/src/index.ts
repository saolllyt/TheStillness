import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import diaryRoutes from './routes/diary.routes';
import emotionRoutes from './routes/emotion.routes';
import trackerRoutes from './routes/tracker.routes';
import comicsRoutes from './routes/comics.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET не определен в .env файле!');
  process.exit(1);
}

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/comics', comicsRoutes);

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
    console.error('❌ Failed to connect to database. Exiting...');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 3)}...`);
    console.log(`📅 JWT Expires: ${process.env.JWT_EXPIRES_IN || '7d'}`);
  });
};

startServer();