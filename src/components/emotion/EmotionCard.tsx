import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface EmotionCardProps {
  emotion: {
    id: number;
    name: string;
    emoji: string | null;
    color: string | null;
  };
  selected: boolean;
  intensity?: number;
  onSelect: () => void;
  onIntensityChange?: (intensity: number) => void;
  showIntensity?: boolean;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  selected,
  intensity = 5,
  onSelect,
  onIntensityChange,
  showIntensity = false,
}) => {
  const emotionColor = emotion.color || COLORS.secondary;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        { borderColor: selected ? COLORS.primary : 'transparent' }
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.emojiContainer, { backgroundColor: emotionColor + '20' }]}>
        <Text style={styles.emoji}>{emotion.emoji || '😊'}</Text>
      </View>
      
      <Text style={[styles.name, selected && styles.selectedName]}>
        {emotion.name}
      </Text>
      
      {showIntensity && selected && (
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>Интенсивность: {intensity}/10</Text>
          <View style={styles.sliderContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.intensityDot,
                  value <= intensity && styles.intensityDotActive,
                  { backgroundColor: value <= intensity ? COLORS.primary : COLORS.border }
                ]}
                onPress={() => onIntensityChange?.(value)}
              />
            ))}
          </View>
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
    marginBottom: SPACING.sm,
    borderWidth: 2,
    ...SHADOWS.small,
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  selectedName: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  intensityContainer: {
    marginTop: SPACING.sm,
  },
  intensityLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityDot: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.border,
  },
  intensityDotActive: {
    backgroundColor: COLORS.primary,
  },
});