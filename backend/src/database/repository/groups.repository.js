import { pool } from "../connection/db.js";

export class GroupsRepository {
  static async createGroup({ members, picture, title, userId }) {
    const result = await pool.query(
      `
            INSERT INTO chats (type, picture, title, owner_id)
            VALUES ('group', $1, $2, $3)
            RETURNING id`,
      [picture, title, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el grupo");
    }

    const groupId = result.rows[0].id;

    const res = await pool.query(
      `INSERT INTO chat_members (chat_id, user_id, role) 
            VALUES ($1, $2, $3)`,
      [groupId, userId, "owner"]
    );

    if (res.rowCount === 0) {
      throw new Error("No se pudo agregar al usuario");
    }

    for (let i = 0; i < members.length; i++) {
      const result = await pool.query(
        `INSERT INTO chat_members (chat_id, user_id)
            VALUES ($1, $2)`,
        [groupId, members[i]]
      );

      if (result.rowCount === 0) {
        throw new Error("No se pudo agregar al usuario");
      }
    }

    return groupId;
  }

  static async getGroup({ groupId }) {
    const result = await pool.query(`
    SELECT c.picture, c.title, COUNT(ch.user_id) AS quantity_members FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
    WHERE c.id = $1
    GROUP BY c.picture, c.title`, [groupId]);

    if (result.rowCount === 0) {
        throw new Error('No se encontro el grupo')
    }

    return result.rows[0]
  }
}
