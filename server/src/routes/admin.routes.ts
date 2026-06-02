import { Router } from 'express';
import { AdminController, bookUpload } from '../controllers/admin.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();
router.use(verifyToken);
router.use(AdminController.checkAdmin);

/**
 * @swagger
 * tags:
 *   name: Администрирование
 *   description: Управление пользователями, психологами и контентом (только для администраторов)
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Получить общую статистику платформы
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика платформы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 152
 *                     totalPsychologists:
 *                       type: integer
 *                       example: 14
 *                     totalDiaryEntries:
 *                       type: integer
 *                       example: 830
 *                     totalTrackerEntries:
 *                       type: integer
 *                       example: 2400
 *       403:
 *         description: Доступ запрещён — требуется роль администратора
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', AdminController.getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
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
 *                     $ref: '#/components/schemas/User'
 */
router.get('/users', AdminController.getUsers);

/**
 * @swagger
 * /admin/users/{userId}/toggle:
 *   put:
 *     summary: Заблокировать / разблокировать пользователя
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статус пользователя изменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/users/:userId/toggle', AdminController.toggleUserActive);

/**
 * @swagger
 * /admin/psychologists:
 *   get:
 *     summary: Получить список всех психологов (включая не верифицированных)
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список психологов
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
 *                     $ref: '#/components/schemas/Psychologist'
 */
router.get('/psychologists', AdminController.getPsychologists);

/**
 * @swagger
 * /admin/psychologists/{psychologistId}/verify:
 *   put:
 *     summary: Верифицировать / снять верификацию психолога
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: psychologistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи психолога
 *     responses:
 *       200:
 *         description: Статус верификации изменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put('/psychologists/:psychologistId/verify', AdminController.verifyPsychologist);

/**
 * @swagger
 * /admin/comics:
 *   get:
 *     summary: Получить список всех комиксов
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список комиксов
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
 *                       title:
 *                         type: string
 *                         example: "Управление тревогой"
 *                       is_active:
 *                         type: boolean
 *                         example: true
 *   post:
 *     summary: Добавить новый комикс
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Управление тревогой"
 *               description:
 *                 type: string
 *                 example: "Комикс о методах снижения тревожности"
 *               pages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Комикс добавлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/comics', AdminController.getComics);
router.post('/comics', bookUpload.single('pdf'), AdminController.createComic);

/**
 * @swagger
 * /admin/comics/{comicId}/toggle:
 *   put:
 *     summary: Скрыть / показать комикс
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Видимость комикса изменена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put('/comics/:comicId/toggle', AdminController.toggleComic);

/**
 * @swagger
 * /admin/comics/{comicId}:
 *   delete:
 *     summary: Удалить комикс
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Комикс удалён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete('/comics/:comicId', AdminController.deleteComic);

/**
 * @swagger
 * /admin/playlists:
 *   get:
 *     summary: Получить список всех плейлистов
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список плейлистов
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
 *                       name:
 *                         type: string
 *                         example: "Спокойствие"
 *                       is_active:
 *                         type: boolean
 *                         example: true
 */
router.get('/playlists', AdminController.getPlaylists);

/**
 * @swagger
 * /admin/playlists/{playlistId}/toggle:
 *   put:
 *     summary: Скрыть / показать плейлист
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Видимость плейлиста изменена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put('/playlists/:playlistId/toggle', AdminController.togglePlaylist);

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Получить список всех администраторов
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список администраторов
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
 *                     $ref: '#/components/schemas/User'
 *   post:
 *     summary: Создать нового администратора
 *     tags: [Администрирование]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Администратор создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/admins', AdminController.getAdmins);
router.post('/admins', AdminController.createAdmin);

export default router;
