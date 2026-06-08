import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

export const PsychologistHomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    pendingRequests: 0,
    unreadMessages: 0,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [patientsRes, unreadRes, reportsRes] = await Promise.all([
        api.get('/psychologist/patients'),
        api.get('/psychologist/unread'),
        api.get('/psychologist-reports'),
      ]);
      const patients = patientsRes.data.data || [];
      const activePatients = patients.filter((p: any) => p.status === 'active');
      const pendingPatients = patients.filter((p: any) => p.status === 'pending');
      setStats({
        totalPatients: activePatients.length,
        activePatients: activePatients.length,
        pendingRequests: pendingPatients.length,
        unreadMessages: unreadRes.data.data?.count || 0,
      });
setRecentReports((reportsRes.data.data || []).slice(0, 3));
    } catch (error) {
      console.error('Load psychologist home error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadData();
          }} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Добро пожаловать, {user?.first_name || 'Психолог'}
          </Text>
          <Text style={styles.subtitle}>Панель психолога</Text>
        </View>

        {/* Плашки */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="users" size={24} color={COLORS.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Всего пациентов</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="message-circle" size={24} color={COLORS.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>{stats.unreadMessages}</Text>
            <Text style={styles.statLabel}>Новых сообщений</Text>
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Patients')}
            >
              <View style={styles.actionIcon}>
  <Feather name="users" size={24} color={COLORS.primary} />
</View>
              <Text style={styles.actionText}>Пациенты</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Patients', { initialTab: 'pending' })}
            >
              <View style={styles.actionIconBadge}>
                <View style={styles.actionIcon}>
  <Feather name="clock" size={24} color={COLORS.primary} />
</View>
                {stats.pendingRequests > 0 && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{stats.pendingRequests}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionText}>Запросы</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Последние отчёты  */}
        {recentReports.length > 0 && (
          <View style={styles.reportsBlock}>
            <Text style={styles.reportsBlockTitle}>Последние отчёты</Text>
            {recentReports.map((report: any) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportItem}
                onPress={() => {
                  const patientName = report.patient_first_name
                    ? `${report.patient_first_name} ${report.patient_last_name || ''}`.trim()
                    : report.patient_email;
                  navigation.navigate('PsychReportViewer', { report, patientName });
                }}
                activeOpacity={0.75}
              >
                <View style={styles.reportItemInfo}>
                  <Text style={styles.reportItemTitle}>
                    {report.patient_first_name
                      ? `${report.patient_first_name} ${report.patient_last_name || ''}`.trim()
                      : report.patient_email}
                  </Text>
                  <Text style={styles.reportItemMeta}>Отчёт {formatDate(report.report_date)}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
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

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statIcon: { marginBottom: SPACING.xs },
  statNumber: { fontSize: 32, fontWeight: '700', color: COLORS.primary },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryLight,
    textAlign: 'center',
    marginTop: 4,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  seeAll: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '500' },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: { alignItems: 'center' },
  actionIconBadge: { position: 'relative' },
  actionIcon: {
  width: 56, height: 56,
  borderRadius: BORDER_RADIUS.lg,
  backgroundColor: COLORS.secondary,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: SPACING.xs,
},
actionText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  actionBadge: {
    position: 'absolute',
    top: -4, right: -4,
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listAvatar: {
    width: 40, height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  listAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  reportAvatar: {
    width: 40, height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  listInfo: { flex: 1 },
  listName: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600' },
  listSub: { ...TYPOGRAPHY.caption, color: COLORS.textLight },

  reportsBlock: {
    marginBottom: SPACING.lg,
  },
  reportsBlockTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  reportItemInfo: {
    flex: 1,
  },
  reportItemTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    fontWeight: '500',
  },
  reportItemMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
});