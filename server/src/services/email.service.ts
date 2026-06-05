export const sendResetCode = async (email: string, code: string): Promise<void> => {
  const apiKey = process.env.SMTP2GO_API_KEY;
  if (!apiKey) throw new Error('SMTP2GO_API_KEY не настроен');

  console.log(` Отправка кода на ${email}...`);

  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      to: [email],
      sender: 'TheStillness <thestillnesssupport@gmail.com>',
      subject: 'Восстановление пароля — TheStillness',
      html_body: `
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
      `,
    }),
  });

  const result = await response.json() as any;
  if (!response.ok || result.data?.error) {
    throw new Error(`SMTP2GO error: ${JSON.stringify(result).slice(0, 200)}`);
  }

  console.log(` Письмо успешно отправлено на ${email}`);
};
