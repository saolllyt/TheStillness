import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { EmotionModel } from '../models/emotion.model';
import { SmerModel } from '../models/smer.model';
import { ReportModel } from '../models/report.model';

export class ProfileController {
  // Получение профиля пользователя
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const user = await UserModel.findById(userId);
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка при получении профиля' 
      });
    }
  }

  // Обновление профиля
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { firstName, lastName } = req.body;

      const updatedUser = await UserModel.update(userId, { firstName, lastName });

      res.json({
        success: true,
        message: 'Профиль обновлен',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка при обновлении профиля' 
      });
    }
  }

  // Получение эмоций за неделю для диаграммы
  static async getWeekEmotions(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      console.log('=================================');
      console.log(`📊 ЗАПРОС ЭМОЦИЙ ДЛЯ ПОЛЬЗОВАТЕЛЯ ${userId}`);
      console.log(`📅 Период: с ${startDateStr} по ${endDateStr}`);
      console.log('=================================');

      const emotions = await EmotionModel.getEntriesByDateRange(
        userId, 
        startDateStr,
        endDateStr
      );

      console.log(`📊 Найдено ${emotions.length} записей:`);
      
      // Создаем массив дат
      const dates: string[] = [];
      const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        dates.push(date.toISOString().split('T')[0]);
      }

      console.log('📅 Даты для анализа:', dates);

      // Списки хороших и плохих эмоций 
      const GOOD_EMOTIONS = [1, 3, 9, 10]; 
      const BAD_EMOTIONS = [3, 4, 5, 6, 7];   

      const values: number[] = [];

      for (let i = 0; i < dates.length; i++) {
        const currentDate = dates[i];
        
        const dayEmotions = emotions.filter(e => {
          const emotionDate = new Date(e.created_date);
          const emotionDateStr = emotionDate.toISOString().split('T')[0];
          return emotionDateStr === currentDate;
        });

        if (dayEmotions.length > 0) {
          let goodCount = 0;
          let badCount = 0;
          
          dayEmotions.forEach((e: any) => {
            if (GOOD_EMOTIONS.includes(e.emotion_type_id)) {
              goodCount++;
            } else if (BAD_EMOTIONS.includes(e.emotion_type_id)) {
              badCount++;
            }
          });

          const total = goodCount + badCount;
          const ratio = total > 0 ? Math.round((goodCount / total) * 100) : 0;
          
          values.push(ratio);
          
          console.log(`   📍 ${dayNames[i]} (${currentDate}):`);
          console.log(`      - Хороших эмоций: ${goodCount}`);
          console.log(`      - Плохих эмоций: ${badCount}`);
          console.log(`      - Соотношение: ${ratio}% хороших`);
        } else {
          values.push(0);
          console.log(`   📍 ${dayNames[i]} (${currentDate}): нет данных`);
        }
      }

      console.log('📊 Результат для диаграммы (% хороших эмоций):', values);
      console.log('=================================');

      res.json({
        success: true,
        data: {
          labels: dayNames,
          values
        }
      });
    } catch (error) {
      console.error('❌ Get week emotions error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка при получении эмоций' 
      });
    }
  }

  static async getDiaryEntries(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const entries = await SmerModel.findByUserId(userId, limit, offset);
      const total = await SmerModel.countByUserId(userId);

      res.json({
        success: true,
        data: entries,
        total,
        limit,
        offset
      });
    } catch (error) {
      console.error('Get diary entries error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка при получении записей дневника' 
      });
    }
  }

  // Генерация отчета
static async generateReport(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate, type = 'all' } = req.body;

    console.log('📊 Генерация отчета:', { userId, startDate, endDate, type });

    // Получаем данные пользователя
    const user = await UserModel.findById(userId);
    
    // Получаем эмоции за период
    const emotions = await EmotionModel.getEntriesByDateRange(userId, startDate, endDate);
    
    // Получаем записи дневника за период
    const diary = await SmerModel.findByDateRange(userId, startDate, endDate);

    // Списки хороших и плохих эмоций
    const GOOD_EMOTIONS = [1, 3, 9, 10];
    
    // Подсчет статистики
    let goodEmotions = 0;
    let badEmotions = 0;
    let totalIntensity = 0;

    emotions.forEach((e: any) => {
      totalIntensity += e.intensity;
      if (GOOD_EMOTIONS.includes(e.emotion_type_id)) {
        goodEmotions++;
      } else {
        badEmotions++;
      }
    });

    const reportData = {
      startDate,
      endDate,
      user: {
        name: user?.first_name && user?.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user?.email
      },
      emotions: type === 'all' || type === 'emotions' ? emotions : [],
      diary: type === 'all' || type === 'diary' ? diary : [],
      summary: {
        totalEmotions: emotions.length,
        averageIntensity: emotions.length > 0 ? totalIntensity / emotions.length : 0,
        totalDiary: diary.length,
        goodEmotions,
        badEmotions
      }
    };

    const report = await ReportModel.create({
      user_id: userId,
      report_type: type,
      start_date: startDate,
      end_date: endDate,
      report_content: reportData
    });

    console.log('✅ Отчет создан с ID:', report.id);

    res.json({
      success: true,
      message: 'Отчет сгенерирован',
      reportId: report.id,
      data: reportData
    });
  } catch (error) {
    console.error('❌ Generate report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при генерации отчета' 
    });
  }
}

  // Отправка отчета на email
  static async sendReport(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { reportId, email } = req.body;

      const report = await ReportModel.findById(reportId, userId);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Отчет не найден'
        });
      }

      await ReportModel.markAsSent(reportId, userId);

      res.json({
        success: true,
        message: 'Отчет отправлен на email'
      });
    } catch (error) {
      console.error('Send report error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Ошибка при отправке отчета' 
      });
    }
  }
}