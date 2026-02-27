import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { DiaryEntryCard } from '../../components/profile/DiaryEntryCard';
import { Button } from '../../components/common/Button';
import api from '../../services/api/client';

export const DiaryScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadEntries = async (loadMore = false) => {
    if (loading || (!loadMore && !hasMore)) return;

    try {
      setLoading(true);
      const currentPage = loadMore ? page + 1 : 0;
      const response = await api.get(`/diary?limit=10&offset=${currentPage * 10}`);
      
      const newEntries = response.data.data;
      setEntries(prev => loadMore ? [...prev, ...newEntries] : newEntries);
      setTotal(response.data.total);
      setPage(currentPage);
      setHasMore(newEntries.length === 10 && (currentPage + 1) * 10 < response.data.total);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить записи');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    loadEntries();
  };

  const handleAddEntry = () => {
    navigation.navigate('DiaryEntry', {});
  };

  const handleEntryPress = (entryId: number) => {
    navigation.navigate('DiaryEntry', { id: entryId });
  };

  const handleEditEntry = (entryId: number) => {
    navigation.navigate('EditDiaryEntry', { id: entryId });
  };

  const handleDeleteEntry = async (entryId: number) => {
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
              loadEntries();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить запись');
            }
          },
        },
      ],
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Дневник СМЭР</Text>
        <Text style={styles.subtitle}>
          Всего записей: {total}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddEntry}
      >
        <Feather name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <Button
        title="Загрузить еще"
        onPress={() => loadEntries(true)}
        loading={loading}
        variant="outline"
        size="medium"
        style={styles.loadMoreButton}
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>У вас пока нет записей</Text>
      <Text style={styles.emptyText}>
        Создайте первую запись в дневнике СМЭР
      </Text>
      <Button
        title="Создать запись"
        onPress={handleAddEntry}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <DiaryEntryCard
            entry={item}
            onPress={() => handleEntryPress(item.id)}
            onEdit={() => handleEditEntry(item.id)}
            onDelete={() => handleDeleteEntry(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={entries.length > 0 ? renderFooter : null}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loadMoreButton: {
    marginTop: SPACING.lg,
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
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
});