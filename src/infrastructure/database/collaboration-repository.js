import { nanoid } from "nanoid"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"

class CollaborationRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async add(playlistId, userId) {
    const id = `collab-${nanoid(16)}`

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new ValidationError("Failed to add collaboration")
    }

    return result.rows[0].id
  }

  async remove(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Failed to remove collaboration. Collaboration not found")
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    }

    const result = await this.dbPool.query(query)

    return result.rowCount > 0
  }

  async findByUserId(userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE user_id = $1",
      values: [userId],
    }

    const result = await this.dbPool.query(query)

    return result.rows
  }
}

export default CollaborationRepository

