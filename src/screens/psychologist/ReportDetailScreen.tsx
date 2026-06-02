import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface ReportDetailScreenProps {
  navigation: any;
  route: { params: { reportId: number } };
}

const buildHtml = (report: any): string => {
  const formatD = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const patientName = report.patient_first_name
    ? `${report.patient_first_name} ${report.patient_last_name || ''}`.trim()
    : report.patient_email;

  const psychName = report.psych_first_name
    ? `${report.psych_first_name} ${report.psych_last_name || ''}`.trim()
    : '—';

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: sans-serif; font-size: 14px; color: #1a1a2e; background: #fff; padding: 24px; }
    .header { border-bottom: 2px solid #2C3F70; padding-bottom: 16px; margin-bottom: 20px; text-align: center; }
    .org { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .doc-title { font-size: 20px; font-weight: bold; color: #2C3F70; margin-bottom: 4px; }
    .doc-sub { font-size: 11px; color: #888; }
    .meta { background: #f5f7fa; border: 1px solid #dce3f0; border-radius: 6px; padding: 14px; margin-bottom: 20px; }
    .meta-row { display: flex; padding: 6px 0; border-bottom: 1px solid #eef0f5; }
    .meta-row:last-child { border-bottom: none; }
    .meta-label { color: #888; font-size: 12px; width: 180px; flex-shrink: 0; }
    .meta-value { color: #1a1a2e; font-weight: 600; font-size: 13px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 12px; font-weight: bold; color: #2C3F70; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #dce3f0; padding-bottom: 6px; margin-bottom: 10px; }
    .section-content { background: #f9fafc; border-left: 3px solid #2C3F70; padding: 12px 14px; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.6; color: #333; white-space: pre-wrap; }
    .empty { color: #aaa; font-style: italic; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #dce3f0; display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }
  </style>
</head>
<body>
  <div class="header">
    <div class="org">TheStillness — Система психологической поддержки</div>
    <div class="doc-title">РЕЗУЛЬТАТ МОНИТОРИНГА</div>
    <div class="doc-sub">Психологическое заключение</div>
  </div>
  <div class="meta">
    <div class="meta-row">
      <div class="meta-label">Дата составления:</div>
      <div class="meta-value">${formatD(report.report_date)}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">ФИО пациента:</div>
      <div class="meta-value">${patientName}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">ФИО психолога:</div>
      <div class="meta-value">${psychName}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Дата формирования:</div>
      <div class="meta-value">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Жалобы</div>
    <div class="section-content">${report.complaints || '<span class="empty">Не указано</span>'}</div>
  </div>
  <div class="section">
    <div class="section-title">Анамнез заболевания</div>
    <div class="section-content">${report.anamnesis || '<span class="empty">Не указано</span>'}</div>
  </div>
  <div class="section">
    <div class="section-title">Проведённые обследования</div>
    <div class="section-content">${report.examinations || '<span class="empty">Не указано</span>'}</div>
  </div>
  <div class="section">
    <div class="section-title">Рекомендации</div>
    <div class="section-content">${report.recommendations || '<span class="empty">Не указано</span>'}</div>
  </div>
  <div class="footer">
    <span>Сформировано системой TheStillness</span>
    <span>${new Date().toLocaleString('ru-RU')}</span>
  </div>
</body>
</html>`;
};

export const ReportDetailScreen: React.FC<ReportDetailScreenProps> = ({ navigation, route }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [sending, setSending] = useState(false);
  const [html, setHtml] = useState('');
  const [showActions, setShowActions] = useState(false);

  useEffect(() => { loadReport(); }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/psychologist-reports/${reportId}`);
      const data = response.data.data;
      setReport(data);
      setHtml(buildHtml(data));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить отчёт', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!report || !html) return;
    setShowActions(false);
    try {
      setSharing(true);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const patientName = (report.patient_first_name || 'patient').replace(/\s+/g, '_');
      const dateStr = new Date(report.report_date).toISOString().split('T')[0];

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `report-${patientName}-${dateStr}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться отчётом');
    } finally {
      setSharing(false);
    }
  };

  const handleSendToPatient = async () => {
    setShowActions(false);
    Alert.alert(
      'Отправить пациенту',
      `Отправить отчёт пациенту ${report?.patient_first_name || report?.patient_email} в чат?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: async () => {
            try {
              setSending(true);
              await api.post(`/psychologist-reports/${reportId}/send`);
              Alert.alert('Успешно', 'Отчёт отправлен пациенту в чат');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отправить отчёт');
            } finally {
              setSending(false);
            }
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert('Удалить отчёт', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/psychologist-reports/${reportId}`);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Ошибка', 'Не удалось удалить отчёт');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Отчёт</Text>
        <TouchableOpacity
          onPress={() => setShowActions(true)}
          style={styles.headerBtn}
          disabled={loading || sharing || sending}
        >
          {sharing || sending
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Feather name="more-vertical" size={22} color={COLORS.primary} />
          }
        </TouchableOpacity>
      </View>

      {/* Контент */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загружаем отчёт...</Text>
        </View>
      ) : html ? (
        <WebView
          source={{ html }}
          style={styles.webview}
          showsVerticalScrollIndicator={true}
          originWhitelist={['*']}
          javaScriptEnabled={false}
        />
      ) : null}

      {/* Меню действий */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.actionsSheet}>
            <View style={styles.actionsHandle} />

            <Text style={styles.actionsTitle}>Действия с отчётом</Text>

            {/* Информация об отчёте */}
            {report && (
              <View style={styles.reportInfo}>
                <Text style={styles.reportInfoName}>
                  {report.patient_first_name
                    ? `${report.patient_first_name} ${report.patient_last_name || ''}`.trim()
                    : report.patient_email}
                </Text>
                <Text style={styles.reportInfoDate}>
                  {new Date(report.report_date).toLocaleDateString('ru-RU')}
                </Text>
              </View>
            )}

            {/* Отправить пациенту */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleSendToPatient}
            >
              <View style={[styles.actionItemIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Feather name="send" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.actionItemInfo}>
                <Text style={styles.actionItemTitle}>Отправить пациенту</Text>
                <Text style={styles.actionItemSub}>Отправить в чат с пациентом</Text>
              </View>
            </TouchableOpacity>

            {/* Поделиться PDF */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleShare}
            >
              <View style={[styles.actionItemIcon, { backgroundColor: '#4A7A6C20' }]}>
                <Feather name="share-2" size={20} color="#4A7A6C" />
              </View>
              <View style={styles.actionItemInfo}>
                <Text style={styles.actionItemTitle}>Поделиться PDF</Text>
                <Text style={styles.actionItemSub}>Экспортировать и отправить файл</Text>
              </View>
            </TouchableOpacity>

            {/* Удалить */}
            <TouchableOpacity
              style={[styles.actionItem, styles.actionItemDanger]}
              onPress={handleDelete}
            >
              <View style={[styles.actionItemIcon, { backgroundColor: COLORS.error + '20' }]}>
                <Feather name="trash-2" size={20} color={COLORS.error} />
              </View>
              <View style={styles.actionItemInfo}>
                <Text style={[styles.actionItemTitle, { color: COLORS.error }]}>Удалить отчёт</Text>
                <Text style={styles.actionItemSub}>Удалить без возможности восстановления</Text>
              </View>
            </TouchableOpacity>

            {/* Отмена */}
            <TouchableOpacity
              style={styles.cancelAction}
              onPress={() => setShowActions(false)}
            >
              <Text style={styles.cancelActionText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
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
  headerBtn: { padding: SPACING.sm },
  title: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  webview: { flex: 1 },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md,
  },
  loadingText: { ...TYPOGRAPHY.body2, color: COLORS.textLight },
  // Модалка действий
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionsSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    ...SHADOWS.large,
  },
  actionsHandle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  actionsTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  reportInfo: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  reportInfoName: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  reportInfoDate: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  actionItemDanger: { borderBottomWidth: 0 },
  actionItemIcon: {
    width: 44, height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItemInfo: { flex: 1 },
  actionItemTitle: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '600' },
  actionItemSub: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  cancelAction: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
  },
  cancelActionText: { ...TYPOGRAPHY.body1, color: COLORS.textLight, fontWeight: '500' },
});