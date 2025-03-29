import autoBind from "auto-bind"

class PlaylistsHandler {
  constructor(playlistsService, cacheService, validator) {
    this._playlistsService = playlistsService
    this._cacheService = cacheService
    this._validator = validator
    autoBind(this)
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload)
    const { id: userId } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this._playlistsService.addPlaylist(name, userId)

    const response = h.response({
      status: "success",
      data: { playlistId },
    })

    response.code(201)
    return response
  }

  async getPlaylistsHandler(request, h) {
    const { id: userId } = request.auth.credentials

    try {
      const result = await this._cacheService.get(`playlist:${userId}`)
      const playlists = JSON.parse(result)

      const response = h.response({
        status: "success",
        data: { playlists },
      })

      response.header("X-Data-Source", "cache")
      return response
    } catch (error) {
      const playlists = await this._playlistsService.getPlaylist(userId)

      return h.response({
        status: "success",
        data: { playlists },
      })
    }
  }

  async deletePlaylistsHandler(request, h) {
    const { id } = request.params
    const { id: userId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwnership(id, userId)
    await this._playlistsService.deletePlaylist(id)

    return h.response({
      status: "success",
      message: "Playlist deleted successfully",
    })
  }
}

export default PlaylistsHandler

