const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
// const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool()
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(16)}`

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError("Collaboration gagal ditambahkan")
    }

    return result.rows[0].id
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Collaboration gagal dihapus. Id tidak ditemukan")
    }
  }

  async verifyCollaboration({ playlistId, userId }) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return false
    }
    return true
  }

  async getCollaborationPlaylists(userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE user_id = $1",
      values: [userId],
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = CollaborationsService

