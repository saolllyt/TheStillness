import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Path, Ellipse, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface EmotionJarProps {
  emotions: Array<{
    emotion: {
      id: number;
      name: string;
      emoji: string | null;
      color: string | null;
    };
    intensity: number;
  }>;
}

export const EmotionJar: React.FC<EmotionJarProps> = ({ emotions }) => {
  const screenWidth = Dimensions.get('window').width - SPACING.xl * 2;
  const jarWidth = screenWidth * 0.65;
  const jarHeight = jarWidth * 1.5;
  
  const sortedEmotions = [...emotions].sort((a, b) => b.intensity - a.intensity);
  const totalIntensity = sortedEmotions.reduce((sum, e) => sum + e.intensity, 0);

  if (emotions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Баночка эмоций сегодня</Text>
        <View style={[styles.jarWrapper, { width: jarWidth + 40, height: jarHeight + 50 }]}>
          <Svg width={jarWidth + 40} height={jarHeight + 50} viewBox={`0 0 ${jarWidth + 40} ${jarHeight + 50}`}>
            <Defs>
              <LinearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="rgba(200, 212, 229, 0.4)" />
                <Stop offset="50%" stopColor="rgba(200, 212, 229, 0.6)" />
                <Stop offset="100%" stopColor="rgba(200, 212, 229, 0.4)" />
              </LinearGradient>
            </Defs>

            <Rect
              x={(jarWidth + 40 - jarWidth * 0.75) / 2}
              y={15}
              width={jarWidth * 0.75}
              height={16}
              fill={COLORS.primary}
              rx={4}
            />
            
            <Rect
              x={(jarWidth + 40 - jarWidth * 0.45) / 2}
              y={31}
              width={jarWidth * 0.45}
              height={22}
              fill="rgba(255,255,255,0.95)"
              stroke={COLORS.primary}
              strokeWidth={1.5}
              strokeOpacity={0.6}
              rx={0}
            />
            
            <Rect
              x={(jarWidth + 40 - jarWidth) / 2}
              y={53}
              width={jarWidth}
              height={jarHeight}
              fill="url(#glassGradient)"
              stroke={COLORS.primary}
              strokeWidth={1.8}
              strokeOpacity={0.7}
              rx={BORDER_RADIUS.lg}
              ry={BORDER_RADIUS.lg}
            />
            
            <Rect
              x={(jarWidth + 40 - jarWidth) / 2 + 3}
              y={56}
              width={jarWidth - 6}
              height={jarHeight - 6}
              fill="white"
              rx={BORDER_RADIUS.md}
              ry={BORDER_RADIUS.md}
            />

            <Rect
              x={(jarWidth + 40 - jarWidth) / 2 + 8}
              y={60}
              width={6}
              height={jarHeight - 20}
              fill="rgba(255, 255, 255, 0.3)"
              rx={3}
            />
          </Svg>
        </View>
        <Text style={styles.emptyText}>Добавьте эмоции, чтобы наполнить банку</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Баночка эмоций сегодня</Text>
      
      <View style={[styles.jarWrapper, { width: jarWidth + 40, height: jarHeight + 50 }]}>
        <Svg width={jarWidth + 40} height={jarHeight + 50} viewBox={`0 0 ${jarWidth + 40} ${jarHeight + 50}`}>
          <Defs>
            <LinearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="rgba(200, 212, 229, 0.4)" />
              <Stop offset="50%" stopColor="rgba(200, 212, 229, 0.6)" />
              <Stop offset="100%" stopColor="rgba(200, 212, 229, 0.4)" />
            </LinearGradient>
          </Defs>

          <Rect
            x={(jarWidth + 40 - jarWidth * 0.75) / 2}
            y={15}
            width={jarWidth * 0.75}
            height={16}
            fill={COLORS.primary}
            rx={4}
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth * 0.65) / 2}
            y={12}
            width={jarWidth * 0.65}
            height={6}
            fill={COLORS.primary}
            opacity={0.8}
            rx={2}
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth * 0.45) / 2}
            y={31}
            width={jarWidth * 0.45}
            height={22}
            fill="rgba(255,255,255,0.95)"
            stroke={COLORS.primary}
            strokeWidth={1.5}
            strokeOpacity={0.6}
            rx={0}
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth * 0.45) / 2 - 1}
            y={52}
            width={jarWidth * 0.45 + 2}
            height={4}
            fill="rgba(255,255,255,0.95)"
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth) / 2}
            y={53}
            width={jarWidth}
            height={jarHeight}
            fill="url(#glassGradient)"
            stroke={COLORS.primary}
            strokeWidth={1.8}
            strokeOpacity={0.7}
            rx={BORDER_RADIUS.lg}
            ry={BORDER_RADIUS.lg}
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth) / 2 + 3}
            y={56}
            width={jarWidth - 6}
            height={jarHeight - 6}
            fill="rgba(255, 255, 255, 0.95)"
            rx={BORDER_RADIUS.md}
            ry={BORDER_RADIUS.md}
          />

          {sortedEmotions.map((item, index) => {
            const layerHeight = (item.intensity / totalIntensity) * (jarHeight - 12);
            const layerY = 56 + jarHeight - 6 - layerHeight - sortedEmotions
              .slice(0, index)
              .reduce((sum, e) => sum + (e.intensity / totalIntensity) * (jarHeight - 12), 0);
            
            const emotionColor = item.emotion.color || COLORS.secondary;
            
            return (
              <Rect
                key={index}
                x={(jarWidth + 40 - jarWidth) / 2 + 3}
                y={layerY}
                width={jarWidth - 6}
                height={layerHeight}
                fill={emotionColor}
                opacity={0.85}
                rx={BORDER_RADIUS.sm}
                ry={BORDER_RADIUS.sm}
              />
            );
          })}

          <Rect
            x={(jarWidth + 40 - jarWidth) / 2 + 8}
            y={60}
            width={6}
            height={jarHeight - 20}
            fill="rgba(255, 255, 255, 0.3)"
            rx={3}
          />
          
          <Rect
            x={(jarWidth + 40 - jarWidth) / 2 - 2}
            y={53 + jarHeight - 5}
            width={jarWidth + 4}
            height={8}
            fill={COLORS.primary}
            opacity={0.15}
            rx={4}
          />
        </Svg>
      </View>

      <View style={styles.legendContainer}>
        {sortedEmotions.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.emotion.color || COLORS.secondary }]} />
            <Text style={styles.legendText}>
              {item.emotion.emoji} {item.emotion.name} — {item.intensity}/10
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  jarWrapper: {
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  legendContainer: {
    marginTop: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  legendText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
  emptyText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});