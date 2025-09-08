import { pool } from "../connection/db.js";

export class PrivateChatsRepository {
    static async createPrivateChat({ userId, privateUser }) {
        // Comprueba si ya habia un chat entre estos dos usuarios, para no tener que crear uno nuevo
       const id = await this.hasBeenCreatedChatBefore({ userId, privateUser })

       if (id) return id

       const result = await pool.query(`
       INSERT INTO chats (type, owner_id)
       VALUES ('private', $1)
       RETURNING id`, [userId])

       if (result.rowCount === 0) {
        throw new Error('No se pudo crear el chat privado')
       }

       const privateChatId = result.rows[0].id;

       const res = await pool.query(`
       INSERT INTO chat_members (chat_id, user_id, role)
       VALUES ($1, $2, 'owner')`, [privateChatId, userId])

       if (res.rowCount === 0) {
        throw new Error('No se agregar al usuario')
       }

       const r = await pool.query(`
       INSERT INTO chat_members (chat_id, user_id)
       VALUES ($1, $2)`, [privateChatId, privateUser])

       if (r.rowCount === 0) {
        throw new Error('No se agregar al usuario')
       }

       return privateChatId
    }

    static async getPrivateChat({ privateChatId, userId }) {
        const result = await pool.query(`
        SELECT 
        u.profile_picture, 
        u.display_name, 
        u.username,
        u.bio,
        us.last_active
        FROM chat_members ch
        JOIN users u ON ch.user_id = u.id
        LEFT JOIN user_sessions us ON u.id = us.user_id
        WHERE ch.chat_id = $1
        AND ch.user_id != $2;`, [privateChatId, userId])

        if (result.rowCount === 0) {
            throw new Error('No se encontró el chat privado')
        }

        return result.rows[0]
    }

    static async hasBeenCreatedChatBefore({ userId, privateUser }) {
        const result = await pool.query(`
        SELECT c.id
        FROM chats c
        JOIN chat_members cm ON c.id = cm.chat_id
        WHERE c.type = 'private'
        AND cm.user_id IN ($1, $2)
        GROUP BY c.id
        HAVING COUNT(*) = 2;`, [userId, privateUser])

        return result.rows[0]?.id
    }
}