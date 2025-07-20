import { pool } from "../connection/db.js";

export class ChannelsRepository {
  static async getChannel({ channelId }) {
    const result = await pool.query(
      `
    SELECT c.picture, c.title, COUNT(ch.user_id) AS quantity_members FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
    WHERE c.id = $1
    GROUP BY c.picture, c.title`,
    [channelId]
    );

    if (result.rowCount === 0) {
        throw new Error('No se encontro el canal')
    }

    return result.rows[0]
  }
}
