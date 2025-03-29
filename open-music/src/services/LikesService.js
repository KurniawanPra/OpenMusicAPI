import pool from "../config/database.js"
import { nanoid } from "nanoid"
import InvariantError from "../exceptions/InvariantError.js"

class LikesService {
  constructor(cacheService) {
    this._pool = pool
    this._cacheService = cacheService
  }

  async verifyLike(userId, albumId) {
    const query = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    }

    const { rowCount } = await this._pool.query(query)

    if (rowCount) {
      throw new InvariantError("You have liked this album before")
    }
  }

  async addLike(userId, albumId) {
    const id = `like-${nanoid(16)}`

    const query = {
      text: "INSERT INTO user_album_likes VALUES ($1, $2, $3)",
      values: [id, userId, albumId],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to add like to album")
    }

    this._cacheService.delete(`likes:${albumId}`)
  }

  async countLikes(albumId) {
    const query = {
      text: "SELECT COUNT(user_id) FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    }

    const { rows } = await this._pool.query(query)

    const parsedResult = Number.parseInt(rows[0].count)

    this._cacheService.set(`likes:${albumId}`, JSON.stringify(parsedResult))

    return parsedResult
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to delete like")
    }

    this._cacheService.delete(`likes:${albumId}`)
  }
}

export default LikesService

