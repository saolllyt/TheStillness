import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface DiaryEntryCardProps {
  entry: {
    id: number;
    entry_date: string;
    situation_place: string | null;
    situation_description: string;
    selected_emotions: any[];
  };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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

const getEmotionName = (emotion: any): string =>
  emotion.emotionName || emotion.name || 'Эмоция';

const getEmotionColor = (emotion: any): string =>
  EMOTION_COLORS[getEmotionName(emotion)] || COLORS.secondary;

export const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({
  entry,
  onPress,
  onEdit,
  onDelete,
}) => {
  const formattedDate = format(new Date(entry.entry_date), 'd MMMM yyyy', { locale: ru });

  const truncatedText = entry.situation_description.length > 100
    ? `${entry.situation_description.substring(0, 100)}...`
    : entry.situation_description;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={13} color={COLORS.primary} />
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          {entry.situation_place && (
            <View style={styles.placeRow}>
              <Feather name="map-pin" size={11} color={COLORS.textLight} />
              <Text style={styles.place}>{entry.situation_place}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Feather name="edit-2" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Feather name="trash-2" size={16} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {truncatedText}
      </Text>

      {entry.selected_emotions.length > 0 && (
        <View style={styles.emotionsContainer}>
          {entry.selected_emotions.slice(0, 3).map((emotion, index) => (
            <View
              key={index}
              style={[styles.emotionTag, { backgroundColor: getEmotionColor(emotion) + '40' }]}
            >
              <View style={[styles.emotionDot, { backgroundColor: getEmotionColor(emotion) }]} />
              <Text style={styles.emotionText}>{getEmotionName(emotion)}</Text>
            </View>
          ))}
          {entry.selected_emotions.length > 3 && (
            <View style={styles.emotionTag}>
              <Text style={styles.emotionText}>+{entry.selected_emotions.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  dateContainer: { flex: 1 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  date: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  place: { ...TYPOGRAPHY.caption, color: COLORS.textLight },
  actions: { flexDirection: 'row', gap: SPACING.xs },
  actionButton: {
    width: 32, height: 32,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    gap: 4,
  },
  emotionDot: {
    width: 8, height: 8,
    borderRadius: 4,
  },
  emotionText: { ...TYPOGRAPHY.caption, color: COLORS.primary },
});