import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';

interface ReportCardProps {
  onGenerateReport: (startDate: Date, endDate: Date) => Promise<number | void>;
}

export const ReportCard: React.FC<ReportCardProps> = ({ onGenerateReport }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const getLastWeekDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(start);
    setEndDate(end);
  };

  const getCurrentMonthDates = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    setStartDate(start);
    setEndDate(end);
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
      <Text style={styles.title}>Отчеты</Text>
      
      <View style={styles.quickPeriods}>
        <TouchableOpacity style={styles.periodButton} onPress={getLastWeekDates}>
          <Text style={styles.periodButtonText}>Неделя</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.periodButton} onPress={getCurrentMonthDates}>
          <Text style={styles.periodButtonText}>Месяц</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateRange}>
        <Text style={styles.dateRangeText}>
          {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')}
        </Text>
      </View>

      <Button
        title="Сформировать отчет"
        onPress={handleGenerateReport}
        variant="secondary"
        size="medium"
        style={styles.generateButton}
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
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  quickPeriods: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  periodButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  periodButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dateRange: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  dateRangeText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
  generateButton: {
    marginBottom: SPACING.md,
  },
});