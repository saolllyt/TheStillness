import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

export const PsychologistProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [psychStatus, setPsychStatus] = useState<'active' | 'pending' | 'rejected' | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/psychologist/profile/me');
      if (res.data?.success) {
        const newStatus: 'active' | 'pending' | 'rejected' | null = res.data.data?.status ?? null;
        // Оповещаем, когда статус изменился 
        if (prevStatusRef.current !== null &&
            prevStatusRef.current !== 'active' &&
            newStatus === 'active') {
          Alert.alert(
            ' Аккаунт верифицирован!',
            'Ваш аккаунт подтверждён администратором. Теперь вы можете принимать пациентов!'
          );
        }
        prevStatusRef.current = newStatus;
        setPsychStatus(newStatus);
      }
    } catch { /* профиль недоступен */ }
  };

  useEffect(() => {
    fetchStatus();
    // Опрашиваем статус каждые 30 секунд
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: async () => await signOut() },
    ]);
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
              'Это действие необратимо. Аккаунт и все данные будут удалены навсегда.',
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Профиль</Text>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.first_name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.first_name
              ? `${user.first_name} ${user.last_name || ''}`
              : user?.email}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Психолог</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Статус аккаунта</Text>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusDot,
              psychStatus === 'active'   && { backgroundColor: '#4A7A6C' },
              psychStatus === 'pending'  && { backgroundColor: '#c8952a' },
              psychStatus === 'rejected' && { backgroundColor: '#B05E5E' },
            ]} />
            <Text style={[
              styles.statusText,
              psychStatus === 'active'   && { color: '#4A7A6C' },
              psychStatus === 'pending'  && { color: '#c8952a' },
              psychStatus === 'rejected' && { color: '#B05E5E' },
            ]}>
              {psychStatus === 'active'   ? 'Верифицирован'
                : psychStatus === 'pending'  ? 'Ожидает подтверждения'
                : psychStatus === 'rejected' ? 'Заявка отклонена'
                : 'Загрузка...'}
            </Text>
          </View>
          {psychStatus === 'pending' && (
            <Text style={styles.pendingHint}>
              Статус обновляется автоматически каждые 30 секунд.
            </Text>
          )}
        </View>

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
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: 120,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xl },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  avatar: {
    width: 80, height: 80,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: COLORS.white },
  name: { ...TYPOGRAPHY.h4, color: COLORS.primary, marginBottom: 4 },
  email: { ...TYPOGRAPHY.body2, color: COLORS.textLight, marginBottom: SPACING.md },
  roleBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  roleText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  infoTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary, marginBottom: SPACING.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  statusDot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  statusText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '500' },
  pendingHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  logoutButton: { marginTop: SPACING.xl },
  deleteButton: {
    marginTop: SPACING.md,
    borderColor: COLORS.error,
  },
});
