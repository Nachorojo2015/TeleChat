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
      await this.addMember({ groupId, userId: members[i]})
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

  static async getOut({ userId, groupId }) {
    const result = await pool.query(`DELETE FROM chat_members WHERE user_id = $1 AND chat_id = $2`, [userId, groupId])

    if (result.rowCount === 0) {
      throw new Error('No pudiste salir del grupo')
    }
  }

  static async deleteGroup({ groupId }) {
    const result = await pool.query(`DELETE FROM chats WHERE id = $1`, [groupId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo borrar el grupo')
    }
  }

  static async editGroup({ groupId, title, description, picture, is_public }) {
    const result = await pool.query(`
    UPDATE chats 
    SET title = $1, description = $2, picture = $3, is_public = $4
    WHERE id = $5`, [title, description, picture, is_public, groupId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo editar el grupo')
    }
  }

  static async joinGroup({ groupId, userId }) {
    const imBanned = await this.isBanned({ groupId, userId })

    if (imBanned) {
      throw new Error('Estas baneado del grupo')
    }

    const result = await pool.query(`
    INSERT INTO chat_members (chat_id, user_id)
    VALUES ($1, $2)`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No pudiste unirte al grupo')
    }
  }

  static async addMember({ groupId, userId }) {
    const isBannedMember = await this.isBanned({ groupId, userId })

    if (isBannedMember) {
      throw new Error('El usuario esta baneado del grupo')
    }

    const result = await pool.query(`
    INSERT INTO chat_members (chat_id, user_id)
    VALUES ($1, $2)`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo agregar al usuario')
    }
  }

  static async removeMember({ groupId, userId }) {
    const result = await pool.query(`DELETE FROM chat_members WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('Miembro no eliminado')
    }
  }

  static async banMember({ groupId, userBanId, userId }) {
    await this.removeMember({ groupId, userId: userBanId })

    const result = await pool.query(`
    INSERT INTO chat_bans (chat_id, user_id, banned_by)
    VALUES ($1, $2, $3)`, [groupId, userBanId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo banear al usuario')
    }
  }

  static async isBanned({ groupId, userId }) {
    const result = await pool.query(`SELECT 1 FROM chat_bans WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    return result.rowCount > 0
  }

  static async unbanMember({ groupId, userId }) {
    const result = await pool.query(`DELETE FROM chat_bans WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo desbanear al usuario')
    }

    await this.addMember({ groupId, userId })
  }

  static async muteMember({ groupId, userId }) {
    const result = await pool.query(`
    UPDATE chat_members
    SET is_muted = true
    WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo mutear al usuario')
    }
  }

  static async unmuteMember({ groupId, userId }) {
    const result = await pool.query(`
    UPDATE chat_members
    SET is_muted = false
    WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo desmutear al usuario')
    }
  }

  static async becomeMemberAdmin({ groupId, userId }) {
    const result = await pool.query(`
    UPDATE chat_members
    SET role = 'admin'
    WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo volver administrador al miembro')
    }
  }

  static async becomeMember({ groupId, userId }) {
    const result = await pool.query(`
    UPDATE chat_members
    SET role = 'member'
    WHERE chat_id = $1 AND user_id = $2`, [groupId, userId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo volver miembro al usuario')
    }
  }
}
