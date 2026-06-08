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

  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  const positiveRatio = summary?.totalEmotions > 0
    ? Math.round((summary.goodEmotions / summary.totalEmotions) * 100)
    : 0;
  const barColor = positiveRatio >= 60 ? '#4A7A6C' : positiveRatio >= 40 ? '#c8952a' : '#b05e5e';

  const emotionRows = emotions.slice(0, 50).map((e: any) => `
    <tr>
      <td>${formatDateTime(e.created_at || e.created_date)}</td>
      <td>${EMOTION_NAMES[e.emotion_type_id] || '—'}</td>
      <td style="text-align:center;">${e.intensity ?? '—'} / 10</td>
    </tr>
  `).join('');

  const diaryRows = diary.slice(0, 30).map((d: any) => `
    <tr>
      <td style="white-space:nowrap;">${formatDateTime(d.created_at)}</td>
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
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size:14px; color:#1c1c1e; background:#f2f4f8; }
  .wrap { max-width:680px; margin:0 auto; padding:20px 16px 40px; }

  .app-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .app-name { font-size:18px; font-weight:700; color:#1b4f8a; letter-spacing:-0.3px; }
  .report-date { font-size:12px; color:#8a8a8e; }

  .hero { background:#1b4f8a; border-radius:16px; padding:20px; margin-bottom:16px; color:#fff; }
  .hero-title { font-size:15px; font-weight:600; margin-bottom:4px; opacity:0.85; }
  .hero-name { font-size:22px; font-weight:700; margin-bottom:12px; }
  .hero-period { display:flex; gap:16px; }
  .hero-pill { background:rgba(255,255,255,0.15); border-radius:8px; padding:6px 12px; font-size:12px; }
  .hero-pill span { display:block; font-size:10px; opacity:0.75; margin-bottom:2px; }

  .stats-row { display:flex; gap:10px; margin-bottom:16px; }
  .stat-box { flex:1; background:#fff; border-radius:12px; padding:14px 10px; text-align:center; }
  .stat-num { font-size:28px; font-weight:700; color:#1b4f8a; line-height:1; }
  .stat-lbl { font-size:11px; color:#8a8a8e; margin-top:4px; line-height:1.3; }

  .card { background:#fff; border-radius:12px; padding:16px; margin-bottom:12px; }
  .card-title { font-size:13px; font-weight:600; color:#8a8a8e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; }

  .bar-wrap { margin-bottom:6px; }
  .bar-labels { display:flex; justify-content:space-between; font-size:12px; color:#555; margin-bottom:5px; }
  .bar-track { height:8px; background:#eceef2; border-radius:4px; overflow:hidden; }
  .bar-fill { height:100%; border-radius:4px; }
  .bar-sublabels { display:flex; justify-content:space-between; font-size:11px; color:#aaa; margin-top:4px; }

  .kv-list { display:flex; flex-direction:column; gap:8px; }
  .kv-row { display:flex; justify-content:space-between; align-items:center; }
  .kv-key { font-size:13px; color:#555; }
  .kv-val { font-size:13px; font-weight:600; color:#1c1c1e; }

  table.dt { width:100%; border-collapse:collapse; font-size:12px; }
  table.dt thead th { font-size:11px; font-weight:600; color:#8a8a8e; text-transform:uppercase; letter-spacing:0.4px; padding:0 8px 8px; text-align:left; border-bottom:1px solid #eceef2; }
  table.dt tbody td { padding:8px 8px; border-bottom:1px solid #f4f4f6; vertical-align:top; color:#333; line-height:1.4; }
  table.dt tbody tr:last-child td { border-bottom:none; }
  .no-data { text-align:center; color:#aaa; padding:16px; font-size:12px; }

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
    <div class="hero-title">Отчёт о самочувствии</div>
    <div class="hero-name">${userName}</div>
    <div class="hero-period">
      <div class="hero-pill"><span>Начало</span>${formatDate(startDate)}</div>
      <div class="hero-pill"><span>Конец</span>${formatDate(endDate)}</div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-box">
      <div class="stat-num">${summary?.totalEmotions ?? 0}</div>
      <div class="stat-lbl">записей эмоций</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">${summary?.totalDiary ?? 0}</div>
      <div class="stat-lbl">записей дневника</div>
    </div>
    <div class="stat-box">
      <div class="stat-num">${summary?.averageIntensity ? Number(summary.averageIntensity).toFixed(1) : '—'}</div>
      <div class="stat-lbl">средняя интенсивность</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Эмоциональный баланс</div>
    <div class="bar-wrap">
      <div class="bar-labels"><span>Позитивные</span><span>${positiveRatio}%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${positiveRatio}%;background:${barColor};"></div></div>
      <div class="bar-sublabels"><span>${summary?.goodEmotions ?? 0} позитивных</span><span>${summary?.badEmotions ?? 0} негативных</span></div>
    </div>
  </div>

${emotions.length > 0 ? `
  <div class="card">
    <div class="card-title">Журнал эмоций</div>
    <table class="dt">
      <thead><tr><th>Дата и время</th><th>Эмоция</th><th>Балл</th></tr></thead>
      <tbody>
        ${emotionRows || `<tr><td colspan="3" class="no-data">Нет записей</td></tr>`}
      </tbody>
    </table>
    ${emotions.length > 50 ? `<p style="font-size:11px;color:#aaa;margin-top:8px;">Показаны первые 50 из ${emotions.length}</p>` : ''}
  </div>
` : ''}

${diary.length > 0 ? `
  <div class="card">
    <div class="card-title">Дневник СМЭР</div>
    <table class="dt">
      <thead><tr><th>Дата</th><th>Ситуация</th><th>Эмоция</th><th>Поведение</th></tr></thead>
      <tbody>
        ${diaryRows || `<tr><td colspan="4" class="no-data">Нет записей</td></tr>`}
      </tbody>
    </table>
    ${diary.length > 30 ? `<p style="font-size:11px;color:#aaa;margin-top:8px;">Показаны первые 30 из ${diary.length}</p>` : ''}
  </div>
` : ''}

  <div class="footer-line">Сформировано в приложении TheStillness</div>

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