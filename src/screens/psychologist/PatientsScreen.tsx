import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl, PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

export const PatientsScreen = ({ navigation, route }: any) => {
  const initialTab = route?.params?.initialTab || 'active';
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>(initialTab);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/psychologist/patients');
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Load patients error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadPatients(); }, []));

  const handleAccept = async (patient: any) => {
    Alert.alert('Принять пациента', `Принять ${getFullName(patient)} как пациента?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Принять',
        onPress: async () => {
          try {
            setUpdatingId(patient.id);
            await api.put('/psychologist/patients/status', { patientId: patient.id, status: 'active' });
            loadPatients();
          } catch {
            Alert.alert('Ошибка', 'Не удалось обновить статус');
          } finally {
            setUpdatingId(null);
          }
        }
      }
    ]);
  };

  const handleRemove = async (patient: any) => {
    Alert.alert('Удалить пациента', `Удалить ${getFullName(patient)} из вашего списка?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            setUpdatingId(patient.id);
            await api.delete(`/psychologist/patients/${patient.id}`);
            loadPatients();
          } catch {
            Alert.alert('Ошибка', 'Не удалось удалить пациента');
          } finally {
            setUpdatingId(null);
          }
        }
      }
    ]);
  };

  const handleReject = async (patient: any) => {
    Alert.alert('Отклонить запрос', `Отклонить запрос от ${getFullName(patient)}?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Отклонить',
        style: 'destructive',
        onPress: async () => {
          try {
            setUpdatingId(patient.id);
            await api.put('/psychologist/patients/status', { patientId: patient.id, status: 'rejected' });
            loadPatients();
          } catch {
            Alert.alert('Ошибка', 'Не удалось обновить статус');
          } finally {
            setUpdatingId(null);
          }
        }
      }
    ]);
  };

  const getFullName = (p: any) =>
    p.first_name || p.last_name
      ? `${p.first_name || ''} ${p.last_name || ''}`.trim()
      : p.email;

  const filteredPatients = patients.filter(p => p.status === activeTab);
  const pendingCount = patients.filter(p => p.status === 'pending').length;

  // Свайп 
  const activeTabRef = useRef<'active' | 'pending'>('active');
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60 && activeTabRef.current === 'active') setActiveTab('pending');
        else if (gs.dx > 60 && activeTabRef.current === 'pending') setActiveTab('active');
      },
    })
  ).current;

  const renderPatient = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.first_name?.charAt(0)?.toUpperCase() || item.email.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{getFullName(item)}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.pendingActions}>
          {/* Надпись */}
          <Text style={styles.pendingLabel}>Ожидает вашего ответа</Text>
          {updatingId === item.id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(item)}
              >
                <Feather name="x" size={16} color={COLORS.error} />
                <Text style={styles.rejectText}>Отклонить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(item)}
              >
                <Feather name="check" size={16} color={COLORS.white} />
                <Text style={styles.acceptText}>Принять</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {item.status === 'active' && (
        <View style={styles.activeActions}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', {
              otherUserId: item.id,
              otherUserName: getFullName(item),
            })}
          >
            <Feather name="message-circle" size={16} color={COLORS.white} />
            <Text style={styles.chatButtonText}>Написать</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => navigation.navigate('CreateReport', { patient: item })}
          >
            <Feather name="file-plus" size={16} color={COLORS.primary} />
            <Text style={styles.reportButtonText}>Отчёт</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item)}
            disabled={updatingId === item.id}
          >
            <Feather name="user-x" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Пациенты</Text>
      </View>

      {/* Вкладки — единый стиль */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Пациенты
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Запросы{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </Text>
        </TouchableOpacity>
        <View style={[styles.tabIndicator, { left: activeTab === 'active' ? 0 : '50%' }]} />
      </View>

      <View style={{ flex: 1 }} {...swipe.panHandlers}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPatient}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              loadPatients();
            }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="users" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>
                {activeTab === 'pending' ? 'Нет новых запросов' : 'Нет активных пациентов'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'pending'
                  ? 'Новые запросы появятся здесь'
                  : 'Пациенты появятся после принятия запросов'}
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
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 110 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  avatar: {
    width: 48, height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  info: { flex: 1 },
  name: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600' },
  email: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  pendingActions: { marginTop: SPACING.sm },
  // Красная надпись
  pendingLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  buttonsRow: { flexDirection: 'row', gap: SPACING.sm },
  rejectButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1,
    borderColor: COLORS.error, gap: 4,
  },
  rejectText: { ...TYPOGRAPHY.body2, color: COLORS.error, fontWeight: '500' },
  acceptButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, gap: 4,
  },
  acceptText: { ...TYPOGRAPHY.body2, color: COLORS.white, fontWeight: '500' },
  activeActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  chatButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, gap: 4,
  },
  chatButtonText: { ...TYPOGRAPHY.body2, color: COLORS.white, fontWeight: '500' },
  reportButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.primary, gap: 4,
  },
  reportButtonText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '500' },
  removeButton: {
    width: 36, height: 36,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingVertical: SPACING.xxl * 2, gap: SPACING.md,
  },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  emptyText: { ...TYPOGRAPHY.body2, color: COLORS.textLight, textAlign: 'center' },
});