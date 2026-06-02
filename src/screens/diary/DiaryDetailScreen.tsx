import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface DiaryDetailScreenProps {
  navigation: any;
  route: {
    params: {
      entry: any;
    };
  };
}

const EMOTION_COLORS: { [key: string]: string } = {
  'Радость': '#F0CF85',
  'Спокойствие': '#89B6C9',
  'Тревога': '#B68B5C',
  'Грусть': '#8BA5C9',
  'Страх': '#B05E5E',
  'Злость': '#C97A6D',
  'Усталость': '#A0A0B0',
  'Надежда': '#7AB89A',
  'Благодарность': '#C8A2C8',
  'Вдохновение': '#F0CF85',
};

const EMOTION_ICONS: { [key: string]: keyof typeof Feather.glyphMap } = {
  'Радость': 'sun',
  'Спокойствие': 'wind',
  'Тревога': 'alert-circle',
  'Грусть': 'cloud',
  'Страх': 'shield',
  'Злость': 'zap',
  'Усталость': 'moon',
  'Надежда': 'star',
  'Благодарность': 'heart',
  'Вдохновение': 'feather',
};

export const DiaryDetailScreen: React.FC<DiaryDetailScreenProps> = ({ navigation, route }) => {
  const { entry } = route.params;
  const formattedDate = format(new Date(entry.entry_date), 'd MMMM yyyy', { locale: ru });

  const getEmotionName = (emotion: any) =>
    emotion.emotionName || emotion.name || 'Эмоция';

  const getEmotionColor = (emotion: any) =>
    EMOTION_COLORS[getEmotionName(emotion)] || COLORS.secondary;

  const getEmotionIcon = (emotion: any): keyof typeof Feather.glyphMap =>
    EMOTION_ICONS[getEmotionName(emotion)] || 'circle';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Шапка */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Запись от {formattedDate}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('DiaryEntry', { id: entry.id })}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Место */}
        {entry.situation_place && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Место</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>{entry.situation_place}</Text>
            </View>
          </View>
        )}

        {/* Ситуация */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ситуация</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.situation_description}</Text>
          </View>
        </View>

        {/* Мысли */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="message-circle" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Мысли</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.thoughts}</Text>
          </View>
        </View>

        {/* Эмоции */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Эмоции</Text>
          </View>
          <View style={styles.emotionsCard}>
            {entry.selected_emotions.map((emotion: any, index: number) => {
              const color = getEmotionColor(emotion);
              const icon = getEmotionIcon(emotion);
              const name = getEmotionName(emotion);
              const isLast = index === entry.selected_emotions.length - 1;

              return (
                <View
                  key={index}
                  style={[styles.emotionItem, isLast && styles.emotionItemLast]}
                >
                  {/* Иконка */}
                  <View style={[styles.emotionIconContainer, { backgroundColor: color + '30' }]}>
                    <Feather name={icon} size={20} color={color} />
                  </View>

                  <View style={styles.emotionInfo}>
                    <Text style={styles.emotionName}>{name}</Text>
                    {emotion.intensity && (
                      <View style={styles.intensityRow}>
                        <View style={styles.intensityBar}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <View
                              key={i}
                              style={[
                                styles.intensitySegment,
                                emotion.intensity >= i * 2
                                  ? { backgroundColor: color }
                                  : styles.intensitySegmentEmpty
                              ]}
                            />
                          ))}
                        </View>
                        <Text style={styles.intensityText}>{emotion.intensity}/10</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Действия */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="activity" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Действия</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.reaction_description}</Text>
          </View>
        </View>

        <Text style={styles.createdAt}>
          Создано: {format(new Date(entry.created_at || entry.entry_date), 'dd.MM.yyyy HH:mm')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: { padding: SPACING.sm },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    width: 36, height: 36,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sectionTitle: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  cardText: { ...TYPOGRAPHY.body1, color: COLORS.text, lineHeight: 24 },
  emotionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  emotionItemLast: { borderBottomWidth: 0 },
  emotionIconContainer: {
    width: 44, height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionInfo: { flex: 1 },
  emotionName: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '500', marginBottom: 4 },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  intensityBar: {
    flexDirection: 'row',
    gap: 3,
  },
  intensitySegment: {
    width: 16, height: 6,
    borderRadius: 3,
  },
  intensitySegmentEmpty: {
    backgroundColor: COLORS.border,
  },
  intensityText: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  createdAt: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});