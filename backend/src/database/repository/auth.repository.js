import { z } from "zod";
import { pool } from "../connection/db.js";
import bcrypt from "bcrypt";
import { dbErrorHandler } from "../../utils/dbErrorHandler.utils.js";

export class AuthRepository {
  static async register({ email, password, username, display_name }) {
    const userSchema = z.object({
      email: z.email(),
      password: z.string().min(8),
      username: z.string().min(3),
      display_name: z.string().min(1),
    });

    const parsed = userSchema.safeParse({
      email,
      password,
      username,
      display_name,
    });

    if (!parsed.success) {
      console.error("Errores de validación:", parsed.error.issues);
      throw new Error("Datos inválidos");
    }

    const validatedData = parsed.data;

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, username, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
        [
          validatedData.email,
          passwordHash,
          validatedData.username,
          validatedData.display_name,
        ]
      );

      if (result.rowCount === 0) {
        throw new Error("No se pudo crear el usuario");
      }

      const userId = result.rows[0].id;

      return userId;
    } catch (error) {
      dbErrorHandler(error);
    }
  }

  static async login({ username, password }) {
    const userSchema = z.object({
      username: z.string().min(3),
      password: z.string().min(8),
    });

    const parsed = userSchema.safeParse({
      username,
      password,
    });

    if (!parsed.success) {
      throw new Error("Datos inválidos");
    }

    const result = await pool.query(
      `SELECT id, username, password_hash FROM users WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      throw new Error("No existe el usuario");
    }

    const isValid = await bcrypt.compare(
      password,
      result.rows[0].password_hash
    );

    if (!isValid) {
      throw new Error("La contraseña no es válida");
    }

    return result.rows[0].id;
  }

  static async saveRefreshToken({ userId, refreshToken }) {
    await pool.query(
      `INSERT INTO user_sessions (user_id, token)
      VALUES ($1, $2)`,
      [userId, refreshToken]
    );
  }

  static async searchRefreshToken({ userId, refreshToken }) {
    const result = await pool.query(`SELECT id FROM user_sessions WHERE user_id = $1 AND token = $2`, [userId, refreshToken])

    if (result.rowCount === 0) {
      throw new Error("Refresh token inválido o expirado")
    }
  }

  static async updateRefreshToken({ newRefreshToken, userId, refreshToken }) {
    await pool.query(
      `UPDATE user_sessions
      SET token = $1, last_active = NOW()
      WHERE user_id = $2 AND token = $3`,
      [newRefreshToken, userId, refreshToken]
    );
  }

  static async deleteSessionUser({ userId }) {
    const result = await pool.query(`DELETE FROM user_sessions WHERE user_id = $1`, [userId])

    if (result.rowCount === 0) {
      throw new Error('No se encontró sesión activa para el usuario')
    }
    
  }
}
