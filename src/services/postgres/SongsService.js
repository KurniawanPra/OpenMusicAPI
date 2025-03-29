const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const { mapDBToSongModel } = require("../../utils/mapDBToSongModel")

class SongsService {
  constructor() {
    this._pool = new Pool()
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16)
    const createdAt = Date.now()
    const updatedAt = createdAt

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan")
    }

    return result.rows[0].id
  }

  async getSongs({ title, performer }) {
    let query = "SELECT * FROM songs"

    const conditions = []

    if (title) {
      conditions.push(`title ILIKE '%${title}%'`)
    }

    if (performer) {
      conditions.push(`performer ILIKE '%${performer}%'`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    const result = await this._pool.query(query)

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }))
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan")
    }

    return result.rows.map(mapDBToSongModel)[0]
  }

  async getSongByAlbumId(id) {
    const query = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      return []
    }

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }))
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = Date.now()
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_Id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui Song. Id tidak ditemukan")
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan")
    }
  }

  async getSongsByArrayOfId(ids) {
    const query = {
      text: "SELECT * FROM songs WHERE id = ANY($1::text[])",
      values: [ids],
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan")
    }

    return result.rows.map(mapDBToSongModel)
  }
}

module.exports = SongsService

