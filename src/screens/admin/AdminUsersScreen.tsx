import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator,
  RefreshControl, TextInput, Modal, ScrollView, PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

export const AdminUsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Модалка создания админа
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const role = activeTab === 'user' ? '?role=user' : '?role=admin';
      const response = await api.get(`/admin/users${role}`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadUsers();
  }, [activeTab]));

  const handleToggle = async (userId: number, isActive: boolean) => {
    Alert.alert(
      isActive ? 'Заблокировать' : 'Разблокировать',
      'Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: isActive ? 'Заблокировать' : 'Разблокировать',
          style: isActive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setTogglingId(userId);
              await api.put(`/admin/users/${userId}/toggle`);
              setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, is_active: !u.is_active } : u
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

  const handleCreateAdmin = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      Alert.alert('Ошибка', 'Email и пароль обязательны');
      return;
    }
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(adminEmail.trim())) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }
    if (adminPassword.includes(' ')) {
      Alert.alert('Ошибка', 'Пароль не должен содержать пробелы');
      return;
    }
    if (adminPassword.length < 6) {
      Alert.alert('Ошибка', 'Пароль минимум 6 символов');
      return;
    }
    try {
      setCreatingAdmin(true);
      const response = await api.post('/admin/admins', {
        email: adminEmail.trim(),
        password: adminPassword,
        firstName: adminFirstName.trim() || null,
        lastName: adminLastName.trim() || null,
      });
      setShowAdminModal(false);
      setAdminEmail(''); setAdminPassword('');
      setAdminFirstName(''); setAdminLastName('');
      Alert.alert('Успешно', 'Администратор создан');
      if (activeTab === 'admin') {
        setUsers(prev => [...prev, response.data.data]);
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось создать администратора');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const getFullName = (u: any) =>
    u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.email;

  // Свайп 
  const activeTabRef = useRef<'user' | 'admin'>('user');
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60 && activeTabRef.current === 'user') setActiveTab('admin');
        else if (gs.dx > 60 && activeTabRef.current === 'admin') setActiveTab('user');
      },
    })
  ).current;

  const filtered = users.filter(u => {
    if (!search) return true;
    const name = getFullName(u).toLowerCase();
    return name.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
  });

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
        <View style={styles.metaRow}>
          <View style={[styles.roleBadge, {
            backgroundColor: item.role === 'admin' ? COLORS.primary + '20' : COLORS.secondary
          }]}>
            <Text style={[styles.roleText, {
              color: item.role === 'admin' ? COLORS.primary : COLORS.textLight
            }]}>
              {item.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </Text>
          </View>
          {!item.is_active && (
            <View style={styles.blockedBadge}>
              <Text style={styles.blockedText}>Заблокирован</Text>
            </View>
          )}
        </View>
      </View>
      {/* Деактивация */}
      <TouchableOpacity
        onPress={() => handleToggle(item.id, item.is_active)}
        disabled={togglingId === item.id}
        style={styles.toggleBtn}
      >
        {togglingId === item.id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Feather
            name={item.is_active ? 'slash' : 'check-circle'}
            size={22}
            color={item.is_active ? COLORS.error : '#4A7A6C'}
          />
        )}
      </TouchableOpacity>
    </View>
  </View>
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Пользователи</Text>
        {activeTab === 'admin' && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdminModal(true)}
          >
            <Feather name="plus" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Табы */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'user' && styles.tabActive]}
          onPress={() => setActiveTab('user')}
        >
          <Text style={[styles.tabText, activeTab === 'user' && styles.tabTextActive]}>
            Клиенты
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'admin' && styles.tabActive]}
          onPress={() => setActiveTab('admin')}
        >
          <Text style={[styles.tabText, activeTab === 'admin' && styles.tabTextActive]}>
            Администраторы
          </Text>
        </TouchableOpacity>
        <View style={[styles.tabIndicator, { left: activeTab === 'user' ? 0 : '50%' }]} />
      </View>

      <View style={{ flex: 1 }} {...swipe.panHandlers}>
        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по имени или email..."
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
                loadUsers();
              }} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="users" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>
                  {activeTab === 'admin'
                    ? 'Нет других администраторов.\nНажмите + чтобы добавить.'
                    : 'Нет пользователей'
                  }
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Модалка создания администратора */}
      <Modal visible={showAdminModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Новый администратор</Text>
            <TouchableOpacity onPress={() => setShowAdminModal(false)}>
              <Feather name="x" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {[
              { label: 'Email *', value: adminEmail, setter: setAdminEmail, placeholder: 'admin@example.com', secure: false, capitalize: 'none' as const },
              { label: 'Пароль *', value: adminPassword, setter: setAdminPassword, placeholder: 'Минимум 6 символов', secure: true, capitalize: 'none' as const },
              { label: 'Имя', value: adminFirstName, setter: setAdminFirstName, placeholder: 'Имя', secure: false, capitalize: 'words' as const },
              { label: 'Фамилия', value: adminLastName, setter: setAdminLastName, placeholder: 'Фамилия', secure: false, capitalize: 'words' as const },
            ].map(field => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize={field.capitalize}
                  secureTextEntry={field.secure}
                />
              </View>
            ))}
            <TouchableOpacity
              style={[styles.submitBtn, creatingAdmin && styles.submitBtnDisabled]}
              onPress={handleCreateAdmin}
              disabled={creatingAdmin}
            >
              {creatingAdmin
                ? <ActivityIndicator size="small" color={COLORS.white} />
                : <Text style={styles.submitBtnText}>Создать администратора</Text>
              }
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  addBtn: {
    width: 40, height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
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
    width: '50%',
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
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  cardInactive: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarInactive: { backgroundColor: COLORS.textMuted },
  avatarText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  info: { flex: 1 },
  name: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  email: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: SPACING.xs, marginTop: 4 },
  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  roleText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },
  blockedBadge: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  blockedText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '600', fontSize: 10 },
  toggleBtn: { padding: SPACING.sm },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  modalTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  modalContent: { padding: SPACING.xl },
  fieldGroup: { marginBottom: SPACING.lg },
  fieldLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  fieldInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...TYPOGRAPHY.body1, color: COLORS.white, fontWeight: '600' },
});