import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ComicCard } from '../../components/comics/ComicCard';
import { ComicReader } from '../../components/comics/ComicReader';
import api from '../../services/api/client';

export const ComicsScreen = () => {
  const [comics, setComics] = useState<any[]>([]);
  const [_loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComicId, setSelectedComicId] = useState<number | null>(null);
  const [readerVisible, setReaderVisible] = useState(false);
  const [search, setSearch] = useState('');

  const loadComics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/comics/list');
      setComics(response.data.data || []);
    } catch (error) {
      console.error('Error loading comics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadComics(); }, []);

  const handleOpenComic = (comicId: number) => {
    setSelectedComicId(comicId);
    setReaderVisible(true);
  };

  const filtered = comics.filter(c => {
    if (!search) return true;
    return (
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.author || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const ListHeader = useCallback(() => null, []);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="book-open" size={56} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>
        {search ? 'Ничего не найдено' : 'Нет доступных комиксов'}
      </Text>
      <Text style={styles.emptyText}>
        {search
          ? 'Попробуйте другой запрос'
          : 'Книги появятся здесь после добавления'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок и поиск  */}
      <View style={styles.stickyTop}>
        <Text style={styles.title}>Библиотека книг</Text>
        <Text style={styles.subtitle}>
          {search
            ? `Найдено: ${filtered.length}`
            : `${comics.length} ${comics.length === 1 ? 'книга' : comics.length > 1 && comics.length < 5 ? 'книги' : 'книг'}`}
        </Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по названию или автору..."
            placeholderTextColor={COLORS.textMuted}
            autoCorrect={false}
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
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <ComicCard comic={item} onPress={() => handleOpenComic(item.id)} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadComics();
          }} />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <ComicReader
        visible={readerVisible}
        comicId={selectedComicId}
        onClose={() => {
          setReaderVisible(false);
          setSelectedComicId(null);
        }}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
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
    flexGrow: 1,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body2, color: COLORS.textLight, marginBottom: SPACING.md },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingVertical: SPACING.xxl * 2, gap: SPACING.md,
  },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, textAlign: 'center' },
  emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textLight, textAlign: 'center' },
});
