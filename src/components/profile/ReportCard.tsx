import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';

interface ReportCardProps {
  onGenerateReport: (startDate: Date, endDate: Date) => Promise<number | void>;
}

export const ReportCard: React.FC<ReportCardProps> = ({ onGenerateReport }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | null>(null);

  const getLastWeekDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(start);
    setEndDate(end);
    setSelectedPeriod('week');
  };

  const getCurrentMonthDates = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    setStartDate(start);
    setEndDate(end);
    setSelectedPeriod('month');
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      await onGenerateReport(startDate, endDate);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сгенерировать отчет');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Отчёты</Text>

      {/* выделение выбранного периода */}
      <View style={styles.quickPeriods}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={getLastWeekDates}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
            Неделя
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={getCurrentMonthDates}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
            Месяц
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateRange}>
        <Text style={styles.dateRangeText}>
          {format(startDate, 'dd.MM.yyyy')} — {format(endDate, 'dd.MM.yyyy')}
        </Text>
      </View>

      {/* единый стиль кнопки */}
      <Button
        title="Сформировать отчёт"
        onPress={handleGenerateReport}
        variant="primary"
        size="large"
        loading={loading}
        disabled={loading}
      />
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
  title: { ...TYPOGRAPHY.h4, color: COLORS.primary, marginBottom: SPACING.md },
  quickPeriods: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  dateRange: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  dateRangeText: { ...TYPOGRAPHY.body2, color: COLORS.text },
});