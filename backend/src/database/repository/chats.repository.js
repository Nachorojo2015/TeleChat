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
          m.type AS message_type,
          u.display_name,
          u.username,
          -- info del otro usuario en caso de privado
          CASE WHEN c.type = 'private' THEN u_other.display_name END AS other_display_name,
          CASE WHEN c.type = 'private' THEN u_other.username END AS other_username,
          CASE WHEN c.type = 'private' THEN u_other.profile_picture END AS other_profile_picture
      FROM chats c
      JOIN chat_members ch ON c.id = ch.chat_id
      LEFT JOIN (
          SELECT DISTINCT ON (chat_id) *
          FROM messages
          ORDER BY chat_id, sent_at DESC
      ) m ON c.id = m.chat_id
      LEFT JOIN users u ON u.id = m.sender_id
      -- traemos el otro usuario si es chat privado
      LEFT JOIN chat_members ch_other 
          ON c.type = 'private' AND c.id = ch_other.chat_id AND ch_other.user_id <> $1
      LEFT JOIN users u_other 
          ON ch_other.user_id = u_other.id
      WHERE ch.user_id = $1
      ORDER BY m.sent_at DESC NULLS LAST;`,
      [userId]
    );

    return result.rows;
  }
}
