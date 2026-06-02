import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl,
  PanResponder, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

export const AdminContentScreen = () => {
  const [activeTab, setActiveTab] = useState<'comics' | 'playlists'>('comics');
  const [comics, setComics] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Форма добавления книги
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addAuthor, setAddAuthor] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addCoverUrl, setAddCoverUrl] = useState('');
  const [addPdfFile, setAddPdfFile] = useState<{ name: string; uri: string; mimeType: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comicsRes, playlistsRes] = await Promise.all([
        api.get('/admin/comics'),
        api.get('/admin/playlists'),
      ]);
      setComics(comicsRes.data.data || []);
      setPlaylists(playlistsRes.data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  // Свайп между вкладками
  const activeTabRef = useRef<'comics' | 'playlists'>('comics');
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60 && activeTabRef.current === 'comics') setActiveTab('playlists');
        else if (gs.dx > 60 && activeTabRef.current === 'playlists') setActiveTab('comics');
      },
    })
  ).current;

  const handleToggleComic = async (comicId: number) => {
    try {
      setTogglingId(comicId);
      await api.put(`/admin/comics/${comicId}/toggle`);
      setComics(prev => prev.map(c =>
        c.id === comicId ? { ...c, is_active: !c.is_active } : c
      ));
    } catch {
      Alert.alert('Ошибка', 'Не удалось обновить статус');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteComic = (comicId: number, title: string) => {
    Alert.alert('Удалить книгу', `Удалить "${title}"?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/comics/${comicId}`);
            setComics(prev => prev.filter(c => c.id !== comicId));
          } catch {
            Alert.alert('Ошибка', 'Не удалось удалить книгу');
          }
        },
      },
    ]);
  };

  const handleTogglePlaylist = async (playlistId: number) => {
    try {
      setTogglingId(playlistId);
      await api.put(`/admin/playlists/${playlistId}/toggle`);
      setPlaylists(prev => prev.map(p =>
        p.id === playlistId ? { ...p, is_active: !p.is_active } : p
      ));
    } catch {
      Alert.alert('Ошибка', 'Не удалось обновить статус');
    } finally {
      setTogglingId(null);
    }
  };

  // Выбор PDF 
  const handlePickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const file = result.assets[0];
    setAddPdfFile({ name: file.name, uri: file.uri, mimeType: file.mimeType ?? 'application/pdf' });
  };

  // Загрузка книги на сервер
  const handleUploadComic = async () => {
    if (!addTitle.trim()) { Alert.alert('Ошибка', 'Введите название'); return; }
    if (!addPdfFile) { Alert.alert('Ошибка', 'Выберите PDF файл'); return; }

    try {
      setUploading(true);
      const form = new FormData();
      form.append('title', addTitle.trim());
      if (addAuthor.trim()) form.append('author', addAuthor.trim());
      if (addDescription.trim()) form.append('description', addDescription.trim());
      if (addCoverUrl.trim()) form.append('cover_image_url', addCoverUrl.trim());
      form.append('pdf', { uri: addPdfFile.uri, name: addPdfFile.name, type: addPdfFile.mimeType } as any);

      const token = await (await import('@react-native-async-storage/async-storage')).default.getItem('@TheStillness:token');
      const response = await fetch('http://127.0.0.1:3001/api/admin/comics', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || 'Ошибка сервера');

      setComics(prev => [json.data, ...prev]);
      setAddModalVisible(false);
      setAddTitle(''); setAddAuthor(''); setAddDescription(''); setAddCoverUrl(''); setAddPdfFile(null);
      Alert.alert('Готово', 'Книга добавлена');
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить книгу');
    } finally {
      setUploading(false);
    }
  };

  const renderComic = ({ item }: { item: any }) => (
    <View style={[styles.card, !item.is_active && styles.cardInactive]}>
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          {item.cover_image_url
            ? <Image source={{ uri: item.cover_image_url }} style={styles.coverImage} resizeMode="cover" />
            : <Feather name="book-open" size={24} color={COLORS.primary} />}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardSub} numberOfLines={1}>{item.author || 'Без автора'}</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: item.is_active ? COLORS.secondary : COLORS.error + '20',
          }]}>
            <Text style={[styles.statusText, { color: item.is_active ? COLORS.primary : COLORS.error }]}>
              {item.is_active ? 'Активна' : 'Скрыта'}
            </Text>
          </View>
        </View>
        <View style={styles.cardButtons}>
          <TouchableOpacity onPress={() => handleToggleComic(item.id)} disabled={togglingId === item.id} style={styles.iconBtn}>
            {togglingId === item.id
              ? <ActivityIndicator size="small" color={COLORS.primary} />
              : <Feather name={item.is_active ? 'eye-off' : 'eye'} size={20} color={item.is_active ? COLORS.error : COLORS.primary} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteComic(item.id, item.title)} style={styles.iconBtn}>
            <Feather name="trash-2" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPlaylist = ({ item }: { item: any }) => (
    <View style={[styles.card, !item.is_active && styles.cardInactive]}>
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          {item.cover_image_url
            ? <Image source={{ uri: item.cover_image_url }} style={styles.coverImage} resizeMode="cover" />
            : <Feather name="headphones" size={24} color={COLORS.primary} />}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardSub} numberOfLines={1}>{item.description || 'Без описания'}</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: item.is_active ? COLORS.secondary : COLORS.error + '20',
          }]}>
            <Text style={[styles.statusText, { color: item.is_active ? COLORS.primary : COLORS.error }]}>
              {item.is_active ? 'Активен' : 'Скрыт'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleTogglePlaylist(item.id)} disabled={togglingId === item.id} style={styles.iconBtn}>
          {togglingId === item.id
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Feather name={item.is_active ? 'eye-off' : 'eye'} size={20} color={item.is_active ? COLORS.error : COLORS.primary} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Контент</Text>
        {activeTab === 'comics' && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <Feather name="plus" size={18} color={COLORS.white} />
            <Text style={styles.addBtnText}>Добавить</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Вкладки */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comics' && styles.tabActive]}
          onPress={() => setActiveTab('comics')}
        >
          <Feather name="book-open" size={14} color={activeTab === 'comics' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'comics' && styles.tabTextActive]}>
            Книги {comics.length > 0 ? `(${comics.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.tabActive]}
          onPress={() => setActiveTab('playlists')}
        >
          <Feather name="headphones" size={14} color={activeTab === 'playlists' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'playlists' && styles.tabTextActive]}>
            Плейлисты {playlists.length > 0 ? `(${playlists.length})` : ''}
          </Text>
        </TouchableOpacity>
        <View style={[styles.tabIndicator, { left: activeTab === 'comics' ? 0 : '50%' }]} />
      </View>

      <View style={{ flex: 1 }} {...swipe.panHandlers}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={activeTab === 'comics' ? comics : playlists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={activeTab === 'comics' ? renderComic : renderPlaylist}
            contentContainerStyle={[
              styles.listContent,
              (activeTab === 'comics' ? comics : playlists).length === 0 && styles.listContentEmpty,
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name={activeTab === 'comics' ? 'book-open' : 'headphones'} size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>
                  {activeTab === 'comics' ? 'Нет книг' : 'Нет плейлистов'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Окно добавления книги */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Новая книга</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Feather name="x" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Выбор PDF */}
              <TouchableOpacity style={styles.pdfPicker} onPress={handlePickPdf}>
                <Feather name="file-text" size={20} color={addPdfFile ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.pdfPickerText, addPdfFile && { color: COLORS.primary }]} numberOfLines={1}>
                  {addPdfFile ? addPdfFile.name : 'Выбрать PDF файл *'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Название *"
                placeholderTextColor={COLORS.textMuted}
                value={addTitle}
                onChangeText={setAddTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Автор"
                placeholderTextColor={COLORS.textMuted}
                value={addAuthor}
                onChangeText={setAddAuthor}
              />
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Описание"
                placeholderTextColor={COLORS.textMuted}
                value={addDescription}
                onChangeText={setAddDescription}
                multiline
                numberOfLines={3}
              />
              <TextInput
                style={styles.input}
                placeholder="URL обложки (необязательно)"
                placeholderTextColor={COLORS.textMuted}
                value={addCoverUrl}
                onChangeText={setAddCoverUrl}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.uploadBtn, uploading && { opacity: 0.6 }]}
                onPress={handleUploadComic}
                disabled={uploading}
              >
                {uploading
                  ? <ActivityIndicator size="small" color={COLORS.white} />
                  : <Text style={styles.uploadBtnText}>Загрузить книгу</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.lg,
  },
  addBtnText: { ...TYPOGRAPHY.body2, color: COLORS.white, fontWeight: '600' },

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
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: SPACING.sm + 2, gap: 4, zIndex: 1,
  },
  tabActive: {},
  tabText: { ...TYPOGRAPHY.body2, color: COLORS.textMuted, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute', bottom: 0, width: '50%',
    height: 3, backgroundColor: COLORS.primary, borderRadius: 2,
  },

  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 140 },
  listContentEmpty: { flexGrow: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingVertical: SPACING.xxl * 2, gap: SPACING.md,
  },
  emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textLight, textAlign: 'center' },

  card: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  cardInactive: { opacity: 0.6 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: {
    width: 48, height: 48, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.secondary, justifyContent: 'center',
    alignItems: 'center', marginRight: SPACING.md,
  },
  coverImage: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md },
  cardInfo: { flex: 1 },
  cardTitle: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600' },
  cardSub: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  statusBadge: {
    alignSelf: 'flex-start', paddingHorizontal: SPACING.sm,
    paddingVertical: 2, borderRadius: BORDER_RADIUS.round, marginTop: 4,
  },
  statusText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },
  cardButtons: { flexDirection: 'row', gap: SPACING.xs },
  iconBtn: { padding: SPACING.sm },

  // Модалка
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SPACING.xl, maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.lg,
  },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  pdfPicker: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm,
  },
  pdfPickerText: { ...TYPOGRAPHY.body2, color: COLORS.textMuted, flex: 1 },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  uploadBtn: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xl,
  },
  uploadBtnText: { ...TYPOGRAPHY.body1, color: COLORS.white, fontWeight: '700' },
});
