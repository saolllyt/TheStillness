export const sendResetCode = async (email: string, code: string): Promise<void> => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const senderEmail = process.env.EMAIL_USER || 'thestillnesssupport@gmail.com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail OAuth2 credentials не настроены');
  }

  console.log(` Отправка кода на ${email}...`);

  // Получаем access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const tokenData = await tokenRes.json() as any;
  if (!tokenData.access_token) {
    throw new Error(`Не удалось получить access token: ${JSON.stringify(tokenData)}`);
  }

  // Формируем email в формате RFC 2822
  const subject = 'Восстановление пароля — TheStillness';
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #004a7c;">Восстановление пароля</h2>
      <p>Вы запросили сброс пароля для вашего аккаунта TheStillness.</p>
      <p>Ваш код подтверждения:</p>
      <div style="background: #e8f1f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #004a7c;">
          ${code}
        </span>
      </div>
      <p style="color: #666;">Код действителен в течение 15 минут.</p>
      <p style="color: #666;">Если вы не запрашивали сброс пароля — проигнорируйте это письмо.</p>
    </div>
  `;

  const rawEmail = [
    `From: TheStillness <${senderEmail}>`,
    `To: ${email}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody,
  ].join('\r\n');

  const encodedEmail = Buffer.from(rawEmail).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  // Отправляем через Gmail API
  const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!sendRes.ok) {
    const err = await sendRes.json() as any;
    throw new Error(`Gmail API error: ${JSON.stringify(err).slice(0, 200)}`);
  }

  console.log(` Письмо успешно отправлено на ${email}`);
};
