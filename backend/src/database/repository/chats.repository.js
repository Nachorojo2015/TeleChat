import { pool } from "../connection/db.js";

export class ChatsRepository {
  static async getChats({ userId }) {
    const result = await pool.query(
      `
    SELECT c.picture, c.title, m.content, m.sent_at FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
    JOIN messages m ON c.id = m.chat_id 
    WHERE ch.user_id = $1
    ORDER BY m.sent_at DESC`,
      [userId]
    );

    return result.rows;
  }

}
