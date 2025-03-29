import { nanoid } from "nanoid"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"

class PlaylistSongRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async add(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new ValidationError("Failed to add song to playlist")
    }

    return result.rows[0].id
  }

  async findByPlaylistId(playlistId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1",
      values: [playlistId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("No songs found in playlist")
    }

    return result.rows
  }

  async removeBySongId(songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1",
      values: [songId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Failed to remove song from playlist. Song not found")
    }
  }
}

export default PlaylistSongRepository

