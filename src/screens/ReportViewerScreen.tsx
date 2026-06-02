import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../constants/theme';
import { generatePDF } from '../services/pdf.service';
import * as Sharing from 'expo-sharing';

interface ReportViewerScreenProps {
  navigation: any;
  route: {
    params: {
      reportData: any;
      userName: string;
      reportId: number;
    };
  };
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const EMOTION_NAMES: { [key: number]: string } = {
  1: 'Спокойствие', 2: 'Тревога', 3: 'Радость', 4: 'Грусть',
  5: 'Злость', 6: 'Страх', 7: 'Удивление', 8: 'Отвращение',
  9: 'Надежда', 10: 'Благодарность',
};

const buildHtml = (reportData: any, userName: string): string => {
  const { startDate, endDate, summary, emotions = [], diary = [] } = reportData;

  const docNum = `ТС-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const today  = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const totalPositiveRatio = summary?.totalEmotions > 0
    ? Math.round((summary.goodEmotions / summary.totalEmotions) * 100)
    : 0;

  const emotionRows = emotions.slice(0, 50).map((e: any, idx: number) => `
    <tr>
      <td style="color:#888;font-size:11px;">${idx + 1}</td>
      <td>${formatDateTime(e.created_at || e.created_date)}</td>
      <td><b>${EMOTION_NAMES[e.emotion_type_id] || '—'}</b></td>
      <td style="text-align:center;">${e.intensity ?? '—'} / 10</td>
    </tr>
  `).join('');

  const diaryRows = diary.slice(0, 30).map((d: any, idx: number) => `
    <tr>
      <td style="color:#888;font-size:11px;">${idx + 1}</td>
      <td>${formatDateTime(d.created_at)}</td>
      <td>${d.situation || '—'}</td>
      <td>${d.emotion_name || '—'}</td>
      <td>${d.behavior || '—'}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size:13px; color:#111; background:#fff; padding:24px 28px; }

  /* Шапка бланка */
  .letterhead { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; padding-bottom:14px; border-bottom:2px solid #2C3F70; }
  .org-block { flex:1; }
  .org-name   { font-size:11px; color:#2C3F70; text-transform:uppercase; letter-spacing:1.2px; font-weight:bold; margin-bottom:3px; }
  .org-sub    { font-size:10px; color:#666; }
  .doc-num    { font-size:10px; color:#888; text-align:right; }
  .doc-num b  { color:#2C3F70; }

  /* Заголовок документа */
  .doc-title-block { text-align:center; margin-bottom:20px; }
  .doc-title  { font-size:16px; font-weight:bold; color:#1a1a2e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
  .doc-conf   { font-size:10px; color:#888; font-style:italic; }

  /* Реквизиты */
  .requisites { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px; }
  .requisites td { padding:5px 10px; border:1px solid #d0d8ec; }
  .requisites td:first-child { background:#f2f5fb; color:#555; width:38%; font-weight:bold; font-size:11px; text-transform:uppercase; letter-spacing:0.3px; }
  .requisites td:last-child  { color:#1a1a2e; }

  /* Секция */
  .section { margin-bottom:22px; }
  .section-title {
    font-size:12px; font-weight:bold; color:#fff;
    background:#2C3F70; padding:5px 10px;
    text-transform:uppercase; letter-spacing:0.5px;
    margin-bottom:10px;
  }

  /* Карточки статистики */
  .stat-cards { display:flex; gap:10px; margin-bottom:14px; }
  .stat-card  { flex:1; border:1px solid #d0d8ec; border-radius:4px; padding:10px; text-align:center; }
  .stat-card .num { font-size:26px; font-weight:bold; color:#2C3F70; font-family:Arial,sans-serif; }
  .stat-card .lbl { font-size:10px; color:#777; margin-top:2px; }

  /* Прогресс-бар */
  .progress-wrap { margin-bottom:14px; }
  .progress-label { display:flex; justify-content:space-between; font-size:11px; color:#555; margin-bottom:4px; }
  .progress-track { height:10px; background:#eee; border-radius:5px; overflow:hidden; }
  .progress-fill  { height:100%; border-radius:5px; background: #4A7A6C; }

  /* Таблица показателей */
  .kpi-table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:12px; }
  .kpi-table td { padding:6px 10px; border-bottom:1px solid #eaedf5; }
  .kpi-table td:first-child { color:#555; }
  .kpi-table td:last-child  { font-weight:bold; color:#2C3F70; text-align:right; }

  /* Данные таблицы */
  table.data { width:100%; border-collapse:collapse; font-size:11px; }
  table.data th { background:#2C3F70; color:#fff; padding:6px 8px; font-weight:normal; font-size:10px; text-transform:uppercase; letter-spacing:0.3px; text-align:left; }
  table.data td { padding:5px 8px; border-bottom:1px solid #eaedf5; vertical-align:top; }
  table.data tr:nth-child(even) td { background:#f8f9fc; }
  .no-data { text-align:center; color:#aaa; padding:14px; font-style:italic; font-size:12px; }

  /* Подвал с подписью */
  .signature-block { margin-top:32px; padding-top:16px; border-top:1px solid #d0d8ec; display:flex; justify-content:space-between; }
  .sig-item { flex:1; }
  .sig-item.right { text-align:right; }
  .sig-label { font-size:10px; color:#888; margin-bottom:4px; }
  .sig-line  { border-bottom:1px solid #333; width:160px; height:18px; margin-bottom:2px; display:inline-block; }
  .sig-line.left { margin:0 0 2px 0; display:block; }
  .sig-name  { font-size:10px; color:#555; }
  .footer-note { margin-top:12px; font-size:9px; color:#bbb; text-align:center; }
</style>
</head>
<body>

<!-- Шапка бланка -->
<div class="letterhead">
  <div class="org-block">
    <div class="org-name">TheStillness</div>
    <div class="org-sub">Сервис психологического мониторинга и самонаблюдения</div>
  </div>
  <div class="doc-num">
    Документ № <b>${docNum}</b><br>
    Дата: <b>${today}</b>
  </div>
</div>

<!-- Заголовок -->
<div class="doc-title-block">
  <div class="doc-title">Отчёт о психоэмоциональном состоянии</div>
  <div class="doc-conf">Конфиденциально · Только для личного использования</div>
</div>

<!-- Реквизиты -->
<table class="requisites">
  <tr><td>Ф.И.О. пользователя</td><td>${userName}</td></tr>
  <tr><td>Период наблюдения</td><td>${formatDate(startDate)} — ${formatDate(endDate)}</td></tr>
  <tr><td>Дата формирования</td><td>${today}</td></tr>
  <tr><td>Тип отчёта</td><td>Комплексный (эмоции + дневник)</td></tr>
</table>

<!-- Сводная статистика -->
<div class="section">
  <div class="section-title">1. Сводная статистика</div>

  <div class="stat-cards">
    <div class="stat-card">
      <div class="num">${summary?.totalEmotions ?? 0}</div>
      <div class="lbl">Записей эмоций</div>
    </div>
    <div class="stat-card">
      <div class="num">${summary?.totalDiary ?? 0}</div>
      <div class="lbl">Записей дневника</div>
    </div>
    <div class="stat-card">
      <div class="num">${summary?.averageIntensity ? Number(summary.averageIntensity).toFixed(1) : '—'}</div>
      <div class="lbl">Ср. интенсивность</div>
    </div>
  </div>

  <div class="progress-wrap">
    <div class="progress-label">
      <span>Доля позитивных эмоций</span>
      <span><b>${totalPositiveRatio}%</b></span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width:${totalPositiveRatio}%; background:${totalPositiveRatio >= 60 ? '#4A7A6C' : totalPositiveRatio >= 40 ? '#c8952a' : '#B05E5E'};"></div>
    </div>
  </div>

  <table class="kpi-table">
    <tr><td>Позитивных эмоций зафиксировано</td><td>${summary?.goodEmotions ?? 0}</td></tr>
    <tr><td>Негативных эмоций зафиксировано</td><td>${summary?.badEmotions ?? 0}</td></tr>
    <tr><td>Средняя интенсивность переживаний</td><td>${summary?.averageIntensity ? Number(summary.averageIntensity).toFixed(2) : '—'} / 10</td></tr>
  </table>
</div>

${emotions.length > 0 ? `
<div class="section">
  <div class="section-title">2. Журнал эмоциональных состояний</div>
  <table class="data">
    <thead><tr><th>№</th><th>Дата и время</th><th>Эмоция</th><th>Интенсивность</th></tr></thead>
    <tbody>
      ${emotionRows || `<tr><td colspan="4" class="no-data">Записей нет</td></tr>`}
    </tbody>
  </table>
  ${emotions.length > 50 ? `<p style="font-size:10px;color:#aaa;margin-top:5px;text-align:right;">Показаны первые 50 из ${emotions.length} записей.</p>` : ''}
</div>
` : ''}

${diary.length > 0 ? `
<div class="section">
  <div class="section-title">${emotions.length > 0 ? '3' : '2'}. Записи дневника (метод СМЭР)</div>
  <table class="data">
    <thead><tr><th>№</th><th>Дата</th><th>Ситуация</th><th>Эмоция</th><th>Поведение</th></tr></thead>
    <tbody>
      ${diaryRows || `<tr><td colspan="5" class="no-data">Записей нет</td></tr>`}
    </tbody>
  </table>
  ${diary.length > 30 ? `<p style="font-size:10px;color:#aaa;margin-top:5px;text-align:right;">Показаны первые 30 из ${diary.length} записей.</p>` : ''}
</div>
` : ''}

<!-- Подпись -->
<div class="signature-block">
  <div class="sig-item">
    <div class="sig-label">Пользователь</div>
    <div class="sig-line left"></div>
    <div class="sig-name">${userName}</div>
  </div>
  <div class="sig-item right">
    <div class="sig-label">Дата получения отчёта</div>
    <div class="sig-name">${today}</div>
  </div>
</div>

<div class="footer-note">
  Отчёт сформирован автоматически системой TheStillness · Документ носит информационный характер
</div>

</body>
</html>`;
};

export const ReportViewerScreen: React.FC<ReportViewerScreenProps> = ({ navigation, route }) => {
  const { reportData, userName, reportId } = route.params;
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const reportHtml = buildHtml(reportData, userName);
    setHtml(reportHtml);

    generatePDF(reportData, userName)
      .then(uri => setPdfUri(uri))
      .catch(err => console.error('PDF gen error:', err));
  }, []);

  const handleShare = async () => {
    if (!pdfUri) {
      Alert.alert('Подождите', 'PDF ещё формируется...');
      return;
    }
    try {
      setSharing(true);
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Поделиться отчётом',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться');
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
        <Text style={styles.title}>Отчёт</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.headerBtn}
          disabled={sharing}
        >
          {sharing
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Feather name="share-2" size={20} color={pdfUri ? COLORS.primary : COLORS.textMuted} />
          }
        </TouchableOpacity>
      </View>

      {html ? (
        <WebView
          source={{ html }}
          style={styles.webview}
          showsVerticalScrollIndicator={true}
          originWhitelist={['*']}
          javaScriptEnabled={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Формируем отчёт...</Text>
        </View>
      )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: { ...TYPOGRAPHY.body2, color: COLORS.textLight },
});