import { nanoid } from "nanoid"
import Playlist from "../../core/domain/playlist.js"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"
import ForbiddenError from "../../core/errors/forbidden-error.js"

class PlaylistRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async create(playlistData) {
    const { name, owner } = playlistData
    const playlistId = `playlist-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [playlistId, name, owner],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new ValidationError("Failed to create playlist")
    }

    return result.rows[0].id
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Playlist not found")
    }

    return Playlist.fromDatabase(result.rows[0])
  }

  async findByOwner(ownerId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [ownerId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      return []
    }

    return result.rows.map((row) => Playlist.fromDatabase(row))
  }

  async delete(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Failed to delete playlist. ID not found")
    }
  }

  async verifyOwner(playlistId, ownerId) {
    const playlist = await this.findById(playlistId)

    if (playlist.owner !== ownerId) {
      throw new ForbiddenError("You are not authorized to access this resource")
    }
  }

  async checkOwnership(playlistId, userId) {
    const playlist = await this.findById(playlistId)
    return playlist.owner === userId
  }

  async findByIds(ids) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = ANY($1::text[])",
      values: [ids],
    }

    const result = await this.dbPool.query(query)

    return result.rows.map((row) => Playlist.fromDatabase(row))
  }
}

export default PlaylistRepository

