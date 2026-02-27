import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface DiaryEntryCardProps {
  entry: {
    id: number;
    entry_date: string;
    situation_place: string | null;
    situation_description: string;
    selected_emotions: Array<{
      emotionId: number;
      emotionName?: string;
      intensity?: number;
    }>;
  };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

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
          <Text style={styles.date}>{formattedDate}</Text>
          {entry.situation_place && (
            <Text style={styles.place}>{entry.situation_place}</Text>
          )}
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>✏️</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Text style={styles.actionText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {truncatedText}
      </Text>

      <View style={styles.emotionsContainer}>
        {entry.selected_emotions.slice(0, 3).map((emotion, index) => {
          const intensity = emotion.intensity ? `• ${emotion.intensity}/5` : '';
          
          return (
            <View key={index} style={styles.emotionTag}>
              <Text style={styles.emotionText}>
                {emotion.emotionName || 'Эмоция'} {intensity}
              </Text>
            </View>
          );
        })}
        {entry.selected_emotions.length > 3 && (
          <View style={styles.emotionTag}>
            <Text style={styles.emotionText}>+{entry.selected_emotions.length - 3}</Text>
          </View>
        )}
      </View>
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
  dateContainer: {
    flex: 1,
  },
  date: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  place: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  actionText: {
    fontSize: 16,
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
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  emotionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
});