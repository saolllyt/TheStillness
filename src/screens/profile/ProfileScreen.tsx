import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { EmotionChart } from '../../components/profile/EmotionChart';
import { DiaryEntryCard } from '../../components/profile/DiaryEntryCard';
import { ReportCard } from '../../components/profile/ReportCard';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';
import { generatePDF, sharePDF } from '../../services/pdf.service';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [generatedReportData, setGeneratedReportData] = useState<any>(null);

  const [emotionData, setEmotionData] = useState<{
    labels: string[];
    values: number[];
    goodCounts: number[];
    badCounts: number[];
    todayIndex: number;
  }>({
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    values: [0, 0, 0, 0, 0, 0, 0],
    goodCounts: [0, 0, 0, 0, 0, 0, 0],
    badCounts: [0, 0, 0, 0, 0, 0, 0],
    todayIndex: 0,
  });
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);
  const [diaryTotal, setDiaryTotal] = useState(0);
  const [savedReports, setSavedReports] = useState<any[]>([]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      const [emotionsRes, diaryRes, reportsRes] = await Promise.all([
        api.get('/profile/emotions/week'),
        api.get('/profile/diary?limit=5&offset=0'),
        api.get('/profile/report/list'),
      ]);

      if (emotionsRes.data.success) {
        setEmotionData({
          labels: emotionsRes.data.data.labels,
          values: emotionsRes.data.data.values,
          goodCounts: emotionsRes.data.data.goodCounts || [],
          badCounts: emotionsRes.data.data.badCounts || [],
          todayIndex: emotionsRes.data.data.todayIndex ?? 0,
        });
      }

      if (diaryRes.data.success) {
        setDiaryEntries(diaryRes.data.data);
        setDiaryTotal(diaryRes.data.total);
      }

      if (reportsRes.data.success) {
        setSavedReports((reportsRes.data.data || []).slice(0, 3));
      }
    } catch (error) {
      console.log('Error loading profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
  };

  const handleEntryPress = (entry: any) => {
    navigation.navigate('Diary', {
      screen: 'DiaryEntry',
      params: { id: entry.id }
    });
  };

  const handleEditEntry = (entryId: number) => {
    navigation.navigate('Diary', {
      screen: 'EditDiaryEntry',
      params: { id: entryId }
    });
  };

  const handleDeleteEntry = async (entryId: number) => {
    Alert.alert(
      'Удаление записи',
      'Вы уверены, что хотите удалить эту запись?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/diary/${entryId}`);
              setDiaryEntries(prev => prev.filter(e => e.id !== entryId));
              setDiaryTotal(prev => prev - 1);
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить запись');
            }
          },
        },
      ],
    );
  };

  const saveReportAsPDF = async (reportData: any) => {
  try {
    // Имя отчета
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `report-${dateStr}`;

    const pdfUri = await generatePDF(
      reportData,
      user?.first_name || user?.email || 'Пользователь'
    );

    await sharePDF(pdfUri, fileName, () => {
      // Открываем отчёт 
      navigation.getParent()?.navigate('ReportViewer', {
        reportData,
        userName: user?.first_name || user?.email || 'Пользователь',
        reportId: Date.now(),
      });
    });
  } catch (error) {
    Alert.alert('Ошибка', 'Не удалось создать PDF');
  }
};

  const handleGenerateReport = async (
    startDate: Date,
    endDate: Date
  ): Promise<number | void> => {
    try {
      const response = await api.post('/profile/report', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        type: 'all'
      });

      if (response.data.success) {
        setGeneratedReportData(response.data.data);
        await saveReportAsPDF(response.data.data);
        return response.data.reportId;
      }
    } catch (error: any) {
      Alert.alert(
        'Ошибка',
        error.response?.data?.message || 'Не удалось сгенерировать отчет'
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => await signOut(),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удалить аккаунт',
      'Вы уверены? Все ваши данные будут безвозвратно удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Подтверждение удаления',
              'Это действие необратимо. Аккаунт, дневник и все данные будут удалены навсегда.',
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Да, удалить',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await api.delete('/auth/account');
                      await signOut();
                    } catch {
                      Alert.alert('Ошибка', 'Не удалось удалить аккаунт. Попробуйте позже.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleViewAllDiary = () => {
    navigation.navigate('Diary');
  };

  const handleOpenSavedReport = (report: any) => {
    const reportData = typeof report.report_content === 'string'
      ? JSON.parse(report.report_content)
      : report.report_content;
    navigation.getParent()?.navigate('ReportViewer', {
      reportData,
      userName: user?.first_name || user?.email || 'Пользователь',
      reportId: report.id,
    });
  };

  const formatReportDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Шапка */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ''}`
                  : user?.email}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-2" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Диаграмма эмоций */}
        <EmotionChart data={emotionData} />

        {/* Отчёты */}
        <ReportCard onGenerateReport={handleGenerateReport} />

        {/* Последние сохранённые отчёты */}
        {savedReports.length > 0 && (
          <View style={styles.savedReportsBlock}>
            <Text style={styles.savedReportsTitle}>Последние отчёты</Text>
            {savedReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.savedReportItem}
                onPress={() => handleOpenSavedReport(report)}
                activeOpacity={0.75}
              >
                <View style={styles.savedReportInfo}>
                  <Text style={styles.savedReportDates}>
                    {formatReportDate(report.start_date)} — {formatReportDate(report.end_date)}
                  </Text>
                  <Text style={styles.savedReportMeta}>
                    {report.sent_at ? 'Отправлен психологу' : 'Не отправлен'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Последние записи */}
        <View style={styles.diaryHeader}>
          <Text style={styles.diaryTitle}>Последние записи</Text>
          {diaryTotal > 5 && (
            <TouchableOpacity onPress={handleViewAllDiary}>
              <Text style={styles.viewAllLink}>Все записи</Text>
            </TouchableOpacity>
          )}
        </View>

        {diaryEntries.length > 0 ? (
          diaryEntries.map((entry: any) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              onPress={() => handleEntryPress(entry)}
              onEdit={() => handleEditEntry(entry.id)}
              onDelete={() => handleDeleteEntry(entry.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              У вас пока нет записей в дневнике
            </Text>
          </View>
        )}

        <Button
          title="Выйти"
          onPress={handleLogout}
          variant="primary"
          size="large"
          style={styles.logoutButton}
        />

        <Button
          title="Удалить аккаунт"
          onPress={handleDeleteAccount}
          variant="outline"
          size="large"
          style={styles.deleteButton}
          textStyle={{ color: COLORS.error }}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  diaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  diaryTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  viewAllLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  deleteButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    borderColor: COLORS.error,
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  savedReportsBlock: {
    marginBottom: SPACING.lg,
  },
  savedReportsTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  savedReportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  savedReportInfo: {
    flex: 1,
  },
  savedReportDates: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    fontWeight: '500',
  },
  savedReportMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
});