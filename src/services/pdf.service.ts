import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

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
  1: 'Радость', 2: 'Спокойствие', 3: 'Тревога', 4: 'Грусть',
  5: 'Страх', 6: 'Злость', 7: 'Усталость', 8: 'Надежда',
  9: 'Благодарность', 10: 'Вдохновение',
};

export const generatePDF = async (reportData: any, userName: string): Promise<string> => {
  const { startDate, endDate, summary, emotions = [], diary = [] } = reportData;

  const emotionRows = emotions.slice(0, 50).map((e: any) => `
    <tr>
      <td>${formatDateTime(e.created_at || e.created_date)}</td>
      <td>${EMOTION_NAMES[e.emotion_type_id] || e.emotion_type_id}</td>
      <td>${e.intensity || '—'}</td>
    </tr>
  `).join('');

  const diaryRows = diary.slice(0, 30).map((d: any) => `
    <tr>
      <td>${formatDateTime(d.created_at)}</td>
      <td>${d.situation || '—'}</td>
      <td>${d.emotion_name || '—'}</td>
      <td>${d.behavior || '—'}</td>
    </tr>
  `).join('');

  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const positiveRatio = summary?.totalEmotions > 0
    ? Math.round((summary.goodEmotions / summary.totalEmotions) * 100)
    : 0;
  const barColor = positiveRatio >= 60 ? '#4A7A6C' : positiveRatio >= 40 ? '#c8952a' : '#b05e5e';

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size:11pt; color:#1c1c1e; background:#f2f4f8; }
  .wrap { max-width:680px; margin:0 auto; padding:28px 20px 48px; }

  .app-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
  .app-name { font-size:17pt; font-weight:bold; color:#1b4f8a; }
  .report-date { font-size:10pt; color:#888; }

  .hero { background:#1b4f8a; border-radius:14px; padding:22px; margin-bottom:16px; color:#fff; }
  .hero-label { font-size:10pt; opacity:0.8; margin-bottom:4px; }
  .hero-name { font-size:18pt; font-weight:bold; margin-bottom:14px; }
  .hero-pills { display:flex; gap:12px; }
  .hero-pill { background:rgba(255,255,255,0.15); border-radius:8px; padding:6px 12px; font-size:10pt; }
  .hero-pill span { display:block; font-size:8pt; opacity:0.7; margin-bottom:2px; }

  .stats-row { display:flex; gap:10px; margin-bottom:14px; }
  .stat-box { flex:1; background:#fff; border-radius:12px; padding:14px 8px; text-align:center; }
  .stat-num { font-size:22pt; font-weight:bold; color:#1b4f8a; line-height:1; }
  .stat-lbl { font-size:9pt; color:#888; margin-top:4px; }

  .card { background:#fff; border-radius:12px; padding:16px; margin-bottom:12px; }
  .card-title { font-size:9pt; font-weight:bold; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; }

  .bar-labels { display:flex; justify-content:space-between; font-size:10pt; color:#555; margin-bottom:5px; }
  .bar-track { height:8pt; background:#eceef2; border-radius:4pt; overflow:hidden; margin-bottom:4px; }
  .bar-fill { height:100%; border-radius:4pt; }
  .bar-sub { display:flex; justify-content:space-between; font-size:9pt; color:#aaa; }

  table { width:100%; border-collapse:collapse; font-size:10pt; }
  thead th { font-size:9pt; font-weight:bold; color:#888; text-transform:uppercase; letter-spacing:0.4px; padding:0 8px 8px; text-align:left; border-bottom:1pt solid #eceef2; }
  tbody td { padding:7px 8px; border-bottom:1pt solid #f4f4f6; vertical-align:top; color:#333; line-height:1.4; }
  tbody tr:last-child td { border-bottom:none; }
  .no-data { text-align:center; color:#aaa; padding:14px; font-size:10pt; }

  .footer-line { text-align:center; font-size:9pt; color:#c0c0c5; margin-top:24px; }
</style>
</head>
<body>
<div class="wrap">

  <div class="app-header">
    <div class="app-name">TheStillness</div>
    <div class="report-date">${today}</div>
  </div>

  <div class="hero">
    <div class="hero-label">Отчёт о самочувствии</div>
    <div class="hero-name">${userName}</div>
    <div class="hero-pills">
      <div class="hero-pill"><span>Начало периода</span>${formatDate(startDate)}</div>
      <div class="hero-pill"><span>Конец периода</span>${formatDate(endDate)}</div>
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
      <div class="stat-lbl">ср. интенсивность</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Эмоциональный баланс</div>
    <div class="bar-labels"><span>Позитивные</span><span>${positiveRatio}%</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${positiveRatio}%;background:${barColor};"></div></div>
    <div class="bar-sub"><span>${summary?.goodEmotions ?? 0} позитивных</span><span>${summary?.badEmotions ?? 0} негативных</span></div>
  </div>

  ${emotions.length > 0 ? `
  <div class="card">
    <div class="card-title">Журнал эмоций</div>
    <table>
      <thead><tr><th>Дата и время</th><th>Эмоция</th><th>Балл</th></tr></thead>
      <tbody>${emotionRows || `<tr><td colspan="3" class="no-data">Нет записей</td></tr>`}</tbody>
    </table>
    ${emotions.length > 50 ? `<p style="font-size:9pt;color:#aaa;margin-top:8px;">Первые 50 из ${emotions.length}</p>` : ''}
  </div>` : ''}

  ${diary.length > 0 ? `
  <div class="card">
    <div class="card-title">Дневник СМЭР</div>
    <table>
      <thead><tr><th>Дата</th><th>Ситуация</th><th>Эмоция</th><th>Поведение</th></tr></thead>
      <tbody>${diaryRows || `<tr><td colspan="4" class="no-data">Нет записей</td></tr>`}</tbody>
    </table>
    ${diary.length > 30 ? `<p style="font-size:9pt;color:#aaa;margin-top:8px;">Первые 30 из ${diary.length}</p>` : ''}
  </div>` : ''}

  <div class="footer-line">Сформировано в приложении TheStillness</div>

</div>
</body>
</html>`;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
};

export const sharePDF = async (
  uri: string,
  fileName: string,
  onOpen?: () => void
): Promise<void> => {
  try {
    const permanentUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
    await FileSystem.copyAsync({ from: uri, to: permanentUri });

    const isAvailable = await Sharing.isAvailableAsync();

    Alert.alert(
      'Отчёт готов',
      'Выберите действие:',
      [
        {
          text: 'Открыть',
          onPress: () => {
            if (onOpen) {
              onOpen();
            }
          }
        },
        {
          text: 'Поделиться',
          onPress: async () => {
            if (isAvailable) {
              await Sharing.shareAsync(permanentUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Поделиться отчётом',
                UTI: 'com.adobe.pdf',
              });
            }
          }
        },
        { text: 'Закрыть', style: 'cancel' }
      ]
    );
  } catch (error) {
    console.error('sharePDF error:', error);
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Отчёт TheStillness',
        UTI: 'com.adobe.pdf',
      });
    }
  }
};