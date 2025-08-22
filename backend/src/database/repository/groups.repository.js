import { getDefaultPicture } from "../../utils/getDefaultPicture.js";
import { uploadImageToStorage } from "../../utils/uploadImageToStorage.js";
import { pool } from "../connection/db.js";

export class GroupsRepository {
  /**
   * Crea un grupo
   * @param picture - Imagen del grupo (opcional)
   * @param title - Titulo del grupo
   * @param userId - Id del usuario que crea el grupo (será el dueño)
   * @returns string - Retorna el id del grupo creado
   **/
  static async createGroup({ picture, title, userId }) {
    let pictureUrl = getDefaultPicture(title);

    const createdGroup = await pool.query(
      `
      INSERT INTO chats (type, picture, title, owner_id)
      VALUES ('group', $1, $2, $3)
      RETURNING id
      `,
      [pictureUrl, title, userId]
    );

    if (!createdGroup.rowCount) throw new Error("No se pudo crear el grupo");

    const groupId = createdGroup.rows[0].id;

    const addOwner = await pool.query(
      `INSERT INTO chat_members (chat_id, user_id, role) 
       VALUES ($1, $2, $3)`,
      [groupId, userId, "owner"]
    );

    if (!addOwner.rowCount)
      throw new Error("No se pudo agregar al dueño del grupo");

    if (picture) {
      const url = await uploadImageToStorage(`groups/picture/${groupId}.png`, picture);

      const updatePicture = await pool.query(
        `UPDATE chats SET picture = $1 WHERE id = $2`,
        [url, groupId]
      );

      if (!updatePicture.rowCount)
        throw new Error("No se pudo subir la imagen del grupo");
    }

    return groupId;
  }

  /**
   * Obtiene la información del grupo
   * @param groupId - Id del grupo
   * @returns {Object} - Información del grupo (picture, title, quantity_members)
   * @throws {Error} - Si no se encuentra el grupo
   */
  static async getGroup({ groupId, userId }) {
    const group = await pool.query(
      `
    SELECT c.picture, c.title, c.is_public, c.description, COUNT(ch.user_id) AS quantity_members, ch.role FROM chats c
    JOIN chat_members ch ON c.id = ch.chat_id
    WHERE c.id = $1
	  AND ch.user_id = $2
    GROUP BY c.picture, c.title, c.is_public, c.description, ch.role
    `,
      [groupId, userId]
    );

    if (!group.rowCount) throw new Error("No se encontro el grupo");

    return group.rows[0];
  }

  /**
   * Sale de un grupo
   * @param userId - Id del usuario que sale
   * @param groupId - Id del grupo
   * @throws {Error} - Si no se pudo eliminar al miembro
   */
  static async getOut({ userId, groupId }) {
    const removeMember = await pool.query(
      `DELETE FROM chat_members WHERE user_id = $1 AND chat_id = $2`,
      [userId, groupId]
    );

    if (!removeMember.rowCount) {
      throw new Error("No pudiste salir del grupo");
    }
  }

  /**
   * Elimina un grupo
   * @param groupId - Id del grupo a eliminar
   */
  static async deleteGroup({ groupId }) {
    const deletedGroup = await pool.query(`DELETE FROM chats WHERE id = $1`, [
      groupId,
    ]);

    if (!deletedGroup.rowCount) {
      throw new Error("No se pudo borrar el grupo");
    }
  }

  /**
   * Edita un grupo
   * @param groupId - Id del grupo a editar
   * @param title - Nuevo título del grupo
   * @param description - Nueva descripción del grupo
   * @param picture - Nueva imagen del grupo
   * @param is_public - Nuevo estado de visibilidad del grupo
   */
  static async editGroup({ groupId, title, description, picture, is_public }) {
    if (picture) {
      const uploadedUrl = await uploadImageToStorage(`groups/picture/${groupId}.png`, picture);
      picture = uploadedUrl;
    }

    const updatedGroup = await pool.query(
      `
    UPDATE chats 
    SET title = COALESCE($1, title), description = $2, picture = COALESCE($3, picture), is_public = $4
    WHERE id = $5`,
    [title, description, picture, is_public, groupId]
    );

    if (!updatedGroup.rowCount) throw new Error("No se pudo editar el grupo");

    const groupData = {
      title,
      description,
      picture,
      is_public
    }

    return groupData;
  }

  /**
   * Agrega un miembro al grupo
   * @param groupId - Id del grupo
   * @param userId - Id del usuario
   */
  static async joinGroup({ groupId, userId }) {
    const imMember = await this.isMember({ groupId, userId });

    if (imMember) throw new Error("Ya estas en el grupo");

    const insertMember = await pool.query(
      `
    INSERT INTO chat_members (chat_id, user_id)
    VALUES ($1, $2)`,
      [groupId, userId]
    );

    if (!insertMember.rowCount) throw new Error("No pudiste unirte al grupo");
  }

  /**
   * Elimina un miembro del grupo
   * @param groupId - Id del grupo
   * @param userId - Id del usuario
   */
  static async removeMember({ groupId, userId }) {
    const removedMember = await pool.query(
      `DELETE FROM chat_members WHERE chat_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (!removedMember.rowCount) throw new Error("Miembro no eliminado");
  }

  /**
   * Verifica si un usuario es miembro del grupo
   * @param groupId - Id del grupo
   * @param userId - Id del usuario
   */
  static async isMember({ groupId, userId }) {
    const isMemberUser = await pool.query(
      `SELECT 1 FROM chat_members WHERE chat_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    return isMemberUser.rowCount > 0;
  }

  /**
   * Obtiene grupos por nombre
   * @param name - Nombre del grupo
   * @returns {Array} - Lista de grupos que coinciden con el nombre
   * @throws {Error} - Si no se encuentra ningún grupo
   */
  static async getGroupsByName({ name }) {
    const groups = await pool.query(
      `
      SELECT title, picture, type, COUNT(ch.user_id) AS quantity_members FROM chats c
      JOIN chat_members ch ON ch.chat_id = c.id
      WHERE title ILIKE $1
      GROUP BY c.title, c.picture, c.type
      `,
      [`%${name}%`]
    );

    if (!groups.rowCount) throw new Error("Grupo no encontrado");

    return groups.rows[0];
  }

  static async getMembers({ groupId }) {
    const members = await pool.query(
      `
    SELECT 
    u.id, 
    u.username, 
    u.display_name, 
    u.profile_picture, 
    cm.role, 
    cm.is_muted, 
    MAX(us.last_active) AS last_active
    FROM chat_members cm
    JOIN users u ON cm.user_id = u.id
    JOIN user_sessions us ON us.user_id = u.id
    WHERE cm.chat_id = $1
    GROUP BY u.id, u.username, u.display_name, u.profile_picture, cm.role, cm.is_muted;
      `,
      [groupId]
    );

    if (!members.rowCount) throw new Error("No se encontraron miembros del grupo");

    return members.rows;
  }
}
