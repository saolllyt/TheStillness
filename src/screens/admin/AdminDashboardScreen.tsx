import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadStats(); }, []));

  const statCards = stats ? [
    { label: 'Пользователей', value: stats.totalUsers, icon: 'users' },
    { label: 'Психологов', value: stats.totalPsychologists, icon: 'user-check' },
    { label: 'Записей СМЭР', value: stats.totalDiaryEntries, icon: 'edit-3' },
    { label: 'Записей трекера', value: stats.totalEmotionEntries, icon: 'activity' },
  ] : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadStats();
          }} />
        }
      >
        {/*  */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Панель администратора</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Общая статистика</Text>
            {/* Плашки — голубой фон, синий текст */}
            <View style={styles.statsGrid}>
              {statCards.map((card, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statIconWrap}>
                    <Feather name={card.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statValue}>{card.value}</Text>
                  <Text style={styles.statLabel}>{card.label}</Text>
                </View>
              ))}
            </View>

            {stats?.pendingPsychologists > 0 && (
              <TouchableOpacity
                style={styles.alertCard}
                onPress={() => navigation.navigate('Psychologists')}
              >
                <View style={styles.alertIcon}>
                  <Feather name="alert-circle" size={24} color={COLORS.error} />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>
                    {stats.pendingPsychologists} психолог(ов) ожидают верификации
                  </Text>
                  <Text style={styles.alertSubtitle}>Нажмите чтобы рассмотреть заявки</Text>
                </View>
                <Feather name="chevron-right" size={20} color={COLORS.error} />
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>Управление</Text>
<View style={styles.actionsGrid}>
  {[
    { label: 'Пользователи', icon: 'users', screen: 'Users' },
    { label: 'Психологи', icon: 'user-check', screen: 'Psychologists' },
    { label: 'Контент', icon: 'layers', screen: 'Content' },
  ].map((action, index) => (
    <TouchableOpacity
      key={index}
      style={styles.actionCard}
      onPress={() => navigation.navigate(action.screen)}
    >
      <View style={styles.actionIconWrap}>
        <Feather name={action.icon as any} size={28} color={COLORS.primary} />
      </View>
      <Text style={styles.actionLabel}>{action.label}</Text>
    </TouchableOpacity>
  ))}
</View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: 140,
  },
  header: { marginBottom: SPACING.xl },
  greeting: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  subtitle: { ...TYPOGRAPHY.body2, color: COLORS.textLight, marginTop: 2 },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  statIconWrap: {
    width: 36, height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.secondaryMid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: COLORS.primary },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.primaryLight, marginTop: 2 },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    gap: SPACING.md,
  },
  alertIcon: {
    width: 44, height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: { flex: 1 },
  alertTitle: { ...TYPOGRAPHY.body2, color: COLORS.error, fontWeight: '600' },
  alertSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  // Синий фон для управления
  actionsGrid: { flexDirection: 'row', gap: SPACING.sm },
  actionCard: {
  flex: 1,
  backgroundColor: COLORS.secondary,
  borderRadius: BORDER_RADIUS.lg,
  padding: SPACING.md,
  alignItems: 'center',
  ...SHADOWS.small,
},
actionIconWrap: {
  width: 56, height: 56,
  borderRadius: BORDER_RADIUS.lg,
  backgroundColor: COLORS.secondaryMid,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: SPACING.sm,
},
actionLabel: {
  ...TYPOGRAPHY.caption,
  color: COLORS.primary,
  fontWeight: '600',
  textAlign: 'center',
},
  loader: { marginTop: SPACING.xl },
});