import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const CHANNEL_ID = 'daily-reminder';

/**
 * Запрашивает разрешение на уведомления и ставит ежедневное напоминание в 19:00.
 */
export async function setupDailyReminder(): Promise<void> {
  try {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      console.log('ℹ️ Уведомления: в Expo Go недоступны (SDK 53+). Используйте development build.');
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Запрос разрешений
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('⚠️ Разрешение на уведомления не получено');
      return;
    }

    // Канал уведомлений
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Ежедневное напоминание',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#004a7c',
      });
    }

    // Пересоздаём расписание 
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Время для дневника ',
        body: 'Запишите свои мысли и эмоции за сегодня в дневник СМЭР',
        sound: true,
        ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
      },
      trigger: {
        hour: 19,
        minute: 0,
        repeats: true,
      } as any,
    });

    console.log(' Ежедневное напоминание запланировано на 19:00');
  } catch (error) {
    console.error(' Ошибка настройки уведомлений:', error);
  }
}
