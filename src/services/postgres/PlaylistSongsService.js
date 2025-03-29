const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError("Playlist Song gagal ditambahkan")
    }

    return result.rows[0].id
  }

  async getPlaylistSongsByPlaylistId(playlistId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1",
      values: [playlistId],
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Playlist Song tidak ditemukan")
    }
    return result.rows
  }

  async deletePlaylistSongBySongId(songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1",
      values: [songId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("Playlist Song gagal dihapus. Id tidak ditemukan")
    }
  }
}

module.exports = PlaylistSongsService

