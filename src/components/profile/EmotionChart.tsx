import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface EmotionChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

export const EmotionChart: React.FC<EmotionChartProps> = ({ 
  data, 
  title = 'Соотношение эмоций за неделю' 
}) => {
  const screenWidth = Dimensions.get('window').width - SPACING.xl * 2;

  const hasData = data.values.some(value => value > 0);

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Нет данных за эту неделю{'\n'}
            Добавьте эмоции в трекере
          </Text>
        </View>
      </View>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      color: (opacity = 1) => `rgba(44, 63, 112, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(44, 63, 112, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
            style: {
              borderRadius: BORDER_RADIUS.md,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: COLORS.primary,
              fill: COLORS.white,
            },
            propsForLabels: {
              ...TYPOGRAPHY.caption,
            },
            formatYLabel: (value) => `${Math.round(Number(value))}%`,
          }}
          bezier
          style={styles.chart}
          formatYLabel={(value) => `${Math.round(Number(value))}%`}
          segments={4}
          fromZero={true}
          yAxisInterval={25}
          yAxisSuffix="%"
        />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>Процент хороших эмоций</Text>
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
    marginBottom: SPACING.md,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  placeholderContainer: {
    height: 150,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  placeholderText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.xs,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
});