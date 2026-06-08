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

interface PsychologistListScreenProps {
  navigation: any;
}

// Вспомогательные компоненты
const StatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    pending:  { bg: COLORS.warning + '22',  color: COLORS.warning,  label: 'Ожидает' },
    active:   { bg: COLORS.primary + '18',  color: COLORS.primary,  label: 'Активен' },
    rejected: { bg: COLORS.error   + '22',  color: COLORS.error,    label: 'Отклонён' },
  };
  const c = cfg[status] ?? cfg.pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

// Главный экран

export const PsychologistListScreen: React.FC<PsychologistListScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeTabRef = useRef(0);

  const [allPsychologists, setAllPsychologists] = useState<any[]>([]);
  const [myPsychologists, setMyPsychologists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requesting, setRequesting] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [mySearch, setMySearch] = useState('');
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({});
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // Загрузка данных
  const loadData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes, dialogsRes] = await Promise.all([
        api.get('/psychologist/list'),
        api.get('/psychologist/my'),
        api.get('/psychologist/dialogs').catch(() => ({ data: { data: [] } })),
      ]);
      setAllPsychologists(allRes.data.data || []);
      setMyPsychologists(myRes.data.data || []);
      const map: Record<number, number> = {};
      for (const d of (dialogsRes.data.data || [])) {
        const cnt = Number(d.unread_count);
        if (cnt > 0) map[d.other_user_id] = cnt;
      }
      setUnreadMap(map);
    } catch {
      console.error('Load psychologists error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  // Свайп
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60 && activeTabRef.current === 0) setActiveTab(1);
        else if (gs.dx > 60 && activeTabRef.current === 1) setActiveTab(0);
      },
    })
  ).current;


  const getConnectionStatus = (psychUserId: number) =>
    myPsychologists.find(p => p.id === psychUserId);

  const filteredMy = myPsychologists.filter(p => {
    if (!mySearch) return true;
    const name = getName(p).toLowerCase();
    return (
      name.includes(mySearch.toLowerCase()) ||
      (p.specialization || '').toLowerCase().includes(mySearch.toLowerCase())
    );
  });

  const handleSendRequest = (psychUserId: number, name: string) => {
    Alert.alert('Отправить запрос', `Отправить запрос психологу ${name}?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Отправить',
        onPress: async () => {
          try {
            setRequesting(psychUserId);
            await api.post('/psychologist/request', { psychologistUserId: psychUserId });
            Alert.alert('Успешно', 'Запрос отправлен психологу');
            loadData();
          } catch (err: any) {
            Alert.alert('Ошибка', err.response?.data?.message || 'Не удалось отправить запрос');
          } finally {
            setRequesting(null);
          }
        },
      },
    ]);
  };

  const handleCancelRequest = (psychUserId: number, name: string) => {
    Alert.alert('Отменить запрос', `Отменить запрос к психологу ${name}?`, [
      { text: 'Нет', style: 'cancel' },
      {
        text: 'Отменить запрос',
        style: 'destructive',
        onPress: async () => {
          try {
            setCancelling(psychUserId);
            await api.delete(`/psychologist/request/${psychUserId}`);
            loadData();
          } catch {
            Alert.alert('Ошибка', 'Не удалось отменить запрос');
          } finally {
            setCancelling(null);
          }
        },
      },
    ]);
  };

  const handleOpenChat = (psych: any) => {
    navigation.navigate('Chat', {
      otherUserId: psych.id,
      otherUserName: psych.first_name
        ? `${psych.first_name} ${psych.last_name || ''}`.trim()
        : psych.email,
    });
  };

  const getName = (p: any) =>
    p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.email;

  const filtered = allPsychologists.filter(p => {
    const name = getName(p).toLowerCase();
    return !search ||
      name.includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.specialization || '').toLowerCase().includes(search.toLowerCase());
  });

  const renderAllItem = ({ item }: { item: any }) => {
    const connection = getConnectionStatus(item.id);
    const isReq = requesting === item.id;
    const isCancelling = cancelling === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.first_name?.charAt(0)?.toUpperCase() || item.email?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{getName(item)}</Text>
            {item.specialization && (
              <Text style={styles.specText} numberOfLines={1}>{item.specialization}</Text>
            )}
          </View>
          {connection && <StatusBadge status={connection.status} />}
        </View>

        <View style={styles.cardActions}>
          {!connection ? (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleSendRequest(item.id, getName(item))}
              disabled={isReq}
            >
              {isReq
                ? <ActivityIndicator size="small" color={COLORS.white} />
                : <>
                    <Feather name="user-plus" size={15} color={COLORS.white} />
                    <Text style={styles.primaryBtnText}>Отправить запрос</Text>
                  </>}
            </TouchableOpacity>
          ) : connection.status === 'active' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => handleOpenChat(item)}>
              <Feather name="message-circle" size={15} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Написать</Text>
            </TouchableOpacity>
          ) : connection.status === 'pending' ? (
            <TouchableOpacity
              style={styles.cancelSmallBtn}
              onPress={() => handleCancelRequest(item.id, getName(item))}
              disabled={isCancelling}
            >
              {isCancelling
                ? <ActivityIndicator size="small" color={COLORS.error} />
                : <Text style={styles.cancelSmallText}>Отменить запрос</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleSendRequest(item.id, getName(item))}
            >
              <Feather name="refresh-cw" size={15} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Отправить снова</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderMyItem = ({ item }: { item: any }) => {
    const isCancelling = cancelling === item.id;
    const unread = unreadMap[item.id] || 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.first_name?.charAt(0)?.toUpperCase() || item.email?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.cardName}>{getName(item)}</Text>
              {unread > 0 && (
                <View style={styles.unreadDot}>
                  <Text style={styles.unreadText}>{unread}</Text>
                </View>
              )}
            </View>
            {item.specialization && (
              <Text style={styles.specText} numberOfLines={1}>{item.specialization}</Text>
            )}
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.cardActions}>
          {item.status === 'active' ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => handleOpenChat(item)}>
              <Feather name="message-circle" size={15} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Написать</Text>
            </TouchableOpacity>
          ) : item.status === 'pending' ? (
            <TouchableOpacity
              style={styles.cancelSmallBtn}
              onPress={() => handleCancelRequest(item.id, getName(item))}
              disabled={isCancelling}
            >
              {isCancelling
                ? <ActivityIndicator size="small" color={COLORS.error} />
                : <Text style={styles.cancelSmallText}>Отменить запрос</Text>}
            </TouchableOpacity>
          ) : (
            <View style={styles.pendingInfo}>
              <Feather name="x-circle" size={14} color={COLORS.error} />
              <Text style={[styles.pendingText, { color: COLORS.error }]}>Запрос отклонён</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Психологи</Text>
        <Text style={styles.subtitle}>Найдите специалиста и начните работу</Text>
      </View>

      {/* Вкладки */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.tabActive]}
          onPress={() => setActiveTab(0)}
        >
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
            Все специалисты
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.tabActive]}
          onPress={() => setActiveTab(1)}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
            Мои психологи
          </Text>
        </TouchableOpacity>
        {/* Индикатор */}
        <View style={[styles.tabIndicator, { left: activeTab === 0 ? 0 : '50%' }]} />
      </View>

      {/* Контент со свайпом */}
      <View style={{ flex: 1 }} {...swipe.panHandlers}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : activeTab === 0 ? (
          /* Все специалисты  */
          <>
            {/* Строка поиска */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Feather name="search" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Имя или специализация..."
                  placeholderTextColor={COLORS.textMuted}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Feather name="x" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FlatList
              data={filtered}
              keyExtractor={item => item.id.toString()}
              renderItem={renderAllItem}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Feather name="users" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyTitle}>
                    {search ? 'Ничего не найдено' : 'Нет доступных психологов'}
                  </Text>
                  <Text style={styles.emptyText}>
                    {search ? 'Попробуйте другой запрос' : 'Психологи появятся здесь после верификации'}
                  </Text>
                </View>
              }
            />
          </>
        ) : (
          /* Мои психологи */
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Feather name="search" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  value={mySearch}
                  onChangeText={setMySearch}
                  placeholder="Имя или специализация..."
                  placeholderTextColor={COLORS.textMuted}
                />
                {mySearch.length > 0 && (
                  <TouchableOpacity onPress={() => setMySearch('')}>
                    <Feather name="x" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <FlatList
              data={filteredMy}
              keyExtractor={item => item.id.toString()}
              renderItem={renderMyItem}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Feather name="user-x" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyTitle}>
                    {mySearch ? 'Ничего не найдено' : 'Нет психологов'}
                  </Text>
                  <Text style={styles.emptyText}>
                    {mySearch
                      ? 'Попробуйте другой запрос'
                      : 'Перейдите на вкладку «Все специалисты» и отправьте запрос'}
                  </Text>
                  {!mySearch && (
                    <TouchableOpacity style={styles.goBtn} onPress={() => setActiveTab(0)}>
                      <Text style={styles.goBtnText}>Найти психолога</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title:    { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body2, color: COLORS.textLight },

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    gap: 4,
    zIndex: 1,
  },
  tabActive: {},
  tabText: { ...TYPOGRAPHY.body2, color: COLORS.textMuted, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  searchRow: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 44,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchInput: { flex: 1, ...TYPOGRAPHY.body2, color: COLORS.text, paddingVertical: 0 },



  list: { paddingHorizontal: SPACING.xl, paddingBottom: 140, flexGrow: 1 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48, height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  avatarText: { fontSize: 20, fontWeight: '600', color: COLORS.white },
  cardInfo: { flex: 1 },
  cardName: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  specText: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginBottom: 2 },
  specTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  specTagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '500' },
  cardLicense: { ...TYPOGRAPHY.caption, color: COLORS.textLight },

  cardActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  primaryBtnText: { ...TYPOGRAPHY.body2, color: COLORS.white, fontWeight: '600' },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  pendingText: { ...TYPOGRAPHY.body2, color: COLORS.warning },
  cancelSmallBtn: {
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelSmallText: { ...TYPOGRAPHY.body2, color: COLORS.error, fontWeight: '600' },

  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
  },
  badgeText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 11 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingVertical: SPACING.xxl * 2, gap: SPACING.md,
  },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary, textAlign: 'center' },
  emptyText:  { ...TYPOGRAPHY.body2, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: SPACING.xl },
  goBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.sm,
  },
  goBtnText: { ...TYPOGRAPHY.body1, color: COLORS.white, fontWeight: '600' },
  unreadDot: {
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  unreadText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
});
