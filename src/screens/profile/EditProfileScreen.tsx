import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await api.put('/profile/me', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (response.data.success) {
        // Обновляем имя 
        await updateUser({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
        });
        Alert.alert('Успешно', 'Профиль обновлён', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Ошибка', 'Введите текущий пароль');
      return;
    }
    if (!newPassword) {
      Alert.alert('Ошибка', 'Введите новый пароль');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Ошибка', 'Новый пароль должен быть не менее 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await api.put('/profile/password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        Alert.alert('Успешно', 'Пароль изменён');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      }
    } catch (error: any) {
      Alert.alert(
        'Ошибка',
        error.response?.data?.message || 'Не удалось изменить пароль'
      );
    } finally {
      setChangingPassword(false);
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
        >
          {/* Шапка */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Редактировать профиль</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Аватар */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {firstName?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.avatarEmail}>{user?.email}</Text>
          </View>

          {/* Личные данные */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Личные данные</Text>

            <Input
              label="Имя"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Введите имя"
              autoCapitalize="words"
            />

            <Input
              label="Фамилия"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Введите фамилию"
              autoCapitalize="words"
            />

            <Button
              title="Сохранить изменения"
              onPress={handleSaveProfile}
              loading={saving}
              disabled={saving}
              variant="primary"
              size="large"
            />
          </View>

          {/* Смена пароля */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPasswordSection(!showPasswordSection)}
            >
              <Text style={styles.sectionTitle}>Изменить пароль</Text>
              <Feather
                name={showPasswordSection ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            {showPasswordSection && (
              <View style={styles.passwordSection}>
                <Input
                  label="Текущий пароль"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Введите текущий пароль"
                  secureTextEntry
                />

                <Input
                  label="Новый пароль"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Минимум 6 символов"
                  secureTextEntry
                />

                <Input
                  label="Подтвердите новый пароль"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Повторите новый пароль"
                  secureTextEntry
                />

                <Button
  title="Изменить пароль"
  onPress={handleChangePassword}
  loading={changingPassword}
  disabled={changingPassword}
  variant="primary" 
  size="large"
/>
              </View>
            )}
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
  },
  avatarEmail: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  passwordToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordSection: {
    marginTop: SPACING.md,
  },
});