import { getFileUrl, uploadFile } from "../../config/firebaseConfig.js";
import { pool } from "../connection/db.js";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export class MessagesRepository {
  static async createMessage({
    userId,
    chatId,
    replyId,
    content,
    type,
    fileUrl,
    forwardedId,
  }) {
    const result = await pool.query(
      `
    INSERT INTO messages (chat_id, sender_id, reply_to_id, content, type, file_url, forwarded_from_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `,
      [
        chatId,
        userId,
        replyId || null,
        content,
        type,
        fileUrl,
        forwardedId || null,
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo crear el mensaje");
    }

    const messageId = result.rows[0].id;

    if (fileUrl) {
      const { url, fileName, fileSize, width, height } =
        await this.uploadFileMessage({ messageId, fileUrl });

      if (!url) {
        throw new Error("No se pudo subir el archivo del mensaje");
      }

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

      const r = await pool.query(
        `INSERT INTO media_files (message_id, file_size, width, height, file_name)
        VALUES ($1, $2, $3, $4, $5)`,
        [messageId, fileSize, width, height, fileName]
      );

      if (r.rowCount === 0) {
        throw new Error("No se pudo guardar la información del archivo");
      }
    }

    return this.getMessage({ messageId });
  }

  static async getMessage({ messageId }) {
    const result = await pool.query(
      `
      SELECT
  m.id AS message_id,
  m.content,
  m.type,
  m.file_url,
  m.sent_at,
  m.edited_at,

  -- Usuario que envió el mensaje
  u.id AS sender_id,
  u.display_name AS sender_name,
  u.profile_picture AS sender_avatar,
  u.username AS sender_username

FROM messages m
JOIN users u ON m.sender_id = u.id

WHERE m.id = $1
GROUP BY
  m.id,
  u.id
ORDER BY m.sent_at ASC;
`,
      [messageId]
    );

    if (result.rowCount === 0) {
      throw new Error("Mensaje no encontrado");
    }
    return result.rows[0];
  }

  static async getMessages({ chatId }) {
    const result = await pool.query(
      `
    SELECT
  m.id AS message_id,
  m.content,
  m.type,
  m.file_url,
  m.sent_at,
  m.edited_at,

  -- Usuario que envió el mensaje
  u.id AS sender_id,
  u.display_name AS sender_name,
  u.profile_picture AS sender_avatar,
  u.username AS sender_username

FROM messages m
JOIN users u ON m.sender_id = u.id

WHERE m.chat_id = $1
GROUP BY
  m.id,
  u.id
ORDER BY m.sent_at ASC;
`,
      [chatId]
    );

    return result.rows;
  }

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
          console.error("Error al obtener dimensiones de imagen:", err);
        }
      }

      // 4. Subida a Firebase
      const extension = path.extname(originalname);
      const destination = `messages/file/${messageId}${extension}`;

      console.log("Subiendo archivo a Firebase:", destination);
      await uploadFile(filePath, destination);

      console.log("Obteniendo URL del archivo...");
      const url = await getFileUrl(destination);
      console.log("URL obtenida:", url);

      // 5. Borrar el archivo local
      try {
        await fs.unlink(filePath);
        console.log("Archivo local eliminado:", filePath);
      } catch (err) {
        console.error("Error al borrar el archivo:", err);
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
      console.error("Error en uploadFileMessage:", error);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  }
}
