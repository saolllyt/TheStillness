import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

interface CreateReportScreenProps {
  navigation: any;
  route: {
    params: {
      patient: any;
    };
  };
}

export const CreateReportScreen: React.FC<CreateReportScreenProps> = ({ navigation, route }) => {
  const { patient } = route.params;
  const { user } = useAuth();

  const [reportDate, setReportDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [complaints, setComplaints] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [examinations, setExaminations] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [saving, setSaving] = useState(false);

  const getPatientName = () => {
    if (patient.first_name || patient.last_name) {
      return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    }
    return patient.email;
  };

  const getPsychName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.email || '';
  };

  const handleSave = async () => {
    if (!complaints.trim()) {
      Alert.alert('Ошибка', 'Заполните поле "Жалобы"');
      return;
    }
    if (!recommendations.trim()) {
      Alert.alert('Ошибка', 'Заполните поле "Рекомендации"');
      return;
    }

    try {
      setSaving(true);
      await api.post('/psychologist-reports', {
        patientId: patient.id,
        reportDate: format(reportDate, 'yyyy-MM-dd'),
        complaints: complaints.trim(),
        anamnesis: anamnesis.trim(),
        examinations: examinations.trim(),
        recommendations: recommendations.trim(),
      });
      Alert.alert('Успешно', 'Отчёт сохранён', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить отчёт');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      label: 'Жалобы *',
      value: complaints,
      setter: setComplaints,
      placeholder: 'Опишите жалобы пациента...',
      icon: 'alert-circle' as const,
    },
    {
      label: 'Анамнез заболевания',
      value: anamnesis,
      setter: setAnamnesis,
      placeholder: 'История заболевания, предшествующее лечение...',
      icon: 'clock' as const,
    },
    {
      label: 'Проведённые обследования',
      value: examinations,
      setter: setExaminations,
      placeholder: 'Методы диагностики, результаты тестов...',
      icon: 'search' as const,
    },
    {
      label: 'Рекомендации *',
      value: recommendations,
      setter: setRecommendations,
      placeholder: 'Рекомендации по лечению и дальнейшей работе...',
      icon: 'check-circle' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Новый отчёт</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.docHeader}>
            <Text style={styles.docTitle}>РЕЗУЛЬТАТ МОНИТОРИНГА</Text>
            <Text style={styles.docSubtitle}>Психологическое заключение</Text>
          </View>

          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Дата:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateValue}>
                  {format(reportDate, 'd MMMM yyyy', { locale: ru })}
                </Text>
                <Feather name="calendar" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={reportDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setReportDate(date);
                }}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>ФИО пациента:</Text>
              <Text style={styles.metaValue}>{getPatientName()}</Text>
            </View>

            <View style={[styles.metaRow, styles.metaRowLast]}>
              <Text style={styles.metaLabel}>ФИО психолога:</Text>
              <Text style={styles.metaValue}>{getPsychName()}</Text>
            </View>
          </View>

          {fields.map(field => (
            <View key={field.label} style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <Feather name={field.icon} size={16} color={COLORS.primary} />
                <Text style={styles.fieldLabel}>{field.label}</Text>
              </View>
              <TextInput
                style={styles.fieldInput}
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ))}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Feather name="save" size={16} color={COLORS.white} />
                  <Text style={styles.saveBtnText}>Сохранить</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  backBtn: { padding: SPACING.sm },
  title: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 140,
  },
  docHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  docSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    marginTop: 4,
  },
  metaCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  metaRowLast: { borderBottomWidth: 0 },
  metaLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    width: 130,
    fontWeight: '500',
  },
  metaValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  dateValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  fieldGroup: { marginBottom: SPACING.lg },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  fieldInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
    ...SHADOWS.small,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cancelBtnText: { ...TYPOGRAPHY.body1, color: COLORS.textLight, fontWeight: '500' },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { ...TYPOGRAPHY.body1, color: COLORS.white, fontWeight: '600' },
});