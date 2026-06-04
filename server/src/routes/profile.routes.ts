import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { verifyToken } from '../middleware/auth';
import { ReportModel } from '../models/report.model';

const router = Router();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Профиль
 *   description: Управление профилем пользователя, аналитика и отчёты
 */

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Получить профиль текущего пользователя
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные профиля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *   put:
 *     summary: Обновить имя и фамилию пользователя
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Профиль обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/me', ProfileController.getProfile);
router.put('/me', ProfileController.updateProfile);

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Изменить пароль авторизованного пользователя
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Пароль изменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Неверный текущий пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/password', ProfileController.changePassword);

/**
 * @swagger
 * /profile/emotions/week:
 *   get:
 *     summary: Получить статистику эмоций за последние 7 дней
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Эмоции за неделю, сгруппированные по дням
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WeekEmotion'
 */
router.get('/emotions/week', ProfileController.getWeekEmotions);

/**
 * @swagger
 * /profile/diary:
 *   get:
 *     summary: Получить записи дневника для профиля (сокращённый формат)
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список записей дневника
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DiaryEntry'
 */
router.get('/diary', ProfileController.getDiaryEntries);

/**
 * @swagger
 * /profile/report:
 *   post:
 *     summary: Сгенерировать PDF-отчёт об эмоциональном состоянии
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Отчёт сформирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/report', ProfileController.generateReport);

/**
 * @swagger
 * /profile/report/send:
 *   post:
 *     summary: Отправить отчёт психологу
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Отчёт отправлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/report/send', ProfileController.sendReport);

/**
 * @swagger
 * /profile/report/list:
 *   get:
 *     summary: Получить список всех отчётов пользователя
 *     tags: [Профиль]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список отчётов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */
router.get('/report/list', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const reports = await ReportModel.findByUserId(userId);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка' });
  }
});

router.post('/push-debug', async (req, res) => {
  const userId = (req as any).userId;
  console.error(` Push-debug userId=${userId}: шаг="${req.body.step}" ошибка="${req.body.error}"`);
  res.json({ success: true });
});

router.post('/push-token', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { pushToken } = req.body;
    console.log(` Push-token запрос: userId=${userId}, token=${pushToken ? pushToken.slice(0, 30) + '...' : 'ПУСТО'}`);
    if (!pushToken) return res.status(400).json({ success: false, message: 'pushToken не указан' });
    const { pool } = await import('../config/database');
    await pool.query('UPDATE users SET push_token = $1 WHERE id = $2', [pushToken, userId]);
    console.log(` Push-токен сохранён для userId=${userId}`);
    res.json({ success: true });
  } catch (error: any) {
    console.error(` Push-token ошибка:`, error?.message);
    res.status(500).json({ success: false, message: 'Ошибка' });
  }
});

export default router;
