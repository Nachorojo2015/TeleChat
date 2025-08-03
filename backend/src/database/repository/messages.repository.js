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
      const { url, fileName, fileSize, width, height } = await this.uploadFileMessage(
        { messageId, fileUrl }
      );

      console.log("Archivo subido:", url);

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
  }

  static async getMessages({ chatId }) {
    const result = await pool.query(
      `
    SELECT
  m.id AS message_id,
  m.content,
  m.type,
  m.file_url,
  m.deleted,
  m.pinned,
  m.sent_at,
  m.edited_at,

  -- Usuario que envió el mensaje
  u.id AS sender_id,
  u.display_name AS sender_name,
  u.profile_picture AS sender_avatar,

  -- Mensaje al que responde
  reply.id AS reply_id,
  reply.content AS reply_content,
  reply.type AS reply_type,

  -- Usuario original si es reenviado
  fwd.id AS forwarded_user_id,
  fwd.display_name AS forwarded_display_name,
  fwd.profile_picture AS forwarded_user_avatar,

  -- Reacciones agregadas
  COALESCE(
    JSON_AGG(
      DISTINCT JSONB_BUILD_OBJECT(
        'user_id', r.user_id,
        'reaction', r.reaction,
        'reacted_at', r.reacted_at
      )
    ) FILTER (WHERE r.user_id IS NOT NULL),
    '[]'
  ) AS reactions,

  -- Vistos por
  COALESCE(
    JSON_AGG(
      DISTINCT JSONB_BUILD_OBJECT(
        'user_id', v.user_id,
        'viewed_at', v.viewed_at
      )
    ) FILTER (WHERE v.user_id IS NOT NULL),
    '[]'
  ) AS views

FROM messages m
JOIN users u ON m.sender_id = u.id
LEFT JOIN messages reply ON m.reply_to_id = reply.id
LEFT JOIN users fwd ON m.forwarded_from_id = fwd.id
LEFT JOIN message_reactions r ON m.id = r.message_id
LEFT JOIN message_views v ON m.id = v.message_id

WHERE m.chat_id = $1
GROUP BY
  m.id,
  u.id,
  reply.id,
  fwd.id
ORDER BY m.sent_at ASC;

    ;
`,
      [chatId]
    );

    return result.rows;
  }

  static async deleteMessage({ messageId }) {
    const result = await pool.query(
      `
    UPDATE messages
    SET deleted = true
    WHERE id = $1`,
      [messageId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo borrar el mensaje");
    }
  }

  static async editMessage({ messageId, content }) {
    const isDeletedMessage = await this.isDeletedMessage({ messageId });

    if (isDeletedMessage) {
      throw new Error("El mensaje fue eliminado");
    }

    const result = await pool.query(
      `
    UPDATE messages
    SET content = $2, edited_at = NOW()
    WHERE id = $1`,
      [messageId, content]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo editar el mensaje");
    }
  }

  static async pinMessage({ messageId, chatId, userId }) {
    const isDeletedMessage = await this.isDeletedMessage({ messageId });

    if (isDeletedMessage) {
      throw new Error("El mensaje fue borrado");
    }

    const result = await pool.query(
      `
    INSERT INTO pinned_messages (chat_id, message_id, pinned_by)
    VALUES ($1, $2, $3)`,
      [chatId, messageId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo fijar el mensaje");
    }

    const r = await pool.query(
      `
    UPDATE messages
    SET pinned = true
    WHERE id = $1`,
      [messageId]
    );

    if (r.rowCount === 0) {
      throw new Error("No se pudo fijar el mensaje");
    }
  }

  static async unpinMessage({ messageId, chatId, userId }) {
    const isDeletedMessage = await this.isDeletedMessage({ messageId });

    if (isDeletedMessage) {
      throw new Error("El mensaje fue borrado");
    }

    const result = await pool.query(
      `
    DELETE FROM pinned_messages
    WHERE chat_id = $1 AND message_id = $2 AND pinned_by = $3`,
      [chatId, messageId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("Mensaje no existente");
    }

    const r = await pool.query(
      `
    UPDATE messages
    SET pinned = false
    WHERE id = $1`,
      [messageId]
    );

    if (r.rowCount === 0) {
      throw new Error("No se pudo desfijar el mensaje");
    }
  }

  static async viewMessage({ messageId, userId }) {
    // Chequea si el usuario ya vio el mensaje
    const check = await pool.query(
      `
    SELECT 1 FROM message_views
    WHERE message_id = $1 AND user_id = $2
    LIMIT 1
    `,
      [messageId, userId]
    );

    if (check.rowCount > 0) return;

    const result = await pool.query(
      `
    INSERT INTO message_views (message_id, user_id, viewed_at)
    VALUES ($1, $2, NOW())`,
      [messageId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo ver el mensaje");
    }
  }

  static async reactMessage({ messageId, userId, reaction }) {
    const result = await pool.query(
      `
    INSERT INTO message_reactions (message_id, user_id, reaction, reacted_at)
    VALUES ($1, $2, $3, NOW())`,
      [messageId, userId, reaction]
    );

    if (result.rowCount === 0) {
      throw new Error("No se pudo reaccionar al mensaje");
    }
  }

  static async isDeletedMessage({ messageId }) {
    const result = await pool.query(
      `
    SELECT 1 FROM messages WHERE id = $1
    AND deleted`,
      [messageId]
    );

    return result.rowCount > 0;
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
