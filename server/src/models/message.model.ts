import { pool } from '../config/database';

export class MessageModel {
  // Отправить сообщение
  static async create(sender_id: number, receiver_id: number, content: string, report_id?: number): Promise<any> {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, report_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [sender_id, receiver_id, content, report_id || null]);
    const message = result.rows[0];

    // Отправить push-уведомление получателю
    MessageModel.sendPushNotification(sender_id, receiver_id, content).catch(() => {});

    return message;
  }

  private static async sendPushNotification(sender_id: number, receiver_id: number, content: string): Promise<void> {
    const tokenRes = await pool.query(
      'SELECT push_token, first_name, last_name, email FROM users WHERE id = $1 AND push_token IS NOT NULL',
      [receiver_id]
    );
    if (!tokenRes.rows[0]) return;
    const { push_token } = tokenRes.rows[0];

    const senderRes = await pool.query(
      'SELECT first_name, last_name, email FROM users WHERE id = $1',
      [sender_id]
    );
    const sender = senderRes.rows[0];
    const senderName = sender?.first_name
      ? `${sender.first_name} ${sender.last_name || ''}`.trim()
      : sender?.email || 'Новое сообщение';

    let body = content;
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === 'psychologist_report') body = 'Отправлен отчёт психолога';
      else if (parsed.type) body = 'Новый отчёт';
    } catch {}
    if (body.length > 100) body = body.slice(0, 97) + '...';

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        to: push_token,
        title: senderName,
        body,
        sound: 'default',
        data: { senderId: sender_id },
      }),
    });
  }

  // Получить переписку между двумя пользователями
  static async getConversation(user1_id: number, user2_id: number): Promise<any[]> {
  const query = `
    SELECT 
      m.*,
      s.first_name as sender_first_name,
      s.last_name as sender_last_name,
      s.email as sender_email,
      r.report_content as report_data
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    LEFT JOIN reports r ON m.report_id = r.id
    WHERE 
      (m.sender_id = $1 AND m.receiver_id = $2) OR
      (m.sender_id = $2 AND m.receiver_id = $1)
    ORDER BY m.created_at ASC
  `;
  const result = await pool.query(query, [user1_id, user2_id]);
  
  return result.rows.map(row => ({
    ...row,
    report_data: row.report_data
      ? (typeof row.report_data === 'string' ? JSON.parse(row.report_data) : row.report_data)
      : null,
  }));
}

  // Отметить сообщения как прочитанные
  static async markAsRead(sender_id: number, receiver_id: number): Promise<void> {
    const query = `
      UPDATE messages 
      SET is_read = true 
      WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
    `;
    await pool.query(query, [sender_id, receiver_id]);
  }

  // Список диалогов пользователя
  static async getDialogs(user_id: number): Promise<any[]> {
    const query = `
      SELECT DISTINCT ON (other_user_id)
        CASE 
          WHEN m.sender_id = $1 THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        u.first_name, u.last_name, u.email, u.role,
        m.content as last_message,
        m.created_at as last_message_at,
        m.is_read,
        m.sender_id,
        COUNT(m2.id) FILTER (WHERE m2.is_read = false AND m2.receiver_id = $1) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE 
        WHEN m.sender_id = $1 THEN m.receiver_id 
        ELSE m.sender_id 
      END
      LEFT JOIN messages m2 ON m2.sender_id = u.id AND m2.receiver_id = $1
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      GROUP BY other_user_id, u.first_name, u.last_name, u.email, u.role,
               m.content, m.created_at, m.is_read, m.sender_id
      ORDER BY other_user_id, m.created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  // Количество непрочитанных
  static async getUnreadCount(user_id: number): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM messages 
      WHERE receiver_id = $1 AND is_read = false
    `;
    const result = await pool.query(query, [user_id]);
    return parseInt(result.rows[0].count);
  }
}