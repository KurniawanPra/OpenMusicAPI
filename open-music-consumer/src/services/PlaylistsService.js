class PlaylistsService {
  constructor(pool) {
    this._pool = pool
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name
             FROM playlists
             WHERE playlists.id = $1`,
      values: [playlistId],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new Error("Playlist not found")
    }

    return rows[0]
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM songs
             JOIN playlist_songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    }

    const { rows } = await this._pool.query(query)
    return rows
  }
}

export default PlaylistsService

