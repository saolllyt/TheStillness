import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { EmotionCard } from '../../components/emotion/EmotionCard';
import { EmotionJar } from '../../components/emotion/EmotionJar';
import { Button } from '../../components/common/Button';
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
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [todayEntries, setTodayEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const today = format(new Date(), 'd MMMM yyyy', { locale: ru });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Загружаем типы эмоций
      const typesRes = await api.get('/tracker/types');
      setEmotions(typesRes.data.data);

      // Загружаем записи за сегодня
      const entriesRes = await api.get('/tracker/today');
      setTodayEntries(entriesRes.data.data);
      
      // Преобразуем записи в выбранные эмоции
      const selected = entriesRes.data.data.map((entry: any) => ({
        emotionId: entry.emotion_type_id,
        emotion: typesRes.data.data.find((e: Emotion) => e.id === entry.emotion_type_id),
        intensity: entry.intensity
      }));
      setSelectedEmotions(selected);
      
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const isEmotionSelected = (emotionId: number) => 
    selectedEmotions.some(e => e.emotionId === emotionId);

  const getSelectedEmotion = (emotionId: number) =>
    selectedEmotions.find(e => e.emotionId === emotionId);

  const handleSelectEmotion = (emotion: Emotion) => {
    if (isEmotionSelected(emotion.id)) {
      setSelectedEmotions(prev => prev.filter(e => e.emotionId !== emotion.id));
    } else {
      setSelectedEmotions(prev => [
        ...prev,
        { emotionId: emotion.id, emotion, intensity: 5 }
      ]);
    }
  };

  const handleIntensityChange = (emotionId: number, intensity: number) => {
    setSelectedEmotions(prev =>
      prev.map(e =>
        e.emotionId === emotionId ? { ...e, intensity } : e
      )
    );
  };

const handleSaveEmotions = async () => {
  if (selectedEmotions.length === 0) {
    Alert.alert('Ошибка', 'Выберите хотя бы одну эмоцию');
    return;
  }

  setSaving(true);
  
  try {
    console.log('Сохранение эмоций:', selectedEmotions);
    
    // Сохраняем каждую эмоцию
    for (const emotion of selectedEmotions) {
      const response = await api.post('/tracker/entries', {
        emotion_type_id: emotion.emotionId,
        intensity: emotion.intensity,
        note: null
      });
      console.log('Сохранено:', response.data);
    }
    
    Alert.alert('Успешно', 'Эмоции сохранены!');
    loadData(); // Перезагружаем данные трекера
    
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    Alert.alert('Ошибка', 'Не удалось сохранить эмоции');
  } finally {
    setSaving(false);
  }
};

  const handleClearAll = () => {
    Alert.alert(
      'Очистить всё',
      'Вы уверены, что хотите очистить все эмоции за сегодня?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Удаляем все записи за сегодня
              for (const entry of todayEntries) {
                await api.delete(`/tracker/entries/${entry.id}`);
              }
              setSelectedEmotions([]);
              loadData();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить записи');
            }
          },
        },
      ],
    );
  };

  const jarEmotions = selectedEmotions.map(e => ({
    emotion: {
      id: e.emotion.id,
      name: e.emotion.name,
      emoji: e.emotion.emoji,
      color: e.emotion.color,
    },
    intensity: e.intensity,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет, Анна 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={loadData}
          >
            <Text style={styles.infoIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        <EmotionJar emotions={jarEmotions} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Какие эмоции вы испытываете?</Text>
          </View>
          
          <View style={styles.sectionSubheader}>
            <Text style={styles.sectionSubtitle}>
              Выбрано: {selectedEmotions.length} {selectedEmotions.length === 1 ? 'эмоция' : 
                selectedEmotions.length > 1 && selectedEmotions.length < 5 ? 'эмоции' : 'эмоций'}
            </Text>
            
            {selectedEmotions.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearText}>Очистить всё</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.emotionsGrid}>
            {emotions.map((emotion) => {
              const selected = isEmotionSelected(emotion.id);
              const selectedEmotion = getSelectedEmotion(emotion.id);
              
              return (
                <EmotionCard
                  key={emotion.id}
                  emotion={emotion}
                  selected={selected}
                  intensity={selectedEmotion?.intensity}
                  onSelect={() => handleSelectEmotion(emotion)}
                  onIntensityChange={(intensity) => 
                    handleIntensityChange(emotion.id, intensity)
                  }
                  showIntensity={selected}
                />
              );
            })}
          </View>
        </View>

        <Button
          title="Сохранить эмоции"
          onPress={handleSaveEmotions}
          loading={saving}
          disabled={selectedEmotions.length === 0}
          style={styles.saveButton}
        />

        <Text style={styles.resetNote}>
          ✨ Запись обнулится завтра автоматически
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
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
    marginBottom: 4,
  },
  date: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  infoIcon: {
    fontSize: 20,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  sectionSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  clearText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    fontWeight: '500',
  },
  emotionsGrid: {
    marginTop: SPACING.sm,
  },
  saveButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  resetNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});