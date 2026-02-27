import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface Emotion {
  id: number;
  name: string;
}

interface EmotionPickerProps {
  selectedEmotions: Array<{
    emotionId: number;
    emotionName?: string;
    intensity?: number;
  }>;
  onToggleEmotion: (emotion: Emotion) => void;
  onIntensityChange: (emotionId: number, intensity: number) => void;
}

export const EmotionPicker: React.FC<EmotionPickerProps> = ({
  selectedEmotions,
  onToggleEmotion,
  onIntensityChange,
}) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const response = await api.get('/emotions/types');
      setEmotions(response.data.data);
    } catch (error) {
      console.error('Error loading emotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (emotionId: number) => {
    return selectedEmotions.some(e => e.emotionId === emotionId);
  };

  const getSelectedEmotion = (emotionId: number) => {
    return selectedEmotions.find(e => e.emotionId === emotionId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Какие эмоции вы испытывали?</Text>
      <Text style={styles.subtitle}>
        Выбрано: {selectedEmotions.length} {selectedEmotions.length === 1 ? 'эмоция' : 
          selectedEmotions.length > 1 && selectedEmotions.length < 5 ? 'эмоции' : 'эмоций'}
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.emotionsScroll}
      >
        {emotions.map((emotion) => {
          const selected = isSelected(emotion.id);
          const selectedEmotion = getSelectedEmotion(emotion.id);

          return (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.emotionItem,
                selected && styles.emotionItemSelected,
              ]}
              onPress={() => onToggleEmotion(emotion)}
            >
              <Text style={[
                styles.emotionName,
                selected && styles.emotionNameSelected
              ]}>
                {emotion.name}
              </Text>
              {selected && (
                <View style={styles.intensityContainer}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.intensityDot,
                        selectedEmotion?.intensity && level <= selectedEmotion.intensity
                          ? styles.intensityDotActive
                          : styles.intensityDotInactive
                      ]}
                      onPress={() => onIntensityChange(emotion.id, level)}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  emotionsScroll: {
    flexDirection: 'row',
  },
  emotionItem: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 100,
    ...SHADOWS.small,
  },
  emotionItemSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
  },
  emotionName: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  emotionNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
  },
  intensityDotActive: {
    backgroundColor: COLORS.primary,
  },
  intensityDotInactive: {
    backgroundColor: COLORS.border,
  },
});