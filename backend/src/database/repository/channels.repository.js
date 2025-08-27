import { getDefaultPicture } from "../../utils/getDefaultPicture.js";
import { uploadImageToStorage } from "../../utils/uploadImageToStorage.js";
import { pool } from "../connection/db.js";

export class ChannelsRepository {
  /**
   * Crea un nuevo canal en la base de datos.
   * Si se envía una imagen, la sube y actualiza la URL en el canal.
   * También agrega al usuario como owner en chat_members.
   * @param {Object} params - { title, description, picture, userId }
   * @returns {Promise<number>} - El ID del canal creado
   */
  static async createChannel({ title, description, picture, userId }) {
    let pictureUrl = getDefaultPicture(title);

    const result = await pool.query(
      `
    INSERT INTO chats (type, title, description, picture, is_public, owner_id)
    VALUES ('channel', $1, $2, $3, true, $4)
    RETURNING id`,
      [title, description, pictureUrl, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el canal");
    }

    const channelId = result.rows[0].id;

    if (picture) {
      const uploadedUrl = await uploadImageToStorage(
        `channels/picture/${channelId}.png`,
        picture
      );

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

    return channelId;
  }

  /**
   * Obtiene los datos de un canal por su ID, incluyendo cantidad de miembros y username del owner.
   * @param {Object} params - { channelId }
   * @returns {Promise<Object>} - Datos del canal
   */
  static async getChannel({ channelId }) {
    const result = await pool.query(
      `
    SELECT c.picture, c.title, COUNT(ch.user_id) AS quantity_members, u.username AS owner_username FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
	  JOIN users u ON u.id = ch.user_id
    WHERE c.id = $1
   	AND ch.role = 'owner'
    GROUP BY c.picture, c.title, ch.chat_id, u.username`,
      [channelId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se encontro el canal");
    }

    return result.rows[0];
  }

  /**
   * Agrega al usuario como miembro del canal.
   * @param {Object} params - { channelId, userId }
   * @returns {Promise<void>}
   */
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

  /**
   * Elimina al usuario de los miembros del canal.
   * @param {Object} params - { channelId, userId }
   * @returns {Promise<void>}
   */
  static async getOut({ channelId, userId }) {
    const result = await pool.query(
      `DELETE FROM chat_members WHERE chat_id = $1 AND user_id = $2`,
      [channelId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No pudiste irte del canal");
    }
  }

  /**
   * Edita los datos de un canal (título, descripción, imagen y visibilidad).
   * Si se envía una nueva imagen, la sube y actualiza la URL.
   * @param {Object} params - { channelId, title, description, picture, is_public }
   * @returns {Promise<void>}
   */
  static async editChannel({
    channelId,
    title,
    description,
    picture,
    is_public,
  }) {
    if (picture) {
      const uploadedUrl = await uploadImageToStorage(
        `channels/picture/${channelId}.png`,
        picture
      );
      picture = uploadedUrl;
    }

    const result = await pool.query(
      `
    UPDATE chats 
    SET title = COALESCE($1, title), description = $2, picture = COALESCE($3, picture), is_public = $4
    WHERE id = $5`,
      [title, description, picture, is_public, channelId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo editar el grupo");
    }
  }

  /**
   * Elimina un canal por su ID.
   * @param {Object} params - { channelId }
   * @returns {Promise<void>}
   */
  static async deleteChannel({ channelId }) {
    const result = await pool.query(`DELETE FROM chats WHERE id = $1`, [
      channelId,
    ]);

    if (result.rowCount === 0) {
      throw new Error("No se pudo eliminar el canal");
    }
  }

  /**
   * Busca canales por nombre (case-insensitive), devolviendo título, imagen, tipo y cantidad de miembros.
   * @param {Object} params - { name }
   * @returns {Promise<Array>} - Lista de canales encontrados
   */
  static async getChannelsByName({ name }) {
    const result = await pool.query(
      `
    SELECT title, picture, type, COUNT(ch.user_id) AS quantity_members FROM chats c
    JOIN chat_members ch ON ch.chat_id = c.id
    WHERE title ILIKE $1
    GROUP BY c.title, c.picture, c.type`,
      [`%${name}%`]
    );

    if (result.rowCount === 0) {
      throw new Error("No se encontraron canales");
    }

    return result.rows;
  }
}
