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

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await signIn(email, password);

    if (!result.success) {
      setErrors({ general: result.message });
      Alert.alert('Ошибка входа', result.message);
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
              <Text style={styles.title}>С возвращением</Text>
              <Text style={styles.subtitle}>
                Войдите в свой аккаунт, чтобы продолжить
              </Text>
            </View>

            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            <View style={styles.form}>
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
                placeholder="Введите ваш пароль"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry={true}
              />

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Восстановление пароля', 'Функция будет доступна в следующем обновлении')}
              >
                <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
              </TouchableOpacity>

              <Button
                title="Войти"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Нет аккаунта? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Зарегистрироваться</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: SPACING.sm,
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
  registerLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});