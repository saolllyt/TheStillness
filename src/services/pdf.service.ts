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

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #1a1a2e; background: #fff; padding: 40px; }
    .page-header { border-bottom: 2px solid #2C3F70; padding-bottom: 16px; margin-bottom: 24px; }
    .org-name { font-size: 10pt; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .doc-title { font-size: 18pt; font-weight: bold; color: #2C3F70; margin-bottom: 4px; }
    .doc-subtitle { font-size: 10pt; color: #666; }
    .meta-block { background: #f5f7fa; border: 1px solid #dce3f0; border-radius: 4px; padding: 12px 16px; margin-bottom: 24px; font-size: 11pt; display: flex; gap: 24px; }
    .meta-item { flex: 1; }
    .meta-label { color: #666; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-value { color: #1a1a2e; font-weight: bold; margin-top: 2px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 13pt; font-weight: bold; color: #2C3F70; border-bottom: 1px solid #dce3f0; padding-bottom: 6px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-grid { display: flex; gap: 12px; margin-bottom: 16px; }
    .summary-card { flex: 1; border: 1px solid #dce3f0; border-radius: 4px; padding: 12px; text-align: center; }
    .summary-number { font-size: 22pt; font-weight: bold; color: #2C3F70; }
    .summary-label { font-size: 9pt; color: #666; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
    th { background: #2C3F70; color: white; padding: 8px 10px; text-align: left; font-weight: normal; text-transform: uppercase; font-size: 9pt; letter-spacing: 0.5px; }
    td { padding: 7px 10px; border-bottom: 1px solid #eef0f5; color: #333; }
    tr:nth-child(even) td { background: #f9fafc; }
    .no-data { text-align: center; color: #999; padding: 20px; font-style: italic; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #dce3f0; display: flex; justify-content: space-between; font-size: 9pt; color: #999; }
    .avg-badge { display: inline-block; background: #eef2ff; color: #2C3F70; padding: 2px 8px; border-radius: 3px; font-size: 10pt; font-weight: bold; }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="org-name">TheStillness — Система отслеживания эмоций</div>
    <div class="doc-title">Психологический отчёт</div>
    <div class="doc-subtitle">Конфиденциальный документ</div>
  </div>
  <div class="meta-block">
    <div class="meta-item">
      <div class="meta-label">Пользователь</div>
      <div class="meta-value">${userName}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Период</div>
      <div class="meta-value">${formatDate(startDate)} — ${formatDate(endDate)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Дата формирования</div>
      <div class="meta-value">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Сводная статистика</div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-number">${summary?.totalEmotions ?? 0}</div>
        <div class="summary-label">Записей эмоций</div>
      </div>
      <div class="summary-card">
        <div class="summary-number">${summary?.totalDiary ?? 0}</div>
        <div class="summary-label">Записей дневника</div>
      </div>
      <div class="summary-card">
        <div class="summary-number">${summary?.averageIntensity ? Number(summary.averageIntensity).toFixed(1) : '—'}</div>
        <div class="summary-label">Средняя интенсивность</div>
      </div>
    </div>
    <table>
      <tr><th>Показатель</th><th>Значение</th></tr>
      <tr><td>Позитивные эмоции</td><td><span class="avg-badge">${summary?.goodEmotions ?? 0}</span></td></tr>
      <tr><td>Негативные эмоции</td><td><span class="avg-badge">${summary?.badEmotions ?? 0}</span></td></tr>
      <tr><td>Доля позитивных</td><td><span class="avg-badge">${
        summary?.totalEmotions > 0
          ? Math.round((summary.goodEmotions / summary.totalEmotions) * 100) + '%'
          : '—'
      }</span></td></tr>
    </table>
  </div>
  ${emotions.length > 0 ? `
  <div class="section">
    <div class="section-title">Журнал эмоций</div>
    <table>
      <thead><tr><th>Дата и время</th><th>Эмоция</th><th>Интенсивность (1-10)</th></tr></thead>
      <tbody>${emotionRows || `<tr><td colspan="3" class="no-data">Нет записей</td></tr>`}</tbody>
    </table>
    ${emotions.length > 50 ? `<p style="font-size:9pt;color:#999;margin-top:8px;">Показаны первые 50 из ${emotions.length} записей.</p>` : ''}
  </div>` : ''}
  ${diary.length > 0 ? `
  <div class="section">
    <div class="section-title">Дневник СМЭР</div>
    <table>
      <thead><tr><th>Дата</th><th>Ситуация</th><th>Эмоция</th><th>Поведение</th></tr></thead>
      <tbody>${diaryRows || `<tr><td colspan="4" class="no-data">Нет записей</td></tr>`}</tbody>
    </table>
    ${diary.length > 30 ? `<p style="font-size:9pt;color:#999;margin-top:8px;">Показаны первые 30 из ${diary.length} записей.</p>` : ''}
  </div>` : ''}
  <div class="footer">
    <span>Сформировано системой TheStillness</span>
    <span>${new Date().toLocaleString('ru-RU')}</span>
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