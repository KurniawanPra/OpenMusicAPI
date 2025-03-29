import pool from "../config/database.js"
import { nanoid } from "nanoid"
import InvariantError from "../exceptions/InvariantError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import AuthorizationError from "../exceptions/AuthorizationError.js"

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = pool
    this._collaborationsService = collaborationsService
    this._cacheService = cacheService
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to add new playlist")
    }

    await this._cacheService.delete(`playlist:${owner}`)

    return rows[0].id
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT users.username, playlists.id, playlists.name
                   FROM playlists
                            INNER JOIN users ON playlists.owner = users.id
                            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                   WHERE playlists.owner = $1
                      OR collaborations.user_id = $1
                   GROUP BY playlists.id, users.username`,
      values: [owner],
    }

    const { rows } = await this._pool.query(query)

    await this._cacheService.set(`playlist:${owner}`, JSON.stringify(rows))

    return rows
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING owner",
      values: [id],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Playlist not found")
    }

    await this._cacheService.delete(`playlist:${rows[0].owner}`)
  }

  async verifyPlaylistOwnership(id, owner) {
    const query = {
      text: "SELECT owner from playlists WHERE id = $1",
      values: [id],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Playlist not found")
    }

    if (owner !== rows[0].owner) {
      throw new AuthorizationError("You do not have rights to access this resource")
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwnership(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

export default PlaylistsService

