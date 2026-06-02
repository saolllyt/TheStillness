import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator,
  RefreshControl, TextInput, PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

export const AdminPsychologistsScreen = () => {
  const [psychologists, setPsychologists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'all'>('pending');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const loadPsychologists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/psychologists');
      setPsychologists(response.data.data || []);
    } catch (error) {
      console.error('Load psychologists error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadPsychologists();
  }, []));

  const handleVerify = async (psychologistId: number, status: 'active' | 'rejected') => {
    const action = status === 'active' ? 'верифицировать' : 'отклонить';
    Alert.alert(
      'Подтверждение',
      `Вы уверены что хотите ${action} этого психолога?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: status === 'active' ? 'Верифицировать' : 'Отклонить',
          style: status === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setUpdatingId(psychologistId);
              await api.put(`/admin/psychologists/${psychologistId}/verify`, { status });
              Alert.alert('Успешно', status === 'active' ? 'Психолог верифицирован' : 'Заявка отклонена');
              loadPsychologists();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось обновить статус');
            } finally {
              setUpdatingId(null);
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    Alert.alert(
      isActive ? 'Деактивировать' : 'Активировать',
      'Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: isActive ? 'Деактивировать' : 'Активировать',
          style: isActive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setTogglingId(userId);
              await api.put(`/admin/users/${userId}/toggle`);
              setPsychologists(prev => prev.map(p =>
                p.id === userId ? { ...p, is_active: !p.is_active } : p
              ));
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось обновить статус');
            } finally {
              setTogglingId(null);
            }
          }
        }
      ]
    );
  };

  const getFullName = (p: any) =>
    p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.email;

  const filtered = psychologists
    .filter(p => {
      if (activeTab === 'all') return true;
      return p.status === activeTab;
    })
    .filter(p => {
      if (!search) return true;
      const name = getFullName(p).toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        (p.specialization || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.license_number || '').toLowerCase().includes(search.toLowerCase())
      );
    });

  const pendingCount = psychologists.filter(p => p.status === 'pending').length;

  // Свайп 
  const TABS_ORDER = ['pending', 'active', 'all'] as const;
  const activeTabIdxRef = useRef(0);
  useEffect(() => {
    activeTabIdxRef.current = TABS_ORDER.indexOf(activeTab);
  }, [activeTab]);
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        const idx = activeTabIdxRef.current;
        if (gs.dx < -60 && idx < TABS_ORDER.length - 1) setActiveTab(TABS_ORDER[idx + 1]);
        else if (gs.dx > 60 && idx > 0) setActiveTab(TABS_ORDER[idx - 1]);
      },
    })
  ).current;

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, !item.is_active && styles.cardInactive]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, !item.is_active && styles.avatarInactive]}>
          <Text style={styles.avatarText}>
            {item.first_name?.charAt(0)?.toUpperCase() || item.email.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{getFullName(item)}</Text>
          <Text style={styles.email}>{item.email}</Text>
          {item.specialization && (
            <Text style={styles.spec}>{item.specialization}</Text>
          )}
          <Text style={styles.license}>Лицензия: {item.license_number}</Text>
          <Text style={styles.patients}>Пациентов: {item.patients_count}</Text>
          <View style={styles.badgeRow}>
            <View style={[
  styles.statusBadge,
  {
    backgroundColor: item.status === 'active'
      ? COLORS.secondary
      : item.status === 'pending'
        ? COLORS.warning + '20'
        : COLORS.error + '20'
  }
]}>
  <Text style={[
    styles.statusText,
    {
      color: item.status === 'active'
        ? COLORS.primary
        : item.status === 'pending'
          ? COLORS.warning
          : COLORS.error
    }
  ]}>
    {item.status === 'active' ? 'Активен' :
      item.status === 'pending' ? 'Ожидает' : 'Отклонён'}
  </Text>
</View>
            {!item.is_active && (
              <View style={[styles.statusBadge, { backgroundColor: COLORS.error + '20' }]}>
                <Text style={[styles.statusText, { color: COLORS.error }]}>
                  Деактивирован
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleToggleActive(item.id, item.is_active)}
          disabled={togglingId === item.id}
          style={styles.toggleBtn}
        >
          {togglingId === item.id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Feather
  name={item.is_active ? 'slash' : 'check-circle'}
  size={20}
  color={item.is_active ? COLORS.error : COLORS.primary}
/>
          )}
        </TouchableOpacity>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actions}>
          {updatingId === item.psychologist_id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleVerify(item.psychologist_id, 'rejected')}
              >
                <Feather name="x" size={16} color={COLORS.error} />
                <Text style={styles.rejectBtnText}>Отклонить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleVerify(item.psychologist_id, 'active')}
              >
                <Feather name="check" size={16} color={COLORS.white} />
                <Text style={styles.approveBtnText}>Верифицировать</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Психологи</Text>
      </View>

      {/* Вкладки */}
      <View style={styles.tabBar}>
        {(['pending', 'active', 'all'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'pending'
                ? `Заявки${pendingCount > 0 ? ` (${pendingCount})` : ''}`
                : tab === 'active' ? 'Активные' : 'Все'}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={[styles.tabIndicator, {
          left: activeTab === 'pending' ? 0 : activeTab === 'active' ? '33.33%' : '66.67%',
        }]} />
      </View>

      <View style={{ flex: 1 }} {...swipe.panHandlers}>
        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по имени, email, специализации..."
            placeholderTextColor={COLORS.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => {
                setRefreshing(true);
                loadPsychologists();
              }} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="user-check" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>
                  {search
                    ? 'Ничего не найдено'
                    : activeTab === 'pending' ? 'Нет заявок' : 'Нет психологов'
                  }
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },

  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    zIndex: 1,
  },
  tabActive: {},
  tabText: { ...TYPOGRAPHY.body2, color: COLORS.textMuted, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '33.33%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 110 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardInactive: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: {
    width: 48, height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarInactive: { backgroundColor: COLORS.textMuted },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  info: { flex: 1 },
  name: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600' },
  email: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  spec: { ...TYPOGRAPHY.body2, color: COLORS.text, marginTop: 2 },
  license: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  patients: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginTop: 2, fontWeight: '500' },
  badgeRow: { flexDirection: 'row', gap: SPACING.xs, marginTop: 4, flexWrap: 'wrap' },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  statusText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },
  toggleBtn: { padding: SPACING.sm },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 4,
  },
  rejectBtnText: { ...TYPOGRAPHY.body2, color: COLORS.error, fontWeight: '500' },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    gap: 4,
  },
  approveBtnText: { ...TYPOGRAPHY.body2, color: COLORS.white, fontWeight: '500' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingVertical: SPACING.xxl * 2, gap: SPACING.md,
  },
  emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textLight },
});