import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { EmotionPicker } from '../../components/diary/EmotionPicker';
import { Button } from '../../components/common/Button';
import api from '../../services/api/client';

interface SelectedEmotion {
  emotionId: number;
  emotionName?: string;
  intensity?: number;
}

interface DiaryEntryScreenProps {
  navigation: any;
  route: any;
}

export const DiaryEntryScreen: React.FC<DiaryEntryScreenProps> = ({ navigation, route }) => {
  const entryId = route.params?.id;
  const isEditing = !!entryId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    entry_date: new Date(),
    situation_place: '',
    situation_description: '',
    thoughts: '',
    reaction_description: '',
    selected_emotions: [] as SelectedEmotion[],
  });

  useEffect(() => {
    if (isEditing) {
      loadEntry();
    }
  }, [entryId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/diary/${entryId}`);
      const entry = response.data.data;
      
      setFormData({
        entry_date: new Date(entry.entry_date),
        situation_place: entry.situation_place || '',
        situation_description: entry.situation_description,
        thoughts: entry.thoughts,
        reaction_description: entry.reaction_description,
        selected_emotions: entry.selected_emotions || [],
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить запись');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, entry_date: selectedDate }));
    }
  };

  const handleToggleEmotion = (emotion: any) => {
    setFormData(prev => {
      const exists = prev.selected_emotions.some(e => e.emotionId === emotion.id);
      
      if (exists) {
        return {
          ...prev,
          selected_emotions: prev.selected_emotions.filter(e => e.emotionId !== emotion.id)
        };
      } else {
        return {
          ...prev,
          selected_emotions: [
            ...prev.selected_emotions,
            { 
              emotionId: emotion.id, 
              emotionName: emotion.name,
              intensity: 3 
            }
          ]
        };
      }
    });
  };

  const handleIntensityChange = (emotionId: number, intensity: number) => {
    setFormData(prev => ({
      ...prev,
      selected_emotions: prev.selected_emotions.map(e =>
        e.emotionId === emotionId ? { ...e, intensity } : e
      )
    }));
  };

  const validateForm = () => {
    if (!formData.situation_description.trim()) {
      Alert.alert('Ошибка', 'Опишите ситуацию');
      return false;
    }
    if (!formData.thoughts.trim()) {
      Alert.alert('Ошибка', 'Опишите ваши мысли');
      return false;
    }
    if (!formData.reaction_description.trim()) {
      Alert.alert('Ошибка', 'Опишите ваши действия');
      return false;
    }
    if (formData.selected_emotions.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одну эмоцию');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = {
        entry_date: format(formData.entry_date, 'yyyy-MM-dd'),
        situation_place: formData.situation_place || null,
        situation_description: formData.situation_description,
        thoughts: formData.thoughts,
        reaction_description: formData.reaction_description,
        selected_emotions: formData.selected_emotions.map(e => ({
          emotionId: e.emotionId,
          emotionName: e.emotionName,
          intensity: e.intensity
        })),
      };

      if (isEditing) {
        await api.put(`/diary/${entryId}`, data);
        Alert.alert('Успешно', 'Запись обновлена');
      } else {
        await api.post('/diary', data);
        Alert.alert('Успешно', 'Запись создана');
      }
      
      navigation.navigate('DiaryMain', { refresh: true });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить запись');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Редактировать запись' : 'Новая запись'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateLabel}>Дата:</Text>
            <Text style={styles.dateValue}>
              {format(formData.entry_date, 'd MMMM yyyy', { locale: ru })}
            </Text>
            <Feather name="calendar" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.entry_date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Место (необязательно)</Text>
            <TextInput
              style={styles.input}
              value={formData.situation_place}
              onChangeText={(text) => setFormData(prev => ({ ...prev, situation_place: text }))}
              placeholder="Где это произошло?"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Ситуация <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.situation_description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, situation_description: text }))}
              placeholder="Опишите ситуацию..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Мысли <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.thoughts}
              onChangeText={(text) => setFormData(prev => ({ ...prev, thoughts: text }))}
              placeholder="Какие мысли возникли?"
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <EmotionPicker
            selectedEmotions={formData.selected_emotions}
            onToggleEmotion={handleToggleEmotion}
            onIntensityChange={handleIntensityChange}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Действия <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.reaction_description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, reaction_description: text }))}
              placeholder="Что вы сделали?"
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Отмена"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
              style={styles.cancelButton}
            />
            <Button
              title={isEditing ? 'Сохранить' : 'Создать'}
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              size="medium"
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  dateLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
    marginRight: SPACING.sm,
  },
  dateValue: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: '500',
    flex: 1,
  },
  fieldContainer: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  textArea: {
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});