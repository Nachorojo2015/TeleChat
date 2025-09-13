import { getFileUrl, uploadFile } from "../../config/firebaseConfig.js";
import { pool } from "../connection/db.js";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export class MessagesRepository {
  /**
   * Crea un nuevo mensaje en la base de datos.
   * Si hay archivo adjunto, lo sube a Firebase y guarda la info en media_files.
   * @param {Object} params - Datos del mensaje
   * @returns {Promise<Object>} - El mensaje creado
   */
  static async createMessage({
    userId,
    chatId,
    content,
    type,
    fileUrl,
  }) {

    const result = await pool.query(
      `
    INSERT INTO messages (chat_id, sender_id, content, type, file_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `,
      [
        chatId,
        userId,
        content,
        type,
        fileUrl,
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el mensaje");
    }

    const messageId = result.rows[0].id;

    // Si hay archivo adjunto, lo sube y guarda la info
    if (fileUrl) {
      const { url, fileName, fileSize, width, height } =
        await this.uploadFileMessage({ messageId, fileUrl });

      if (!url) {
        throw new Error("No se pudo subir el archivo del mensaje");
      }

      // Actualiza la URL del archivo en el mensaje
      const response = await pool.query(
        `UPDATE messages
      SET file_url = $1
      WHERE id = $2
    `,
        [url, messageId]
      );

      if (!response.rowCount) {
        throw new Error("No se pudo subir el archivo del mensaje");
      }

      // Guarda la información del archivo en media_files
      const r = await pool.query(
        `INSERT INTO media_files (message_id, file_size, width, height, file_name)
        VALUES ($1, $2, $3, $4, $5)`,
        [messageId, fileSize, width, height, fileName]
      );

      if (r.rowCount === 0) {
        throw new Error("No se pudo guardar la información del archivo");
      }
    }

    // Retorna el mensaje creado
    return this.getMessage({ messageId });
  }

  /**
   * Obtiene un mensaje por su ID, incluyendo datos del usuario que lo envió.
   * @param {Object} params - { messageId }
   * @returns {Promise<Object>} - El mensaje encontrado
   */
  static async getMessage({ messageId }) {
    const result = await pool.query(
      `
      SELECT
      m.id AS message_id,
      m.content,
      m.type,
      m.file_url,
      m.sent_at,

      -- Usuario que envió el mensaje
      u.id AS sender_id,
      u.display_name AS sender_name,
      u.profile_picture AS sender_avatar,
      u.username AS sender_username,

      -- Datos de la imagen
      md.width,
      md.height

    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN media_files md ON m.id = md.message_id

    WHERE m.id = $1
    GROUP BY
      m.id,
      u.id,
      md.width,
      md.height
    ORDER BY m.sent_at ASC;
    `,
      [messageId]
    );

    if (result.rowCount === 0) {
      throw new Error("Mensaje no encontrado");
    }

    return result.rows[0];
  }

  /**
   * Obtiene todos los mensajes de un chat, incluyendo datos del usuario que los envió.
   * @param {Object} params - { chatId }
   * @returns {Promise<Array>} - Lista de mensajes
   */
  static async getMessages({ chatId }) {
    const result = await pool.query(
      `
      SELECT
      m.id AS message_id,
      m.content,
      m.type,
      m.file_url,
      m.sent_at,

      -- Usuario que envió el mensaje
      u.id AS sender_id,
      u.display_name AS sender_name,
      u.profile_picture AS sender_avatar,
      u.username AS sender_username,

      -- Datos de la imagen
      md.width,
      md.height

    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN media_files md ON m.id = md.message_id

    WHERE m.chat_id = $1
    GROUP BY
      m.id,
      u.id,
      md.width,
      md.height
    ORDER BY m.sent_at ASC;
    `,
      [chatId]
    );

    return result.rows;
  }

  /**
   * Elimina un mensaje por su ID.
   * @param {Object} params - { messageId }
   * @returns {Promise<void>}
   */
  static async deleteMessage({ messageId }) {
    const result = await pool.query(
      `
    DELETE FROM messages
    WHERE id = $1`,
      [messageId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo borrar el mensaje");
    }
  }

  /**
   * Sube un archivo adjunto de mensaje a Firebase, obtiene su URL y dimensiones si es imagen.
   * Borra el archivo local después de subirlo.
   * @param {Object} params - { messageId, fileUrl }
   * @returns {Promise<Object>} - Información del archivo subido
   */
  static async uploadFileMessage({ messageId, fileUrl }) {
    try {
      const { path: filePath, originalname, mimetype } = fileUrl;

      // 1. Obtener nombre del archivo original
      const fileName = originalname;

      // 2. Obtener tamaño del archivo
      const stats = await fs.stat(filePath);
      const fileSize = stats.size; // en bytes

      // 3. Obtener dimensiones si es imagen
      let width = null;
      let height = null;

      if (mimetype.startsWith("image/")) {
        try {
          const metadata = await sharp(filePath).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (err) {
          throw new Error("No se pudo procesar la imagen", err);
        }
      }

      // 4. Subida a Firebase
      const extension = path.extname(originalname);
      const destination = `messages/file/${messageId}${extension}`;

      await uploadFile(filePath, destination);

      const url = await getFileUrl(destination);

      // 5. Borrar el archivo local
      try {
        await fs.unlink(filePath);
      } catch (err) {
        throw new Error("No se pudo borrar el archivo temporal", err);
      }

      // 6. Retornar lo necesario
      return {
        url,
        fileName,
        fileSize,
        width,
        height,
      };
    } catch (error) {
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  }
}