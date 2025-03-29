import autoBind from "auto-bind"

class PlaylistSongsHandler {
  constructor(playlistsService, playlistSongsService, activitiesService, cacheService, validator) {
    this._playlistsService = playlistsService
    this._playlistSongsService = playlistSongsService
    this._activitiesService = activitiesService
    this._cacheService = cacheService
    this._validator = validator
    autoBind(this)
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistsSongPayload(request.payload)
    const { id: playlistId } = request.params
    const { id: userId } = request.auth.credentials
    const { songId } = request.payload

    await this._playlistSongsService.verifySongExist(songId)
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)
    await this._playlistSongsService.addSongToPlaylist(playlistId, songId)
    await this._activitiesService.addActivity(playlistId, songId, userId, "add")

    const response = h.response({
      status: "success",
      message: "Song added to playlist successfully",
    })

    response.code(201)
    return response
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`)
      const playlist = JSON.parse(result)

      const response = h.response({
        status: "success",
        data: { playlist },
      })

      response.header("X-Data-Source", "cache")
      return response
    } catch (error) {
      const playlist = await this._playlistSongsService.getPlaylistSongs(playlistId)

      return h.response({
        status: "success",
        data: { playlist },
      })
    }
  }

  async deletePlaylistSongHandler(request, h) {
    await this._validator.validateDeletePlaylistsSongPayload(request.payload)
    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

    const { songId } = request.payload
    await this._playlistSongsService.deletePlaylistSong(songId)
    await this._activitiesService.addActivity(playlistId, songId, userId, "delete")

    return h.response({
      status: "success",
      message: "Song removed from playlist successfully",
    })
  }
}

export default PlaylistSongsHandler

