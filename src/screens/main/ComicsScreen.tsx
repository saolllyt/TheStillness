import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ComicCard } from '../../components/comics/ComicCard';
import { ComicReader } from '../../components/comics/ComicReader';
import api from '../../services/api/client';

export const ComicsScreen = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComicId, setSelectedComicId] = useState<number | null>(null);
  const [readerVisible, setReaderVisible] = useState(false);

  const loadComics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/comics/list');
      setComics(response.data.data);
    } catch (error) {
      console.error('Error loading comics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadComics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadComics();
  };

  const handleOpenComic = (comicId: number) => {
    setSelectedComicId(comicId);
    setReaderVisible(true);
  };

  const handleCloseReader = () => {
    setReaderVisible(false);
    setSelectedComicId(null);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Библиотека комиксов</Text>
        <Text style={styles.subtitle}>
          {comics.length} {comics.length === 1 ? 'комикс' : 
            comics.length > 1 && comics.length < 5 ? 'комикса' : 'комиксов'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadComics}
      >
        <Feather name="refresh-cw" size={22} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📚</Text>
      <Text style={styles.emptyTitle}>Нет доступных комиксов</Text>
      <Text style={styles.emptyText}>
        Комиксы появятся здесь после добавления{'\n'}
        в базу данных
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comics}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <ComicCard
            comic={item}
            onPress={() => handleOpenComic(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <ComicReader
        visible={readerVisible}
        comicId={selectedComicId}
        onClose={handleCloseReader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});