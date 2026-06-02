import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { EmotionModel } from '../models/emotion.model';
import { SmerModel } from '../models/smer.model';
import { ReportModel } from '../models/report.model';

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await UserModel.findById(userId);
      res.json({ success: true, user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении профиля' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { firstName, lastName } = req.body;
      const updatedUser = await UserModel.update(userId, { firstName, lastName });
      res.json({ success: true, message: 'Профиль обновлен', user: updatedUser });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при обновлении профиля' });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Введите текущий и новый пароль'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Новый пароль должен быть не менее 6 символов'
        });
      }

      const user = await UserModel.findByEmailWithPassword(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }

      const isValid = await UserModel.verifyPassword(currentPassword, user.password_hash);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Неверный текущий пароль'
        });
      }

      await UserModel.updatePassword(userId, newPassword);

      res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Ошибка при изменении пароля' });
    }
  }

  static async getWeekEmotions(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const DAY_NAMES_RU: { [key: number]: string } = {
        0: 'Вс', 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб'
      };

      const GOOD_EMOTIONS = [1, 3, 9, 10];

      const labels: string[] = [];
      const dates: string[] = [];
      const values: number[] = [];
      const goodCounts: number[] = [];
      const badCounts: number[] = [];

      const today = new Date();

      const currentDay = today.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

      const monday = new Date(today);
      monday.setDate(today.getDate() - daysFromMonday);
      monday.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        dates.push(dateStr);
        labels.push(DAY_NAMES_RU[date.getDay()]);
      }

      const startDateStr = dates[0];
      const endDateStr = dates[6];

      const todayYear = today.getFullYear();
      const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
      const todayDay = String(today.getDate()).padStart(2, '0');
      const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
      const todayIndex = dates.indexOf(todayStr);

      const emotions = await EmotionModel.getEntriesByDateRange(
        userId,
        startDateStr,
        endDateStr
      );

      for (let i = 0; i < 7; i++) {
        const currentDate = dates[i];
        const isFuture = currentDate > todayStr;

        if (isFuture) {
          values.push(0);
          goodCounts.push(0);
          badCounts.push(0);
          continue;
        }

        const dayEmotions = emotions.filter((e: any) => {
          let emotionDateStr: string;

          if (e.created_date instanceof Date) {
            const d = e.created_date;
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            emotionDateStr = `${y}-${m}-${day}`;
          } else if (typeof e.created_date === 'string') {
            emotionDateStr = e.created_date.substring(0, 10);
          } else {
            emotionDateStr = String(e.created_date).substring(0, 10);
          }

          return emotionDateStr === currentDate;
        });

        if (dayEmotions.length > 0) {
          let good = 0;
          let bad = 0;

          dayEmotions.forEach((e: any) => {
            if (GOOD_EMOTIONS.includes(Number(e.emotion_type_id))) {
              good++;
            } else {
              bad++;
            }
          });

          const total = good + bad;
          const ratio = total > 0 ? Math.round((good / total) * 100) : 0;

          values.push(ratio);
          goodCounts.push(good);
          badCounts.push(bad);
        } else {
          values.push(0);
          goodCounts.push(0);
          badCounts.push(0);
        }
      }

      res.json({
        success: true,
        data: {
          labels,
          values,
          goodCounts,
          badCounts,
          todayIndex: todayIndex >= 0 ? todayIndex : 0,
          dates,
        }
      });

    } catch (error) {
      console.error(' Get week emotions error:', error);
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

  static async generateReport(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { startDate, endDate, type = 'all' } = req.body;

      const user = await UserModel.findById(userId);
      const emotions = await EmotionModel.getEntriesByDateRange(userId, startDate, endDate);
      const diary = await SmerModel.findByDateRange(userId, startDate, endDate);

      const GOOD_EMOTIONS = [1, 3, 9, 10];
      let goodEmotions = 0;
      let badEmotions = 0;
      let totalIntensity = 0;

      emotions.forEach((e: any) => {
        totalIntensity += e.intensity;
        if (GOOD_EMOTIONS.includes(Number(e.emotion_type_id))) {
          goodEmotions++;
        } else {
          badEmotions++;
        }
      });

      const mappedDiary = diary.map((d: any) => {
        let emotionsList: any[] = [];

        try {
          if (typeof d.selected_emotions === 'string') {
            emotionsList = JSON.parse(d.selected_emotions);
          } else if (Array.isArray(d.selected_emotions)) {
            emotionsList = d.selected_emotions;
          }
        } catch (e) {
          emotionsList = [];
        }

        const emotionNames = emotionsList
          .map((e: any) => e.emotionName || e.name || '')
          .filter(Boolean)
          .join(', ');

        return {
          ...d,
          situation: d.situation_description || '—',
          behavior: d.reaction_description || '—',
          emotion_name: emotionNames || '—',
        };
      });

      const reportData = {
        startDate,
        endDate,
        user: {
          name: user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : user?.first_name || user?.email
        },
        emotions: type === 'all' || type === 'emotions' ? emotions : [],
        diary: type === 'all' || type === 'diary' ? mappedDiary : [],
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

      console.log(' Отчет создан с ID:', report.id);

      res.json({
        success: true,
        message: 'Отчет сгенерирован',
        reportId: report.id,
        data: reportData
      });
    } catch (error) {
      console.error(' Generate report error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при генерации отчета'
      });
    }
  }

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