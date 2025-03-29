import pool from "../config/database.js"
import InvariantError from "../exceptions/InvariantError.js"
import { nanoid } from "nanoid"
import NotFoundError from "../exceptions/NotFoundError.js"

class SongsService {
  constructor() {
    this._pool = pool
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to add new song")
    }

    return rows[0].id
  }

  async getSongs({ title, performer }) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
      values: [`%${title}%`, `%${performer}%`],
    }

    const { rows } = await this._pool.query(query)

    return rows
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Song not found")
    }

    return rows[0]
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Song not found")
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Song not found")
    }
  }
}

export default SongsService

