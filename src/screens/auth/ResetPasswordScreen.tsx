import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity,
  Alert, Keyboard, TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface ResetPasswordScreenProps {
  navigation: any;
  route: { params: { email: string; prefillCode?: string } };
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { email, prefillCode } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (prefillCode && prefillCode.length === 6) {
      setCode(prefillCode.split(''));
    }
  }, [prefillCode]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleReset = async () => {
    Keyboard.dismiss();
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setError('Введите 6-значный код');
      return;
    }
    if (!newPassword) {
      setError('Введите новый пароль');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        email,
        code: fullCode,
        newPassword,
      });
      Alert.alert(
        'Готово',
        'Пароль успешно изменён. Войдите с новым паролем.',
        [{ text: 'Войти', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный код или срок действия истёк');
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
              <Feather name="mail" size={48} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Проверьте почту</Text>
            <Text style={styles.subtitle}>
              Мы отправили код подтверждения на{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Поля для 6-значного кода */}
            <Text style={styles.codeLabel}>Код подтверждения</Text>
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => { if (ref) inputs.current[index] = ref; }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(v) => handleCodeChange(v.replace(/[^0-9]/g, '').slice(-1), index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            <Input
              label="Новый пароль"
              placeholder="Минимум 6 символов"
              value={newPassword}
              onChangeText={(t) => { setNewPassword(t); setError(''); }}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            <Input
              label="Подтверждение пароля"
              placeholder="Повторите новый пароль"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            <Button
              title="Сменить пароль"
              onPress={handleReset}
              loading={loading}
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.resendText}>Отправить код повторно</Text>
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
  emailText: {
    color: COLORS.primary,
    fontWeight: '600',
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
  codeLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  codeInput: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },
  button: { marginTop: SPACING.sm },
  resendButton: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  resendText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '500',
  },
});