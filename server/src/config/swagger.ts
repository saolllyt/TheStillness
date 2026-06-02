import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TheStillness API',
      version: '1.0.0',
      description:
        'REST API серверной части мобильного приложения TheStillness — платформы для поддержки ментального здоровья. ' +
        'Документация описывает все доступные конечные точки, модели данных и схемы авторизации.',
      contact: {
        name: 'TheStillness Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Локальный сервер разработки',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT-токен, полученный при входе или регистрации',
        },
      },
      schemas: {
        // ─── Общие ────────────────────────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Операция выполнена успешно' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Описание ошибки' },
          },
        },
        // ─── Пользователь ─────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            first_name: { type: 'string', nullable: true, example: 'Анна' },
            last_name: { type: 'string', nullable: true, example: 'Иванова' },
            role: { type: 'string', enum: ['user', 'psychologist', 'admin'], example: 'user' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Аутентификация ────────────────────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            firstName: { type: 'string', example: 'Анна' },
            lastName: { type: 'string', example: 'Иванова' },
          },
        },
        RegisterPsychologistRequest: {
          type: 'object',
          required: ['email', 'password', 'specialization', 'licenseNumber'],
          properties: {
            email: { type: 'string', format: 'email', example: 'psych@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            firstName: { type: 'string', example: 'Мария' },
            lastName: { type: 'string', example: 'Петрова' },
            specialization: { type: 'string', example: 'Когнитивно-поведенческая терапия' },
            licenseNumber: { type: 'string', example: 'PSY-2024-001' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Вход выполнен успешно' },
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'code', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            code: { type: 'string', example: '482910' },
            newPassword: { type: 'string', minLength: 6, example: 'newpassword123' },
          },
        },
        // ─── Трекер эмоций ────────────────────────────────────────────────────
        EmotionType: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Радость' },
            emoji: { type: 'string', nullable: true, example: '😊' },
            color: { type: 'string', nullable: true, example: '#FFD700' },
          },
        },
        TrackerEntry: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            user_id: { type: 'integer', example: 1 },
            emotion_type_id: { type: 'integer', example: 2 },
            intensity: { type: 'integer', minimum: 1, maximum: 10, example: 7 },
            note: { type: 'string', nullable: true, example: 'Хороший день' },
            recorded_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateTrackerEntryRequest: {
          type: 'object',
          required: ['emotion_type_id', 'intensity'],
          properties: {
            emotion_type_id: { type: 'integer', example: 2 },
            intensity: { type: 'integer', minimum: 1, maximum: 10, example: 7 },
            note: { type: 'string', nullable: true, example: 'Хороший день' },
          },
        },
        // ─── Дневник ──────────────────────────────────────────────────────────
        DiaryEntry: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 3 },
            user_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Мой день' },
            content: { type: 'string', example: 'Сегодня был продуктивный день...' },
            mood: { type: 'string', nullable: true, example: 'happy' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateDiaryEntryRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', example: 'Мой день' },
            content: { type: 'string', example: 'Сегодня был продуктивный день...' },
            mood: { type: 'string', nullable: true, example: 'happy' },
          },
        },
        // ─── Психолог ─────────────────────────────────────────────────────────
        Psychologist: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            email: { type: 'string', format: 'email', example: 'psych@example.com' },
            first_name: { type: 'string', nullable: true, example: 'Мария' },
            last_name: { type: 'string', nullable: true, example: 'Петрова' },
            specialization: { type: 'string', example: 'Когнитивно-поведенческая терапия' },
            license_number: { type: 'string', example: 'PSY-2024-001' },
            is_verified: { type: 'boolean', example: true },
          },
        },
        ConnectionStatus: {
          type: 'string',
          enum: ['pending', 'active', 'rejected'],
          example: 'active',
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            sender_id: { type: 'integer', example: 1 },
            receiver_id: { type: 'integer', example: 2 },
            content: { type: 'string', example: 'Добрый день!' },
            is_read: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        SendMessageRequest: {
          type: 'object',
          required: ['receiverId', 'content'],
          properties: {
            receiverId: { type: 'integer', example: 2 },
            content: { type: 'string', example: 'Добрый день!' },
          },
        },
        // ─── Профиль ──────────────────────────────────────────────────────────
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'Анна' },
            lastName: { type: 'string', example: 'Иванова' },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'oldpassword123' },
            newPassword: { type: 'string', minLength: 6, example: 'newpassword123' },
          },
        },
        WeekEmotion: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2024-05-20' },
            emotions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Радость' },
                  emoji: { type: 'string', example: '😊' },
                  color: { type: 'string', example: '#FFD700' },
                  intensity: { type: 'integer', example: 7 },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
