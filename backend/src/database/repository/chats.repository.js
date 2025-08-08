import { pool } from "../connection/db.js";

export class ChatsRepository {
  static async getChats({ userId }) {
    const result = await pool.query(
      `
    SELECT 
  c.id,
  c.type,
  c.picture,
  c.title,
  m.content,
  m.sent_at,
  u.display_name,
  u.username
FROM chats c
JOIN chat_members ch ON c.id = ch.chat_id
LEFT JOIN (
    SELECT DISTINCT ON (chat_id) *
    FROM messages
    ORDER BY chat_id, sent_at DESC
) m ON c.id = m.chat_id
LEFT JOIN users u ON u.id = m.sender_id
WHERE ch.user_id = $1
ORDER BY m.sent_at DESC NULLS LAST;`,
      [userId]
    );

    return result.rows;
  }
}
