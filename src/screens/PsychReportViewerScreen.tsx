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
    ? new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  const section = (title: string, content: string) => `
    <div class="card">
      <div class="card-title">${title}</div>
      <div class="card-body">${content
        ? content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        : '<span class="empty">Не заполнено</span>'
      }</div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size:14px; color:#1c1c1e; background:#f2f4f8; }
  .wrap { max-width:680px; margin:0 auto; padding:20px 16px 40px; }

  .app-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
  .app-name { font-size:18px; font-weight:700; color:#1b4f8a; }
  .report-date { font-size:12px; color:#888; }

  .hero { background:#1b4f8a; border-radius:16px; padding:20px; margin-bottom:16px; color:#fff; }
  .hero-label { font-size:12px; opacity:0.8; margin-bottom:6px; }
  .hero-title { font-size:20px; font-weight:700; margin-bottom:14px; }
  .hero-meta { display:flex; flex-wrap:wrap; gap:10px; }
  .hero-pill { background:rgba(255,255,255,0.15); border-radius:8px; padding:6px 12px; font-size:12px; }
  .hero-pill span { display:block; font-size:10px; opacity:0.7; margin-bottom:2px; }

  .card { background:#fff; border-radius:12px; padding:16px; margin-bottom:10px; }
  .card-title { font-size:12px; font-weight:600; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; }
  .card-body { font-size:14px; line-height:1.7; color:#1c1c1e; white-space:pre-wrap; }
  .empty { color:#bbb; font-style:italic; font-size:13px; }

  .footer-line { text-align:center; font-size:11px; color:#c0c0c5; margin-top:24px; }
</style>
</head>
<body>
<div class="wrap">

  <div class="app-header">
    <div class="app-name">TheStillness</div>
    <div class="report-date">${today}</div>
  </div>

  <div class="hero">
    <div class="hero-label">Психологическое заключение</div>
    <div class="hero-title">${patientName}</div>
    <div class="hero-meta">
      <div class="hero-pill"><span>Дата консультации</span>${fmt(report.report_date)}</div>
      <div class="hero-pill"><span>Специалист</span>${
        report.psych_first_name
          ? (report.psych_first_name + ' ' + (report.psych_last_name || '')).trim()
          : (report.psych_name || '—')
      }</div>
    </div>
  </div>

  ${section('Жалобы и запрос', report.complaints || '')}
  ${section('Анамнез', report.anamnesis || '')}
  ${section('Результаты обследования', report.examinations || '')}
  ${section('Рекомендации', report.recommendations || '')}

  <div class="footer-line">Сформировано в приложении TheStillness</div>

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