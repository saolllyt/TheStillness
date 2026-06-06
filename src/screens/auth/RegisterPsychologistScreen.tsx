import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity, Alert, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import api from '../../services/api/client';

interface RegisterPsychologistScreenProps {
  navigation: any;
}

export const RegisterPsychologistScreen: React.FC<RegisterPsychologistScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    specialization?: string;
    licenseNumber?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email обязателен';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) newErrors.email = 'Введите корректный email';
    if (!password) newErrors.password = 'Пароль обязателен';
    else if (password.includes(' ')) newErrors.password = 'Пароль не должен содержать пробелы';
    else if (password.length < 6) newErrors.password = 'Минимум 6 символов';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!specialization) newErrors.specialization = 'Укажите специализацию';
    if (!licenseNumber) newErrors.licenseNumber = 'Укажите номер лицензии';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/register/psychologist', {
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        specialization,
        licenseNumber,
      });
      Alert.alert(
        'Заявка отправлена',
        'Ваша заявка на регистрацию принята. Когда в профиле увидите статус «Верифицирован» — сможете начать работу с пациентами.',
        [{ text: 'Войти', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      setErrors({ general: message });
      Alert.alert('Ошибка', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Регистрация психолога</Text>
            <Text style={styles.subtitle}>
              Заполните данные для регистрации как специалист
            </Text>
          </View>

          {errors.general ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameInput}>
                <Input
                  label="Имя"
                  placeholder="Ваше имя"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.nameInput}>
                <Input
                  label="Фамилия"
                  placeholder="Ваша фамилия"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <Input
              label="Email"
              placeholder="Введите ваш email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Специализация"
              placeholder="Например: КПТ, психоанализ"
              value={specialization}
              onChangeText={setSpecialization}
              error={errors.specialization}
              autoCapitalize="sentences"
            />

            <Input
              label="Номер лицензии"
              placeholder="Например: LIC-12345"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              error={errors.licenseNumber}
              autoCapitalize="characters"
            />

            <Input
              label="Пароль"
              placeholder="Минимум 6 символов"
              value={password}
              onChangeText={(t) => setPassword(t.replace(/\s/g, ''))}
              error={errors.password}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            <Input
              label="Подтверждение пароля"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChangeText={(t) => setConfirmPassword(t.replace(/\s/g, ''))}
              error={errors.confirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            <Button
              title="Отправить заявку"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Уже есть аккаунт? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Войти</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.error + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  errorText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    textAlign: 'center',
  },
  form: { marginBottom: SPACING.xl },
  nameRow: { flexDirection: 'row', gap: SPACING.sm },
  nameInput: { flex: 1 },
  registerButton: { marginTop: SPACING.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  footerText: { ...TYPOGRAPHY.body2, color: COLORS.textLight },
  loginLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});