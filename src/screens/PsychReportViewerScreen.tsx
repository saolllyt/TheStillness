import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';

interface PsychReportViewerScreenProps {
  navigation: any;
  route: {
    params: {
      report: {
        id: number;
        report_date: string;
        complaints: string;
        anamnesis: string;
        examinations: string;
        recommendations: string;
        psych_name: string | null;
        patient_first_name?: string;
        patient_last_name?: string;
        patient_email?: string;
      };
      patientName?: string;
    };
  };
}

const buildHtml = (report: any, patientName: string): string => {
  const fmt = (d: string) => d
    ? new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  const today   = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const docNum  = `ПЗ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  const section = (num: string, title: string, content: string) => `
    <div class="section">
      <div class="section-head">${num}. ${title.toUpperCase()}</div>
      <div class="section-body">${content || '<span class="empty">Сведения не предоставлены</span>'}</div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size:13px; color:#111; background:#fff; padding:24px 28px; }

  /* Шапка */
  .letterhead { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #2C3F70; padding-bottom:14px; margin-bottom:18px; }
  .org-name { font-size:11px; font-weight:bold; color:#2C3F70; text-transform:uppercase; letter-spacing:1.2px; }
  .org-sub  { font-size:10px; color:#666; margin-top:3px; }
  .doc-num  { font-size:10px; color:#888; text-align:right; line-height:1.6; }
  .doc-num b { color:#2C3F70; }

  /* Заголовок */
  .title-block { text-align:center; margin-bottom:20px; padding:14px; border:1px solid #d0d8ec; background:#f9fafc; }
  .doc-title { font-size:15px; font-weight:bold; color:#1a1a2e; text-transform:uppercase; letter-spacing:0.6px; }
  .doc-sub   { font-size:11px; color:#666; margin-top:4px; font-style:italic; }

  /* Реквизиты */
  .requisites { width:100%; border-collapse:collapse; margin-bottom:20px; }
  .requisites tr:first-child td { border-top:1px solid #c8d1e8; }
  .requisites td { padding:6px 12px; border-bottom:1px solid #e0e6f0; font-size:12px; }
  .requisites td.label { background:#eef1f8; color:#444; font-weight:bold; font-size:11px; text-transform:uppercase; letter-spacing:0.3px; width:40%; }

  /* Секции */
  .section { margin-bottom:18px; }
  .section-head { font-size:11px; font-weight:bold; color:#fff; background:#2C3F70; padding:5px 10px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0; }
  .section-body { border:1px solid #d0d8ec; border-top:none; padding:12px 14px; font-size:13px; line-height:1.7; color:#1a1a2e; white-space:pre-wrap; min-height:48px; }
  .empty { color:#bbb; font-style:italic; font-size:12px; }

  /* Подпись */
  .signatures { display:flex; justify-content:space-between; margin-top:32px; padding-top:16px; border-top:1px solid #d0d8ec; }
  .sig { flex:1; }
  .sig.right { text-align:right; }
  .sig-label { font-size:10px; color:#888; margin-bottom:20px; }
  .sig-line  { border-bottom:1px solid #333; display:block; width:180px; margin-bottom:4px; }
  .sig-line.right-line { margin-left:auto; }
  .sig-name  { font-size:11px; color:#444; }

  .footer { margin-top:14px; font-size:9px; color:#ccc; text-align:center; border-top:1px solid #eee; padding-top:8px; }
</style>
</head>
<body>

<div class="letterhead">
  <div>
    <div class="org-name">TheStillness</div>
    <div class="org-sub">Сервис психологической поддержки и мониторинга</div>
  </div>
  <div class="doc-num">
    № <b>${docNum}</b><br>
    Дата: <b>${today}</b>
  </div>
</div>

<div class="title-block">
  <div class="doc-title">Психологическое заключение</div>
  <div class="doc-sub">по результатам наблюдения и консультации</div>
</div>

<table class="requisites">
  <tr><td class="label">Дата консультации</td><td>${fmt(report.report_date)}</td></tr>
  <tr><td class="label">Ф.И.О. клиента</td><td>${patientName}</td></tr>
  <tr><td class="label">Специалист</td><td>${report.psych_name || '—'}</td></tr>
  <tr><td class="label">Дата составления</td><td>${today}</td></tr>
</table>

${section('1', 'Жалобы и запрос клиента', report.complaints || '')}
${section('2', 'Анамнез', report.anamnesis || '')}
${section('3', 'Результаты обследования', report.examinations || '')}
${section('4', 'Рекомендации специалиста', report.recommendations || '')}

<div class="signatures">
  <div class="sig">
    <div class="sig-label">Специалист-психолог</div>
    <div class="sig-line"></div>
    <div class="sig-name">${report.psych_name || '________________'}</div>
  </div>
  <div class="sig right">
    <div class="sig-label">Дата выдачи</div>
    <div class="sig-line right-line"></div>
    <div class="sig-name">${today}</div>
  </div>
</div>

<div class="footer">
  Заключение сформировано в системе TheStillness · Носит рекомендательный характер · Конфиденциально
</div>

</body>
</html>`;
};

export const PsychReportViewerScreen: React.FC<PsychReportViewerScreenProps> = ({ navigation, route }) => {
  const { report, patientName: paramPatientName } = route.params;
  const [sharing, setSharing] = useState(false);

  const resolvedPatientName =
    paramPatientName ||
    (report.patient_first_name
      ? `${report.patient_first_name} ${report.patient_last_name || ''}`.trim()
      : report.patient_email) ||
    '—';

  const html = buildHtml(report, resolvedPatientName);

  const handleShare = async () => {
    try {
      setSharing(true);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const dateStr = new Date(report.report_date).toISOString().split('T')[0];
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `report-monitoring-${dateStr}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться отчётом');
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Отчёт психолога</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerBtn} disabled={sharing}>
          {sharing
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Feather name="share-2" size={20} color={COLORS.primary} />
          }
        </TouchableOpacity>
      </View>

      <WebView
        source={{ html }}
        style={styles.webview}
        showsVerticalScrollIndicator={true}
        originWhitelist={['*']}
        javaScriptEnabled={false}
      />
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
    borderBottomColor: '#E8EBED',
    ...SHADOWS.small,
  },
  headerBtn: { padding: SPACING.sm },
  title: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  webview: { flex: 1 },
});