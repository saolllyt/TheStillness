import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';

export interface ReportData {
  startDate: string;
  endDate: string;
  emotions?: any[];
  diary?: any[];
  summary: {
    totalEmotions?: number;
    averageIntensity?: number;
    totalDiary?: number;
    goodEmotions?: number;
    badEmotions?: number;
  };
}

export const generatePDF = async (reportData: ReportData, userName: string): Promise<string> => {
  try {
    const html = generateReportHTML(reportData, userName);
    
    const { uri } = await printToFileAsync({
      html,
      base64: false
    });

    console.log('PDF generated at:', uri);
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const sharePDF = async (fileUri: string, fileName: string) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Сохранить отчет',
      UTI: '.pdf'
    });

    return true;
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

const GOOD_EMOTIONS = [1, 3, 9, 10]; 
const BAD_EMOTIONS = [2, 4, 5, 6, 7, 8];    

const generateReportHTML = (data: ReportData, userName: string): string => {
  const emotionsHtml = data.emotions && data.emotions.length > 0 ? `
    <div class="section">
      <h2>Эмоции за период</h2>
      <p>Всего записей: ${data.summary.totalEmotions || 0}</p>
      <p>Средняя интенсивность: ${data.summary.averageIntensity?.toFixed(1) || 0}/10</p>
      <p>Хороших эмоций: ${data.summary.goodEmotions || 0}</p>
      <p>Плохих эмоций: ${data.summary.badEmotions || 0}</p>
      
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Эмоция</th>
            <th>Интенсивность</th>
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          ${data.emotions.map((e: any) => `
            <tr>
              <td>${new Date(e.created_date).toLocaleDateString()}</td>
              <td>${e.emotion_name}</td>
              <td>${e.intensity}/10</td>
              <td>${GOOD_EMOTIONS.includes(e.emotion_type_id) ? '✅ Хорошая' : '❌ Плохая'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  const diaryHtml = data.diary && data.diary.length > 0 ? `
    <div class="section">
      <h2>Записи дневника СМЭР</h2>
      <p>Всего записей: ${data.summary.totalDiary || 0}</p>
      
      ${data.diary.map((entry: any) => `
        <div class="diary-entry">
          <h3>${new Date(entry.entry_date).toLocaleDateString()}</h3>
          <p><strong>Ситуация:</strong> ${entry.situation_description}</p>
          <p><strong>Мысли:</strong> ${entry.thoughts}</p>
          <p><strong>Действия:</strong> ${entry.reaction_description}</p>
          <p><strong>Эмоции:</strong> ${entry.selected_emotions?.map((e: any) => 
            `${e.emotionName} (${e.intensity}/5)`
          ).join(', ')}</p>
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Отчет TheStillness</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2C3F70; border-bottom: 2px solid #C8D4E5; padding-bottom: 10px; }
        h2 { color: #2C3F70; margin-top: 30px; }
        h3 { color: #4A6A9C; margin-bottom: 5px; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #E8EBED; border-radius: 10px; }
        .header p { color: #5A6B7A; font-size: 18px; }
        .section { margin-bottom: 30px; padding: 20px; background: white; border: 1px solid #C8D4E5; border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #C8D4E5; }
        th { background: #2C3F70; color: white; }
        .diary-entry { margin-bottom: 20px; padding: 15px; background: #F9F7F3; border-left: 4px solid #2C3F70; border-radius: 5px; }
        .summary { display: flex; justify-content: space-around; margin-top: 20px; flex-wrap: wrap; }
        .stat { text-align: center; padding: 10px; background: #E8EBED; border-radius: 8px; min-width: 120px; margin: 5px; }
        .stat .number { font-size: 24px; font-weight: bold; color: #2C3F70; }
        .footer { margin-top: 40px; text-align: center; color: #8D9AA8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Отчет TheStillness</h1>
        <p>Пользователь: ${userName}</p>
        <p>Период: ${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}</p>
      </div>

      <div class="summary">
        <div class="stat"><div class="number">${data.summary.totalEmotions || 0}</div><div>Всего эмоций</div></div>
        <div class="stat"><div class="number">${data.summary.goodEmotions || 0}</div><div>✅ Хороших</div></div>
        <div class="stat"><div class="number">${data.summary.badEmotions || 0}</div><div>❌ Плохих</div></div>
        <div class="stat"><div class="number">${data.summary.totalDiary || 0}</div><div>Записей дневника</div></div>
      </div>

      ${emotionsHtml}
      ${diaryHtml}

      <div class="footer">
        <p>Сгенерировано приложением TheStillness</p>
        <p>© 2026 Все права защищены</p>
      </div>
    </body>
    </html>
  `;
};