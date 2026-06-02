import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
  TextInput, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { DiaryEntryCard } from '../../components/diary/DiaryEntryCard';
import { Button } from '../../components/common/Button';
import api from '../../services/api/client';

// Подсказки по СМЭР
const SMER_STEPS = [
  {
    letter: 'С',
    title: 'Ситуация',
    description:
      'Опишите место и обстоятельства, при которых возникли неприятные эмоции. Где вы находились? Что происходило вокруг?',
  },
  {
    letter: 'М',
    title: 'Мысли',
    description:
      'Какие мысли возникли у вас в этот момент? Что вы сказали себе? Каков был ваш внутренний монолог?',
  },
  {
    letter: 'Э',
    title: 'Эмоции',
    description:
      'Какие эмоции вы испытали? Насколько интенсивными они были по шкале от 1 до 10?',
  },
  {
    letter: 'Р',
    title: 'Реакция',
    description:
      'Как вы отреагировали физически и поведенчески? Что почувствовали в теле? Что сделали или захотели сделать?',
  },
];

export const DiaryScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [showHints, setShowHints] = useState(false);

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const searchRef = useRef('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doLoad = useCallback(async (reset: boolean, searchValue: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const p = reset ? 0 : pageRef.current + 1;
      const sq = searchValue.trim()
        ? `&search=${encodeURIComponent(searchValue.trim())}`
        : '';
      const response = await api.get(`/diary?limit=10&offset=${p * 10}${sq}`);
      const newEntries: any[] = response.data.data;
      setEntries(prev => (reset ? newEntries : [...prev, ...newEntries]));
      setTotal(response.data.total);
      pageRef.current = p;
      setHasMore(newEntries.length === 10 && (p + 1) * 10 < response.data.total);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить записи');
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      searchRef.current = '';
      setSearch('');
      pageRef.current = 0;
      doLoad(true, '');
    }, [doLoad])
  );

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchRef.current = text;
      pageRef.current = 0;
      doLoad(true, text);
    }, 500);
  };

  const clearSearch = () => handleSearchChange('');

  const onRefresh = () => {
    setRefreshing(true);
    doLoad(true, searchRef.current);
  };

  // Удаление записи 
  const handleDeleteEntry = (entryId: number) => {
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
              setEntries(prev => prev.filter(e => e.id !== entryId));
              setTotal(prev => prev - 1);
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить запись');
            }
          },
        },
      ],
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <Button
        title="Загрузить ещё"
        onPress={() => doLoad(false, searchRef.current)}
        loading={loading}
        variant="outline"
        size="medium"
        style={styles.loadMoreButton}
      />
    );
  };

  // Пустой список 
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather
          name={search.trim() ? 'search' : 'book-open'}
          size={48}
          color={COLORS.textMuted}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {search.trim() ? 'Ничего не найдено' : 'У вас пока нет записей'}
      </Text>
      <Text style={styles.emptyText}>
        {search.trim()
          ? 'Попробуйте другой запрос или дату (например, 22.05)'
          : 'Создайте первую запись в дневнике СМЭР'}
      </Text>
      {!search.trim() && (
        <Button
          title="Создать запись"
          onPress={() => navigation.navigate('DiaryEntry', {})}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  // Модалка СМЭР 
  const renderHintsModal = () => (
    <Modal
      visible={showHints}
      animationType="slide"
      transparent
      onRequestClose={() => setShowHints(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Что такое СМЭР?</Text>
            <TouchableOpacity
              onPress={() => setShowHints(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>
            СМЭР — метод когнитивно-поведенческой терапии для анализа ситуаций,
            вызывающих негативные эмоции.
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SMER_STEPS.map(step => (
              <View key={step.letter} style={styles.hintCard}>
                <View style={styles.hintBadge}>
                  <Text style={styles.hintLetter}>{step.letter}</Text>
                </View>
                <View style={styles.hintBody}>
                  <Text style={styles.hintTitle}>{step.title}</Text>
                  <Text style={styles.hintDesc}>{step.description}</Text>
                </View>
              </View>
            ))}
            <View style={styles.hintFooterCard}>
              <Feather name="zap" size={18} color={COLORS.primary} style={{ marginBottom: 6 }} />
              <Text style={styles.hintFooterText}>
                Регулярное ведение дневника помогает замечать повторяющиеся паттерны мышления
                и постепенно менять их.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHintsModal()}

      {/*
        Шапка и строка поиска 
      */}
      <View style={styles.stickyTop}>
        {/* Заголовок */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Дневник СМЭР</Text>
            <Text style={styles.subtitle}>
              {search.trim() ? `Найдено: ${total}` : `Всего записей: ${total}`}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setShowHints(true)}
              activeOpacity={0.7}
            >
              <Feather name="info" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('DiaryEntry', {})}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Строка поиска */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по записям или дате (22.05)..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <DiaryEntryCard
            entry={item}
            onPress={() => navigation.navigate('DiaryEntry', { id: item.id })}
            onEdit={() => navigation.navigate('EditDiaryEntry', { id: item.id })}
            onDelete={() => handleDeleteEntry(item.id)}
          />
        )}
        ListFooterComponent={entries.length > 0 ? renderFooter : null}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  stickyTop: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body2, color: COLORS.textLight },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  infoButton: {
    width: 40, height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  addButton: {
    width: 48, height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 46,
    ...SHADOWS.small,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    paddingVertical: 0,
  },

  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: 140,
    flexGrow: 1,
  },
  loadMoreButton: { marginTop: SPACING.lg },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  emptyIconContainer: {
    width: 80, height: 80,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, textAlign: 'center' },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyButton: { minWidth: 200 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl + 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  modalSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  hintCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  hintBadge: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  hintLetter: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  hintBody: { flex: 1 },
  hintTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  hintDesc: { ...TYPOGRAPHY.body2, color: COLORS.textLight, lineHeight: 20 },
  hintFooterCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  hintFooterText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
