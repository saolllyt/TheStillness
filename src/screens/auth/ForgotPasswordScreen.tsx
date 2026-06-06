import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity,
  Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    Keyboard.dismiss();

    if (!email.trim()) {
      setError('Введите email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('Введите корректный email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      // Код отправлен на почту и переходим на экран ввода 
      navigation.navigate('ResetPassword', { email: email.trim() });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка сервера');
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Feather name="lock" size={48} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Забыли пароль?</Text>
            <Text style={styles.subtitle}>
              Введите email вашего аккаунта и мы отправим код для сброса пароля
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              placeholder="Введите ваш email"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Button
              title="Отправить код"
              onPress={handleSend}
              loading={loading}
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>Вернуться к входу</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
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
  backButton: {
    width: 40, height: 40,
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 96, height: 96,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl * 1.5,
    lineHeight: 24,
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
  button: { marginTop: SPACING.sm },
  backToLogin: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  backToLoginText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
});