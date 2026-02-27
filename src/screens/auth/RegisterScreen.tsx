import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await signUp(email, password, firstName, lastName);

    if (!result.success) {
      setErrors({ general: result.message });
      Alert.alert('Ошибка регистрации', result.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Создать аккаунт</Text>
              <Text style={styles.subtitle}>
                Зарегистрируйтесь, чтобы начать использовать TheStillness
              </Text>
            </View>

            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

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
                label="Пароль"
                placeholder="Создайте пароль"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry={true}
              />

              <Input
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry={true}
              />

              <Button
                title="Зарегистрироваться"
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
        </TouchableWithoutFeedback>
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
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
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
  generalErrorContainer: {
    backgroundColor: COLORS.error + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  generalErrorText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  nameInput: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  registerButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  loginLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});