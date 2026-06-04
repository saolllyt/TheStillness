import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface MyPsychologistsScreenProps {
  navigation: any;
}

export const MyPsychologistsScreen: React.FC<MyPsychologistsScreenProps> = ({ navigation }) => {
  const [psychologists, setPsychologists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [psychRes, dialogsRes] = await Promise.all([
        api.get('/psychologist/my'),
        api.get('/psychologist/dialogs').catch(() => ({ data: { data: [] } })),
      ]);
      setPsychologists(psychRes.data.data || []);
      const map: Record<number, number> = {};
      for (const d of (dialogsRes.data.data || [])) {
        if (d.unread_count > 0) map[d.other_user_id] = d.unread_count;
      }
      setUnreadMap(map);
    } catch (error) {
      console.error('Load my psychologists error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4A7A6C';
      case 'pending': return COLORS.warning;
      case 'rejected': return COLORS.error;
      default: return COLORS.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'pending': return 'Ожидание';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };

  const getFullName = (p: any) => {
    if (p.first_name || p.last_name) {
      return `${p.first_name || ''} ${p.last_name || ''}`.trim();
    }
    return p.email;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.first_name?.charAt(0)?.toUpperCase() || item.email.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.name}>{getFullName(item)}</Text>
          {unreadMap[item.id] > 0 && (
            <View style={styles.unreadDot}>
              <Text style={styles.unreadText}>{unreadMap[item.id]}</Text>
            </View>
          )}
        </View>
        {item.specialization && (
          <Text style={styles.specialization}>{item.specialization}</Text>
        )}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      {item.status === 'active' && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat', {
            otherUserId: item.id,
            otherUserName: getFullName(item),
          })}
        >
          <Feather name="message-circle" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Мои психологи</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={psychologists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              loadData();
            }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="user-x" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Нет психологов</Text>
              <Text style={styles.emptyText}>
                Отправьте запрос психологу из списка
              </Text>
              <TouchableOpacity
                style={styles.goToListButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.goToListText}>Найти психолога</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { padding: SPACING.sm },
  title: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatar: {
    width: 52, height: 52,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: COLORS.white },
  info: { flex: 1 },
  name: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600' },
  specialization: { ...TYPOGRAPHY.body2, color: COLORS.text, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { ...TYPOGRAPHY.caption, fontWeight: '500' },
  chatButton: {
    width: 44, height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  emptyText: { ...TYPOGRAPHY.body2, color: COLORS.textLight, textAlign: 'center' },
  goToListButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.sm,
  },
  goToListText: { ...TYPOGRAPHY.body1, color: COLORS.white, fontWeight: '600' },
  unreadDot: {
    minWidth: 18, height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
});