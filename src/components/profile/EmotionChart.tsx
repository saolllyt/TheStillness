import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface EmotionChartProps {
  data: {
    labels: string[];
    values: number[];
    goodCounts?: number[];
    badCounts?: number[];
    todayIndex?: number;
  };
  title?: string;
}

export const EmotionChart: React.FC<EmotionChartProps> = ({
  data,
  title = 'Эмоциональный фон за неделю',
}) => {
  const todayIndex =
    data.todayIndex !== undefined ? data.todayIndex : data.labels.length - 1;

  const dayHasData = (i: number) => {
    const g = data.goodCounts?.[i] || 0;
    const b = data.badCounts?.[i]  || 0;
    return g + b > 0;
  };

  const hasAnyData = data.labels.some((_, i) => dayHasData(i));

  const totalGood  = (data.goodCounts || []).reduce((a, b) => a + b, 0);
  const totalBad   = (data.badCounts  || []).reduce((a, b) => a + b, 0);
  const activeDays = data.labels.filter((_, i) => dayHasData(i)).length;

  const BAR_MAX_HEIGHT = 100;
  const MIN_BAR_HEIGHT = 6;

  const getBarHeight = (value: number, i: number): number => {
    if (value > 0) return Math.max(Math.round((value / 100) * BAR_MAX_HEIGHT), MIN_BAR_HEIGHT);
    if (dayHasData(i)) return MIN_BAR_HEIGHT; // all-bad day
    return 0;
  };

  const getBarColor = (value: number, i: number): string => {
    if (value === 0 && dayHasData(i)) return '#B05E5E'; 
    if (value >= 70) return '#4A7A6C';
    if (value >= 40) return '#F0CF85';
    if (value > 0)   return '#B05E5E';
    return 'transparent';
  };

  if (!hasAnyData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholderContainer}>
          <Feather name="bar-chart-2" size={40} color={COLORS.textMuted} />
          <Text style={styles.placeholderText}>
            Нет данных за эту неделю{'\n'}Добавьте эмоции в трекере
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Legend */}
      <View style={styles.legendRow}>
        {([
          { color: '#4A7A6C', label: '≥70% хороших' },
          { color: '#F0CF85', label: '40–69%' },
          { color: '#B05E5E', label: '<40%' },
        ] as const).map(({ color, label }) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Chart area */}
      <View style={styles.chartWrapper}>
        {/* Y-axis */}
        <View style={styles.yAxis}>
          {['100%', '75%', '50%', '25%', '0%'].map((v) => (
            <Text key={v} style={styles.yLabel}>{v}</Text>
          ))}
        </View>

        {/* Bars  grid */}
        <View style={styles.chartArea}>
          {/* Grid lines (absolute) */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <View
              key={pct}
              style={[
                styles.gridLine,
                { bottom: (pct / 100) * BAR_MAX_HEIGHT + 22 },
              ]}
            />
          ))}

          {/* Bar columns */}
          <View style={styles.barsRow}>
            {data.labels.map((label, i) => {
              const value   = data.values[i] || 0;
              const barH    = getBarHeight(value, i);
              const color   = getBarColor(value, i);
              const isToday = i === todayIndex;

              return (
                <View key={i} style={styles.barColumn}>
                  {/* % label above bar */}
                  <Text style={[styles.barValueText, { color: color === 'transparent' ? 'transparent' : color }]}>
                    {value > 0 ? `${value}%` : ''}
                  </Text>

                  {/* Track */}
                  <View style={[styles.barTrack, { height: BAR_MAX_HEIGHT }]}>
                    {barH > 0 && (
                      <View style={[styles.barFill, { height: barH, backgroundColor: color }]} />
                    )}
                  </View>

                  {/* Day label */}
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {label}
                  </Text>
                  {isToday ? <View style={styles.todayDot} /> : <View style={{ height: 6 }} />}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Summary strip */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: '#4A7A6C18' }]}>
            <Feather name="smile" size={15} color="#4A7A6C" />
          </View>
          <Text style={styles.summaryNum}>{totalGood}</Text>
          <Text style={styles.summaryLabel}>Позитивных</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: '#B05E5E18' }]}>
            <Feather name="frown" size={15} color="#B05E5E" />
          </View>
          <Text style={styles.summaryNum}>{totalBad}</Text>
          <Text style={styles.summaryLabel}>Негативных</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: COLORS.primary + '18' }]}>
            <Feather name="calendar" size={15} color={COLORS.primary} />
          </View>
          <Text style={styles.summaryNum}>{activeDays}</Text>
          <Text style={styles.summaryLabel}>Дней</Text>
        </View>
      </View>
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
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 11,
  },

  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  yAxis: {
    width: 34,
    height: 100 + 22 + 14 + 20, 
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
    paddingBottom: 22 + 14 + 6, 
    paddingTop: 12,
  },
  yLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 9,
  },
  chartArea: {
    flex: 1,
    height: 100 + 22 + 14 + 20,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.45,
  },
  barsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '700',
    height: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  barTrack: {
    width: 20,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  dayLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  summaryNum: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 10,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
    alignSelf: 'stretch',
  },

  // Placeholder
  placeholderContainer: {
    height: 140,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  placeholderText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
