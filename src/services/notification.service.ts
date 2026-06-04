import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api/client';

const CHANNEL_ID = 'daily-reminder';
const MSG_CHANNEL_ID = 'messages';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupDailyReminder(): Promise<void> {
  try {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      console.log('ℹ️ Уведомления: в Expo Go недоступны (SDK 53+). Используйте development build.');
      return;
    }

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

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Ежедневное напоминание',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#004a7c',
      });
      await Notifications.setNotificationChannelAsync(MSG_CHANNEL_ID, {
        name: 'Новые сообщения',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250],
        lightColor: '#004a7c',
      });
    }

    // Пересоздаём расписание — ежедневно в 17:00
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Время для дневника',
        body: 'Запишите свои мысли и эмоции за сегодня в дневник СМЭР',
        sound: true,
        ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
      },
      trigger: {
        hour: 17,
        minute: 0,
        repeats: true,
      } as any,
    });

    console.log(' Ежедневное напоминание запланировано на 17:00');
  } catch (error) {
    console.error(' Ошибка настройки уведомлений:', error);
  }
}

export async function registerPushToken(): Promise<void> {
  try {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const pushToken = tokenData.data;

    await api.post('/profile/push-token', { pushToken });
    console.log(' Push-токен зарегистрирован');
  } catch (error) {
    console.error(' Ошибка регистрации push-токена:', error);
  }
}
