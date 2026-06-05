export const sendResetCode = async (email: string, code: string): Promise<void> => {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  if (!apiKey || !secretKey) throw new Error('MAILJET_API_KEY / MAILJET_SECRET_KEY не настроены');

  console.log(` Отправка кода на ${email}...`);

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: 'thestillnesssupport@gmail.com', Name: 'TheStillness' },
          To: [{ Email: email }],
          Subject: 'Восстановление пароля — TheStillness',
          HTMLPart: `
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
    const err = await response.json() as any;
    throw new Error(`Mailjet error ${response.status}: ${JSON.stringify(err).slice(0, 200)}`);
  }

  console.log(` Письмо успешно отправлено на ${email}`);
};
