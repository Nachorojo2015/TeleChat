import { uploadImageToStorage } from "../../utils/uploadImageToStorage.js";
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

  static async getUsersByUsername({ username, userId }) {
    const result = await pool.query(
      `
    SELECT id, display_name, username, profile_picture FROM users
    WHERE username ILIKE $1 AND id != $2`,
      [`%${username}%`, userId]
    );

    return result.rows;
  }

  static async editProfile({ userId, file, displayName, bio }) {
    if (file) {
      const fileUrl = await uploadImageToStorage(`users/profile-picture/${userId}.png`, file);
      file = fileUrl;
    }

    const result = await pool.query(
      `
    UPDATE users
    SET profile_picture = COALESCE($1, profile_picture), 
    display_name = COALESCE($2, display_name), 
    bio = $3
    WHERE id = $4`,
      [file, displayName, bio, userId]
    );

    if (result.rowCount === 0)
      throw new Error("No se pudo actualizar la imagen");
  }
}
