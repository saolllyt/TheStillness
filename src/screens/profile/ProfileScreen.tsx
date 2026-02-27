import React, { useState, useEffect, useCallback } from 'react';
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
  const [lastReportId, setLastReportId] = useState<number | null>(null);
  const [generatedReportData, setGeneratedReportData] = useState<any>(null);
  
  const [emotionData, setEmotionData] = useState({
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    values: [0, 0, 0, 0, 0, 0, 0]
  });
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);
  const [diaryTotal, setDiaryTotal] = useState(0);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('Загрузка данных профиля...');
      
      const emotionsRes = await api.get('/profile/emotions/week');
      
      if (emotionsRes.data.success) {
        setEmotionData({
          labels: emotionsRes.data.data.labels,
          values: emotionsRes.data.data.values
        });
      }

      const diaryRes = await api.get('/profile/diary?limit=5&offset=0');
      
      if (diaryRes.data.success) {
        setDiaryEntries(diaryRes.data.data);
        setDiaryTotal(diaryRes.data.total);
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
  };

  const handleEntryPress = (entryId: number) => {
    navigation.navigate('Diary', {
      screen: 'DiaryEntry',
      params: { id: entryId }
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
              loadProfileData();
              Alert.alert('Успешно', 'Запись удалена');
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
      const fileName = `report_${new Date().toISOString().split('T')[0]}`;
      const pdfUri = await generatePDF(reportData, user?.first_name || user?.email || 'Пользователь');
      
      await sharePDF(pdfUri, fileName);
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать PDF');
    }
  };

  const handleGenerateReport = async (startDate: Date, endDate: Date): Promise<number | void> => {
    try {
      const response = await api.post('/profile/report', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        type: 'all'
      });

      if (response.data.success) {
        setLastReportId(response.data.reportId);
        setGeneratedReportData(response.data.data);
        
        await saveReportAsPDF(response.data.data);
        
        return response.data.reportId;
      }
    } catch (error: any) {
      console.error('Generate report error:', error.response?.data || error.message);
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось сгенерировать отчет');
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
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  const handleViewAllDiary = () => {
    navigation.navigate('Diary');
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
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
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
            style={styles.settingsButton}
            onPress={() => Alert.alert('Настройки', 'Функция будет доступна позже')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <EmotionChart data={emotionData} />

        <ReportCard onGenerateReport={handleGenerateReport} />

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
              onPress={() => handleEntryPress(entry.id)}
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

        <Text style={styles.version}>Версия 1.0.0</Text>
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
    paddingVertical: SPACING.lg,
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
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingsButton: {
    padding: SPACING.sm,
  },
  settingsIcon: {
    fontSize: 24,
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
    marginBottom: SPACING.md,
  },
  version: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
});