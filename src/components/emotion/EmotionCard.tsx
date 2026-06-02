import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface EmotionCardProps {
  emotion: {
    id: number;
    name: string;
    emoji: string | null;
    color: string | null;
  };
  selected: boolean;
  intensity?: number;  // 1–10
  onSelect: () => void;
  onIntensityChange?: (intensity: number) => void;
  showIntensity?: boolean;
}

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  selected,
  intensity = 5,
  onSelect,
  onIntensityChange,
}) => {
  const emotionColor = emotion.color || COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onSelect}
      activeOpacity={0.75}
    >
      {/* Шапка */}
      <View style={styles.headerRow}>
        <View style={[styles.emojiWrap, { backgroundColor: emotionColor + '22' }]}>
          <Text style={styles.emoji}>{emotion.emoji || '😊'}</Text>
        </View>
        <Text style={[styles.name, selected && styles.selectedName]} numberOfLines={1}>
          {emotion.name}
        </Text>
        {selected && (
          <View style={[styles.checkCircle, { backgroundColor: emotionColor }]}>
            <Feather name="check" size={14} color={COLORS.white} />
          </View>
        )}
      </View>

      {/* Шкала интенсивности  */}
      <View style={styles.intensityRow}>
        {LEVELS.map((level) => {
          const filled = selected && level <= intensity;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => selected && onIntensityChange?.(level)}
              disabled={!selected}
              style={[
                styles.intensityBlock,
                {
                  backgroundColor: emotionColor,
                  opacity: filled ? 1 : (selected ? 0.18 : 0.1),
                },
              ]}
              activeOpacity={0.65}
            />
          );
        })}
      </View>

      {/* Подписи и текущий уровень */}
      {selected && (
        <View style={styles.intensityMeta}>
          <Text style={styles.labelSmall}>Слабо</Text>
          <Text style={[styles.labelLevel, { color: emotionColor }]}>
            {intensity} / 10
          </Text>
          <Text style={styles.labelSmall}>Сильно</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f6fb',
  },

  // Шапка
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 24 },
  name: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Шкала интенсивности
  intensityRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: SPACING.sm,
  },
  intensityBlock: {
    flex: 1,
    height: 26,
    borderRadius: 5,
  },

  // Подписи
  intensityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  labelSmall: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  labelLevel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    fontSize: 11,
  },
});
