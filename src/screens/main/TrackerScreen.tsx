import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { EmotionCard } from '../../components/emotion/EmotionCard';
import { EmotionJar } from '../../components/emotion/EmotionJar';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

interface Emotion {
  id: number;
  name: string;
  emoji: string | null;
  color: string | null;
}

interface SelectedEmotion {
  emotionId: number;
  emotion: Emotion;
  intensity: number;
}

export const TrackerScreen = () => {
  const { user } = useAuth();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [todayEntries, setTodayEntries] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const today = format(new Date(), 'd MMMM yyyy', { locale: ru });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 17) return 'Добрый день';
    if (hour >= 17 && hour < 22) return 'Добрый вечер';
    return 'Доброй ночи';
  };

  const getUserName = () => {
    if (user?.first_name) return user.first_name;
    if (user?.email) return user.email.split('@')[0];
    return '';
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const typesRes = await api.get('/tracker/types');
      const types: Emotion[] = typesRes.data.data;
      setEmotions(types);

      const entriesRes = await api.get('/tracker/today');
      const entries: any[] = entriesRes.data.data;
      setTodayEntries(entries);

      const selected: SelectedEmotion[] = entries.map((entry: any) => ({
        emotionId: entry.emotion_type_id,
        emotion: types.find((e) => e.id === entry.emotion_type_id) ?? {
          id: entry.emotion_type_id,
          name: entry.emotion_name ?? '?',
          emoji: entry.emoji ?? null,
          color: entry.color ?? null,
        },
        intensity: entry.intensity ?? 6,
      }));
      setSelectedEmotions(selected);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    }
  };

  const isSelected = (id: number) => selectedEmotions.some(e => e.emotionId === id);
  const getSelected = (id: number) => selectedEmotions.find(e => e.emotionId === id);

  const handleToggle = (emotion: Emotion) => {
    if (isSelected(emotion.id)) {
      setSelectedEmotions(prev => prev.filter(e => e.emotionId !== emotion.id));
    } else {
      // дефолтная интенсивность
      setSelectedEmotions(prev => [...prev, { emotionId: emotion.id, emotion, intensity: 5 }]);
    }
  };

  const handleIntensity = (emotionId: number, intensity: number) => {
    setSelectedEmotions(prev =>
      prev.map(e => e.emotionId === emotionId ? { ...e, intensity } : e)
    );
  };

  const handleSave = async () => {
    if (selectedEmotions.length === 0) {
      Alert.alert('Выберите хотя бы одну эмоцию');
      return;
    }
    setSaving(true);
    try {
      for (const e of selectedEmotions) {
        await api.post('/tracker/entries', {
          emotion_type_id: e.emotionId,
          intensity: e.intensity,
          note: null,
        });
      }
      Alert.alert('Сохранено!', 'Эмоции записаны.');
      loadData();
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить эмоции');
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert('Очистить всё', 'Удалить все эмоции за сегодня?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: async () => {
          try {
            for (const entry of todayEntries) {
              await api.delete(`/tracker/entries/${entry.id}`);
            }
            setSelectedEmotions([]);
            loadData();
          } catch {
            Alert.alert('Ошибка', 'Не удалось очистить записи');
          }
        },
      },
    ]);
  };

  const jarEmotions = selectedEmotions.map(e => ({
    emotion: e.emotion,
    intensity: e.intensity,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Шапка */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}, {getUserName()}</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
            <Feather name="refresh-cw" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Банка эмоций */}
        <EmotionJar emotions={jarEmotions} />

        {/* Секция выбора */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Как вы себя чувствуете?</Text>
            {selectedEmotions.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {selectedEmotions.length > 0 && (
            <Text style={styles.countHint}>
              Выбрано: {selectedEmotions.length}{' '}
              {selectedEmotions.length === 1 ? 'эмоция'
                : selectedEmotions.length < 5 ? 'эмоции'
                : 'эмоций'}
            </Text>
          )}

          <View style={styles.grid}>
            {emotions.map((emotion) => {
              const sel = isSelected(emotion.id);
              const selData = getSelected(emotion.id);
              return (
                <View key={emotion.id} style={styles.gridCell}>
                  <EmotionCard
                    emotion={emotion}
                    selected={sel}
                    intensity={selData?.intensity}
                    onSelect={() => handleToggle(emotion)}
                    onIntensityChange={(val) => handleIntensity(emotion.id, val)}
                    showIntensity={sel}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <Button
          title="Сохранить эмоции"
          onPress={handleSave}
          loading={saving}
          disabled={selectedEmotions.length === 0}
          style={styles.saveButton}
        />

        <View style={styles.hint}>
          <Feather name="info" size={13} color={COLORS.textMuted} />
          <Text style={styles.hintText}>Запись обнулится завтра автоматически</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  greeting: { ...TYPOGRAPHY.h4, color: COLORS.primary, marginBottom: 2 },
  date: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  refreshBtn: {
    width: 40, height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  section: { marginTop: SPACING.md },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  clearText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '600' },
  countHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  grid: {
    marginTop: SPACING.sm,
  },
  gridCell: {
    marginBottom: SPACING.sm,
  },
  saveButton: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  hintText: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
});
