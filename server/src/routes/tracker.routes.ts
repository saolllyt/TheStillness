import { Router } from 'express';
import { TrackerController } from '../controllers/tracker.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Трекер эмоций
 *   description: Ежедневное отслеживание эмоционального состояния
 */

/**
 * @swagger
 * /tracker/types:
 *   get:
 *     summary: Получить все доступные типы эмоций
 *     tags: [Трекер эмоций]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список типов эмоций
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
 *                     $ref: '#/components/schemas/EmotionType'
 */
router.get('/types', TrackerController.getEmotionTypes);

/**
 * @swagger
 * /tracker/today:
 *   get:
 *     summary: Получить записи эмоций за сегодня
 *     tags: [Трекер эмоций]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список записей за сегодня
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
 *                     $ref: '#/components/schemas/TrackerEntry'
 */
router.get('/today', TrackerController.getTodayEntries);

/**
 * @swagger
 * /tracker/entries:
 *   post:
 *     summary: Добавить запись об эмоции
 *     tags: [Трекер эмоций]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrackerEntryRequest'
 *     responses:
 *       201:
 *         description: Запись создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TrackerEntry'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/entries', TrackerController.createEntry);

/**
 * @swagger
 * /tracker/entries/{id}:
 *   put:
 *     summary: Обновить запись об эмоции
 *     tags: [Трекер эмоций]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrackerEntryRequest'
 *     responses:
 *       200:
 *         description: Запись обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Запись не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Удалить запись об эмоции
 *     tags: [Трекер эмоций]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи
 *     responses:
 *       200:
 *         description: Запись удалена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Запись не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/entries/:id', TrackerController.updateEntry);
router.delete('/entries/:id', TrackerController.deleteEntry);

export default router;
