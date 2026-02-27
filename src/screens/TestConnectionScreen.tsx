//файл нужен для логгирования, если сервер отлетит
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api/client';
import { COLORS, SPACING } from '../constants/theme';

export const TestConnectionScreen = () => {
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 10));
  };

  const testHealth = async () => {
    try {
      addLog('🔄 Тестируем /health...');
      const response = await api.get('/health');
      addLog(`✅ Успех! Статус: ${response.status}`);
      addLog(`📦 Данные: ${JSON.stringify(response.data)}`);
      setStatus('✅ Сервер работает!');
    } catch (error: any) {
      addLog(`❌ Ошибка: ${error.message}`);
      setStatus('❌ Сервер не отвечает');
    }
  };

  const testDb = async () => {
    try {
      addLog('🔄 Тестируем БД...');
      const response = await api.get('/health');
      addLog(`✅ БД подключена: ${response.data.message}`);
    } catch (error: any) {
      addLog(`❌ Ошибка БД: ${error.message}`);
    }
  };

  const testRegister = async () => {
    try {
      addLog('🔄 Тестируем регистрацию...');
      const testEmail = `test${Date.now()}@example.com`;
      const response = await api.post('/auth/register', {
        email: testEmail,
        password: '123456',
        firstName: 'Тест',
        lastName: 'Пользователь'
      });
      addLog(`✅ Регистрация успешна!`);
      addLog(`👤 Email: ${response.data.user.email}`);
    } catch (error: any) {
      addLog(`❌ Ошибка регистрации: ${error.message}`);
      if (error.response) {
        addLog(`📝 Ответ сервера: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔌 Тест подключения</Text>
        <Text style={styles.subtitle}>API URL: {api.defaults.baseURL}</Text>
        
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{status || 'Ожидание теста...'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={testHealth}>
            <Text style={styles.buttonText}>🏥 Тест /health</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testDb}>
            <Text style={styles.buttonText}>🗄️ Тест БД</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={testRegister}>
            <Text style={styles.buttonText}>📝 Тест регистрации</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logsContainer}>
          <Text style={styles.logsTitle}>📋 Логи:</Text>
          {logs.map((log, i) => (
            <Text key={i} style={styles.log}>{log}</Text>
          ))}
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Проверьте:</Text>
          <Text style={styles.tip}>1. Сервер запущен? (npm run dev)</Text>
          <Text style={styles.tip}>2. URL в client.ts: {api.defaults.baseURL}</Text>
          <Text style={styles.tip}>3. Брандмауэр не блокирует порт 3001</Text>
          <Text style={styles.tip}>4. Для Android эмулятора используйте 10.0.2.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  statusBox: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.xl,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  log: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontFamily: 'monospace',
  },
  tipContainer: {
    backgroundColor: COLORS.secondary + '30',
    padding: SPACING.lg,
    borderRadius: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tip: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
});