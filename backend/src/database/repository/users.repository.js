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

  static async getUser({ userId }) {
    const result = await pool.query(`
    SELECT u.display_name, u.profile_picture, us.last_active FROM users u
    JOIN user_sessions us ON u.id = us.user_id
    WHERE u.id = $1`, [userId])

    return result.rows
  }
}
