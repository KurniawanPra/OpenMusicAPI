import pool from "../config/database.js"
import { nanoid } from "nanoid"
import InvariantError from "../exceptions/InvariantError.js"
import NotFoundError from "../exceptions/NotFoundError.js"

class AlbumsService {
  constructor(cacheService) {
    this._pool = pool
    this._cacheService = cacheService
  }

  async verifyAlbumExist(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Album not found")
    }
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to add new album")
    }

    await this._cacheService.delete(`album:${rows[0].id}`)

    return rows[0].id
  }

  async editAlbumCover(id, path) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
      values: [path, id],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to update album cover")
    }

    await this._cacheService.delete(`album:${id}`)
  }

  async getAlbumById(id) {
    const query = {
      text: `
        SELECT albums.id,
               albums.name,
               albums.year,
               albums.cover as "coverUrl",
               CASE
                 WHEN EXISTS (SELECT 1 FROM songs WHERE songs."albumId" = albums.id) THEN
                   json_agg(json_build_object('id', songs.id, 'performer', songs.performer, 'title',
                                              songs.title))
                 ELSE
                   '[]'
                 END AS songs
        FROM albums
               LEFT JOIN songs ON albums.id = songs."albumId"
        WHERE albums.id = $1
        GROUP BY albums.id, albums.name, albums.year;
      `,
      values: [id],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Album not found")
    }

    await this._cacheService.set(`album:${rows[0].id}`, JSON.stringify(rows[0]))

    return rows[0]
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Album not found")
    }

    await this._cacheService.delete(`album:${id}`)
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("Album not found")
    }

    await this._cacheService.delete(`album:${id}`)
  }
}

export default AlbumsService

