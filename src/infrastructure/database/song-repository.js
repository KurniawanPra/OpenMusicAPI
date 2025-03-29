import { nanoid } from "nanoid"
import Song from "../../core/domain/song.js"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"

class SongRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async create(songData) {
    const { title, year, genre, performer, duration, albumId } = songData

    const songId = nanoid(16)
    const timestamp = Date.now()

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id",
      values: [songId, title, year, genre, performer, duration, albumId, timestamp],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows[0].id) {
      throw new ValidationError("Failed to create song")
    }

    return songId
  }

  async findAll(filters = {}) {
    const { title, performer } = filters
    let queryText = "SELECT * FROM songs"
    const conditions = []

    if (title) {
      conditions.push(`title ILIKE '%${title}%'`)
    }

    if (performer) {
      conditions.push(`performer ILIKE '%${performer}%'`)
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(" AND ")}`
    }

    const result = await this.dbPool.query(queryText)

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }))
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Song not found")
    }

    return Song.fromDatabase(result.rows[0])
  }

  async findByAlbumId(albumId) {
    const query = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [albumId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      return []
    }

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }))
  }

  async update(id, songData) {
    const { title, year, genre, performer, duration, albumId } = songData

    const timestamp = Date.now()

    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, timestamp, id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Failed to update song. ID not found")
    }
  }

  async delete(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Failed to delete song. ID not found")
    }
  }

  async findByIds(ids) {
    const query = {
      text: "SELECT * FROM songs WHERE id = ANY($1::text[])",
      values: [ids],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError("Songs not found")
    }

    return result.rows.map((row) => Song.fromDatabase(row))
  }
}

export default SongRepository

