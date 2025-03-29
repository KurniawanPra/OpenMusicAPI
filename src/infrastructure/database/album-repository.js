import { nanoid } from "nanoid"
import Album from "../../core/domain/album.js"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"

class AlbumRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async create(albumData) {
    const { name, year } = albumData
    const albumId = nanoid(16)
    const timestamp = Date.now()

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id",
      values: [albumId, name, year, timestamp],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows[0].id) {
      throw new ValidationError("Failed to create album")
    }

    return albumId
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Album not found")
    }

    return Album.fromDatabase(result.rows[0])
  }

  async update(id, albumData) {
    const { name, year } = albumData
    const timestamp = Date.now()

    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, timestamp, id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Failed to update album. ID not found")
    }
  }

  async delete(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Failed to delete album. ID not found")
    }
  }
}

export default AlbumRepository

