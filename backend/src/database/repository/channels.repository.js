import { getFileUrl, uploadFile } from "../../config/firebaseConfig.js";
import { pool } from "../connection/db.js";

export class ChannelsRepository {
  static async createChannel({ title, picture, userId }) {
    let pictureUrl = `https://ui-avatars.com/api/?size=128&length=1&name=${encodeURIComponent(
      title.charAt(0)
    )}&bold=true`;

    const result = await pool.query(
      `
    INSERT INTO chats (type, title, picture, is_public, owner_id)
    VALUES ('channel', $1, $2, true, $3)
    RETURNING id`,
      [title, pictureUrl, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el canal");
    }

    const channelId = result.rows[0].id;

    if (picture) {
      const uploadedUrl = await this.uploadPictureChannel({ channelId, picture })

      await pool.query(`UPDATE chats SET picture = $1 WHERE id = $2`, [
        uploadedUrl,
        channelId,
      ]);
    }

    const res = await pool.query(
      `
    INSERT INTO chat_members (chat_id, user_id, role)
    VALUES ($1, $2, 'owner')`,
      [channelId, userId]
    );

    if (res.rowCount === 0) {
      throw new Error("No se puedo agregar al usuario");
    }
  }

  static async uploadPictureChannel({ channelId, picture }) {
    const destination = `channels/picture/${channelId}.png`;

    await uploadFile(picture.path, destination);

    const fileUrl = await getFileUrl(destination);

    return fileUrl;
  }

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
      throw new Error("No se encontro el canal");
    }

    return result.rows[0];
  }

  static async joinChannel({ channelId, userId }) {
    const result = await pool.query(
      `
    INSERT INTO chat_members (chat_id, user_id, is_muted)
    VALUES ($1, $2, $3)`,
      [channelId, userId, null]
    );

    if (result.rowCount === 0) {
      throw new Error("No pudiste unirte al canal");
    }
  }

  static async getOut({ channelId, userId }) {
    const result = await pool.query(
      `DELETE FROM chat_members WHERE chat_id = $1 AND user_id = $2`,
      [channelId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No pudiste irte del canal");
    }
  }

  static async editChannel({ channelId, title, description, picture, is_public }) {
    if (picture) {
      const uploadedUrl = await this.uploadPictureChannel({ picture, channelId });

      picture = uploadedUrl
    }

    const result = await pool.query(
      `
    UPDATE chats 
    SET title = $1, description = $2, picture = $3, is_public = $4
    WHERE id = $5`,
    [title, description, picture, is_public, channelId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo editar el grupo");
    }
  }

  static async deleteChannel({ channelId }) {
    const result = await pool.query(`DELETE FROM chats WHERE id = $1`, [
      channelId,
    ]);

    if (result.rowCount === 0) {
      throw new Error("No se pudo eliminar el canal");
    }
  }
}
