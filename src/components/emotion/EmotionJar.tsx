import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect, Ellipse, Defs, LinearGradient, Stop, ClipPath, G, Path
} from 'react-native-svg';
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

  const W = 160; // ширина банки
  const H = 220; // высота банки
  const SVG_W = 220;
  const SVG_H = 320;
  const CX = SVG_W / 2;

  // Координаты частей
  const LID_W = 110;
  const LID_H = 14;
  const LID_X = CX - LID_W / 2;
  const LID_Y = 20;

  const NECK_W = 95;
  const NECK_H = 20;
  const NECK_X = CX - NECK_W / 2;
  const NECK_Y = LID_Y + LID_H;

  const BODY_X = CX - W / 2;
  const BODY_Y = NECK_Y + NECK_H;
  const BODY_R = 18;

  // Внутренняя область 
  const PAD = 8;
  const IN_X = BODY_X + PAD;
  const IN_Y = BODY_Y + PAD;
  const IN_W = W - PAD * 2;
  const IN_H = H - PAD * 2;

  const sortedEmotions = [...emotions].sort((a, b) => b.intensity - a.intensity);
  const totalIntensity = sortedEmotions.reduce((sum, e) => sum + e.intensity, 0);

  const renderLayers = () => {
    if (totalIntensity === 0 || emotions.length === 0) return null;

    let filledH = 0;

    return sortedEmotions.map((item, index) => {
      const ratio = item.intensity / totalIntensity;
      const lH = ratio * IN_H;
      // Снизу вверх
      const lY = IN_Y + IN_H - filledH - lH;
      filledH += lH;

      const color = item.emotion.color || '#A7C4B5';
      const isLast = index === sortedEmotions.length - 1;

      // Волна верхнего слоя
      if (isLast) {
        const amp = 5;
        return (
          <Path
            key={item.emotion.id}
            d={`
              M ${IN_X} ${lY + amp}
              Q ${IN_X + IN_W * 0.25} ${lY - amp} 
                ${IN_X + IN_W * 0.5} ${lY + amp}
              Q ${IN_X + IN_W * 0.75} ${lY + amp * 3} 
                ${IN_X + IN_W} ${lY + amp}
              L ${IN_X + IN_W} ${lY + lH}
              L ${IN_X} ${lY + lH}
              Z
            `}
            fill={color}
          />
        );
      }

      return (
        <Rect
          key={item.emotion.id}
          x={IN_X}
          y={lY}
          width={IN_W}
          height={lH}
          fill={color}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Баночка эмоций сегодня</Text>

      <View style={{ alignSelf: 'center' }}>
        <Svg width={SVG_W} height={SVG_H}>
          <Defs>
            <LinearGradient id="lidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3a5298" />
              <Stop offset="100%" stopColor="#1a2d5a" />
            </LinearGradient>

            {/* Клип строго по телу банки */}
            <ClipPath id="bodyClip">
              <Rect
                x={BODY_X}
                y={BODY_Y}
                width={W}
                height={H}
                rx={BODY_R}
                ry={BODY_R}
              />
            </ClipPath>
          </Defs>

          {/* Тень */}
          <Ellipse
            cx={CX}
            cy={BODY_Y + H + 8}
            rx={W * 0.4}
            ry={6}
            fill="rgba(0,0,0,0.07)"
          />

          {/* Фон банки */}
          <Rect
            x={BODY_X}
            y={BODY_Y}
            width={W}
            height={H}
            rx={BODY_R}
            ry={BODY_R}
            fill="rgba(235, 243, 255, 0.9)"
          />

          {/* Слои эмоций */}
          <G clipPath="url(#bodyClip)">
            {renderLayers()}
          </G>

          {/* Граница банки */}
          <Rect
            x={BODY_X}
            y={BODY_Y}
            width={W}
            height={H}
            rx={BODY_R}
            ry={BODY_R}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={2}
            strokeOpacity={0.35}
          />

          {/* Блик */}
          <Rect
            x={BODY_X + 12}
            y={BODY_Y + 12}
            width={14}
            height={H * 0.5}
            fill="rgba(255,255,255,0.4)"
            rx={7}
          />

          {/* Горлышко */}
          <Rect
            x={NECK_X}
            y={NECK_Y}
            width={NECK_W}
            height={NECK_H}
            fill="rgba(220, 235, 255, 0.85)"
            stroke={COLORS.primary}
            strokeWidth={1.2}
            strokeOpacity={0.35}
          />

          {/* Крышка */}
          <Rect
            x={LID_X}
            y={LID_Y}
            width={LID_W}
            height={LID_H}
            fill="url(#lidGrad)"
            rx={5}
            ry={5}
          />

          {/* Блик на крышке */}
          <Rect
            x={LID_X + 8}
            y={LID_Y + 3}
            width={LID_W * 0.3}
            height={4}
            fill="rgba(255,255,255,0.2)"
            rx={2}
          />
        </Svg>
      </View>

      {emotions.length > 0 ? (
        <View style={styles.legendContainer}>
          {sortedEmotions.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[
                styles.legendColor,
                { backgroundColor: item.emotion.color || COLORS.secondary }
              ]} />
              <Text style={styles.legendText}>
                {item.emotion.emoji} {item.emotion.name} — {item.intensity}/10
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Добавьте эмоции, чтобы наполнить банку
        </Text>
      )}
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
  legendContainer: {
    marginTop: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 14,
    height: 14,
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
    marginTop: SPACING.sm,
  },
});