const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const AuthorizationError = require("../../exceptions/AuthorizationError")

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError("Playlist gagal ditambahkan")
    }

    return result.rows[0].id
  }

  async getPlaylistById(id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan")
    }
    return result.rows[0]
  }

  async getPlaylistsByOwner(owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [owner],
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return []
    }
    return result.rows
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1",
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan")
    }
  }

  async verifyPlaylistOwner({ id, owner }) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan")
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
    }
  }

  async verifyPlaylistOwnerV2({ id, owner }) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan")
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      return false
    }
    return true
  }

  async getPlaylistsByArrayOfId(ids) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = ANY($1::text[])",
      values: [ids],
    }
    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = PlaylistsService

