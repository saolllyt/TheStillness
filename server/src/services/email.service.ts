import nodemailer from 'nodemailer';
import { resolve4 } from 'dns/promises';

export const sendResetCode = async (email: string, code: string): Promise<void> => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error('EMAIL_USER / EMAIL_PASS не настроены');

  console.log(` Отправка кода на ${email}...`);

  // Резолвим smtp.gmail.com вручную в IPv4 — Railway по умолчанию возвращает IPv6
  const [ipv4] = await resolve4('smtp.gmail.com');
  console.log(` SMTP IPv4: ${ipv4}`);

  const transporter = nodemailer.createTransport({
    host: ipv4,
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
      servername: 'smtp.gmail.com',
    },
  });

  await transporter.sendMail({
    from: `"TheStillness" <${user}>`,
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

  console.log(` Письмо успешно отправлено на ${email}`);
};
