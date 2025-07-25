import { pool } from "../connection/db.js";

export class UsersRepository {
  static async getMyUser({ userId }) {
    const result = await pool.query(
      `SELECT username, display_name, profile_picture, bio FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      throw new Error("Usuario no encontrado");
    }

    return result.rows[0];
  }

  static async blockUser({ userId, blockedId }) {
    if (userId === blockedId) {
      throw new Error('Error de identificador')
    }

    const result = await pool.query(`
    INSERT INTO blocked_users (blocker_id, blocked_id)
    VALUES ($1, $2)`, [userId, blockedId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo bloquear al usuario')
    }
  }

  static async unlockUser({ userId, blockedId }) {
    if (userId === blockedId) {
      throw new Error('Error de identificador')
    }

    const result = await pool.query(`DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`, [userId, blockedId])

    if (result.rowCount === 0) {
      throw new Error('No se pudo desbloquear al usuario')
    }
  }

  static async getUsersByUsername({ username, userId }) {
    const result = await pool.query(`
    SELECT id, display_name, username, profile_picture FROM users
    WHERE username ILIKE $1 AND id != $2`, [`%${username}%`, userId])

    if (result.rowCount === 0) {
      throw new Error('No se encontro ningun usuario')
    }

    return result.rows
  }
}
