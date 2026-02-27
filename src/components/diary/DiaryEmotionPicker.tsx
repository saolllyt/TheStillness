import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const MOCK_EMOTIONS = [
  { id: 1, name: 'Радость', emoji: '😊', color: '#FFD700' },
  { id: 2, name: 'Спокойствие', emoji: '😌', color: '#A7C4B5' },
  { id: 3, name: 'Тревога', emoji: '😰', color: '#E69B8C' },
  { id: 4, name: 'Грусть', emoji: '😔', color: '#89B6C9' },
  { id: 5, name: 'Страх', emoji: '😨', color: '#B05E5E' },
  { id: 6, name: 'Злость', emoji: '😤', color: '#E67A6B' },
  { id: 7, name: 'Усталость', emoji: '😩', color: '#8D9AA8' },
  { id: 8, name: 'Надежда', emoji: '🌟', color: '#F0CF85' },
  { id: 9, name: 'Благодарность', emoji: '🙏', color: '#4A7A6C' },
  { id: 10, name: 'Вдохновение', emoji: '✨', color: '#C8A2C8' },
];

interface SelectedEmotion {
  emotionId: number;
  emotionName?: string;
  emoji?: string;
  intensity?: number;
}

interface DiaryEmotionPickerProps {
  selectedEmotions: SelectedEmotion[];
  onSelectEmotion: (emotion: typeof MOCK_EMOTIONS[0]) => void;
  onRemoveEmotion: (emotionId: number) => void;
  onIntensityChange?: (emotionId: number, intensity: number) => void;
}

export const DiaryEmotionPicker: React.FC<DiaryEmotionPickerProps> = ({
  selectedEmotions,
  onSelectEmotion,
  onRemoveEmotion,
  onIntensityChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isSelected = (emotionId: number) => 
    selectedEmotions.some(e => e.emotionId === emotionId);

  const getSelectedEmotion = (emotionId: number) =>
    selectedEmotions.find(e => e.emotionId === emotionId);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Какие эмоции вы испытывали?</Text>
      
      {/* Выбранные эмоции */}
      {selectedEmotions.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Выбрано:</Text>
          <View style={styles.selectedEmotions}>
            {selectedEmotions.map((emotion) => (
              <View key={emotion.emotionId} style={styles.selectedEmotionItem}>
                <View style={styles.selectedEmotionTag}>
                  <Text style={styles.selectedEmotionText}>
                    {emotion.emoji || '😊'} {emotion.emotionName}
                  </Text>
                  {onIntensityChange && (
                    <View style={styles.intensityContainer}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.intensityDot,
                            emotion.intensity && emotion.intensity >= value * 2 ? styles.intensityDotActive : null
                          ]}
                          onPress={() => onIntensityChange(emotion.emotionId, value * 2)}
                        />
                      ))}
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => onRemoveEmotion(emotion.emotionId)}
                    style={styles.removeButton}
                  >
                    <Feather name="x" size={16} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Кнопка выбора эмоций */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.pickerButtonText}>
          {expanded ? 'Скрыть эмоции' : 'Выбрать эмоцию'}
        </Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      {/* Сетка эмоций */}
      {expanded && (
        <View style={styles.emotionsGrid}>
          <FlatList
            data={MOCK_EMOTIONS}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const selected = isSelected(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.emotionItem,
                    selected && styles.emotionItemSelected
                  ]}
                  onPress={() => selected 
                    ? onRemoveEmotion(item.id)
                    : onSelectEmotion(item)
                  }
                >
                  <Text style={styles.emotionEmoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.emotionName,
                    selected && styles.emotionNameSelected
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  label: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  selectedContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  selectedTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  selectedEmotions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  selectedEmotionItem: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  selectedEmotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.round,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  selectedEmotionText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    gap: 4,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.border,
  },
  intensityDotActive: {
    backgroundColor: COLORS.primary,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  pickerButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emotionsGrid: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  emotionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    margin: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
  },
  emotionItemSelected: {
    backgroundColor: COLORS.primary,
  },
  emotionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
  },
  emotionNameSelected: {
    color: COLORS.white,
  },
});