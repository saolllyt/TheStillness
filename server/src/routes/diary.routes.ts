import { Router } from 'express';
import { DiaryController } from '../controllers/diary.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Дневник
 *   description: Личные дневниковые записи пользователя
 */

/**
 * @swagger
 * /diary:
 *   get:
 *     summary: Получить все записи дневника текущего пользователя
 *     tags: [Дневник]
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
 *   post:
 *     summary: Создать новую запись в дневнике
 *     tags: [Дневник]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiaryEntryRequest'
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
 *                   $ref: '#/components/schemas/DiaryEntry'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', DiaryController.getEntries);
router.post('/', DiaryController.createEntry);

/**
 * @swagger
 * /diary/{id}:
 *   get:
 *     summary: Получить запись дневника по ID
 *     tags: [Дневник]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи дневника
 *     responses:
 *       200:
 *         description: Запись дневника
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DiaryEntry'
 *       404:
 *         description: Запись не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Обновить запись дневника
 *     tags: [Дневник]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiaryEntryRequest'
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
 *     summary: Удалить запись дневника
 *     tags: [Дневник]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.get('/:id', DiaryController.getEntry);
router.put('/:id', DiaryController.updateEntry);
router.delete('/:id', DiaryController.deleteEntry);

export default router;
