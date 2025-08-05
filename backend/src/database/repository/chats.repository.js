import { pool } from "../connection/db.js";

export class ChatsRepository {
  static async getChats({ userId }) {
    const result = await pool.query(
    `
    SELECT c.type, c.picture, c.title, m.content, m.sent_at, u.display_name, u.username FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
    JOIN messages m ON c.id = m.chat_id 
    JOIN users u ON u.id = m.sender_id
    WHERE ch.user_id = $1
    ORDER BY m.sent_at DESC
	  LIMIT 1`,
    [userId]
    );

    return result.rows;
  }

}
