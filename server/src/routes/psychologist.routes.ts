import { Router } from 'express';
import { PsychologistController } from '../controllers/psychologist.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Психологи
 *   description: Взаимодействие пользователей с психологами и чат
 */

/**
 * @swagger
 * /psychologist/list:
 *   get:
 *     summary: Получить список всех верифицированных психологов
 *     tags: [Психологи]
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
// Профиль текущего психолога (статус верификации)
router.get('/profile/me', PsychologistController.getMyProfile);

router.get('/list', PsychologistController.getAll);

/**
 * @swagger
 * /psychologist/request:
 *   post:
 *     summary: Отправить запрос на подключение к психологу
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [psychologistUserId]
 *             properties:
 *               psychologistUserId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Запрос отправлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Запрос уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/request', PsychologistController.sendRequest);
router.delete('/request/:psychologistUserId', PsychologistController.cancelRequest);
router.delete('/patients/:patientId', PsychologistController.removePatient);

/**
 * @swagger
 * /psychologist/my:
 *   get:
 *     summary: Получить психологов, к которым пользователь отправил запросы
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список психологов со статусами связи
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/Psychologist'
 *                       - type: object
 *                         properties:
 *                           status:
 *                             $ref: '#/components/schemas/ConnectionStatus'
 */
router.get('/my', PsychologistController.getMyPsychologists);

/**
 * @swagger
 * /psychologist/patients:
 *   get:
 *     summary: Получить список пациентов (только для психологов)
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пациентов с их статусами
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/User'
 *                       - type: object
 *                         properties:
 *                           status:
 *                             $ref: '#/components/schemas/ConnectionStatus'
 */
router.get('/patients', PsychologistController.getMyPatients);

/**
 * @swagger
 * /psychologist/patients/status:
 *   put:
 *     summary: Принять или отклонить запрос пациента (только для психологов)
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, status]
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [active, rejected]
 *                 example: active
 *     responses:
 *       200:
 *         description: Статус обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put('/patients/status', PsychologistController.updateRequestStatus);

/**
 * @swagger
 * /psychologist/dialogs:
 *   get:
 *     summary: Получить список диалогов текущего пользователя
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список диалогов с последними сообщениями
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
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Message'
 *                       unreadCount:
 *                         type: integer
 *                         example: 3
 */
router.get('/dialogs', PsychologistController.getDialogs);

/**
 * @swagger
 * /psychologist/conversation/{userId}:
 *   get:
 *     summary: Получить историю переписки с пользователем
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID собеседника
 *     responses:
 *       200:
 *         description: Список сообщений диалога
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
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/conversation/:userId', PsychologistController.getConversation);

/**
 * @swagger
 * /psychologist/messages:
 *   post:
 *     summary: Отправить сообщение в чат
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       201:
 *         description: Сообщение отправлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 */
router.post('/messages', PsychologistController.sendMessage);

/**
 * @swagger
 * /psychologist/messages/report:
 *   post:
 *     summary: Отправить отчёт в виде сообщения (психолог → пациент)
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiverId, reportId]
 *             properties:
 *               receiverId:
 *                 type: integer
 *                 example: 5
 *               reportId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Отчёт отправлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/messages/report', PsychologistController.sendReport);

/**
 * @swagger
 * /psychologist/unread:
 *   get:
 *     summary: Получить количество непрочитанных сообщений
 *     tags: [Психологи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Количество непрочитанных сообщений
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 */
router.get('/unread', PsychologistController.getUnreadCount);

export default router;
