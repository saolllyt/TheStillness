import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,  // 5 сек на подключение
  greetingTimeout: 5000,    // 5 сек на приветствие SMTP
  socketTimeout: 10000,     // 10 сек на передачу данных
});

export const sendResetCode = async (email: string, code: string): Promise<void> => {
  console.log(` Отправка кода ${code} на ${email}...`);
  await transporter.sendMail({
    from: `"TheStillness" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Восстановление пароля — TheStillness',
    html: `
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
  });
  console.log(`✅ Письмо успешно отправлено на ${email}`);
};