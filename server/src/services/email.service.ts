export const sendResetCode = async (email: string, code: string): Promise<void> => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY не настроен');

  console.log(` Отправка кода на ${email}...`);

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: 'noreply@thestillness.app', name: 'TheStillness' },
      subject: 'Восстановление пароля — TheStillness',
      content: [
        {
          type: 'text/html',
          value: `
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
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SendGrid error ${response.status}: ${text.slice(0, 200)}`);
  }

  console.log(` Письмо успешно отправлено на ${email}`);
};
