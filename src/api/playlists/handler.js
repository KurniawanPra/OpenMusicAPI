class PlaylistsHandler {
  constructor(service, validator, collabsService, usersService) {
    this._service = service
    this._validator = validator
    this._collabsService = collabsService
    this._usersService = usersService
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId })

    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials

    const playlists = await this._service.getPlaylistsByOwner(credentialId)

    const collabRecords = await this._collabsService.getCollaborationPlaylists(credentialId)
    const collabPlaylists = await Promise.all(
      collabRecords.map(async (record) => {
        const playlist = await this._service.getPlaylistById(record.playlist_id)
        return playlist
      }),
    )

    const allPlaylist = await Promise.all(
      [...playlists, ...collabPlaylists].map(async (pl) => {
        const { username } = await this._usersService.getUserById(pl.owner)
        return {
          id: pl.id,
          name: pl.name,
          username,
        }
      }),
    )

    return {
      status: "success",
      message: "Playlists berhasil ditemukan",
      data: {
        playlists: allPlaylist,
      },
    }
  }

  async deletePlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const playlistId = request.params.id

    await this._service.verifyPlaylistOwner({ id: playlistId, owner: credentialId })
    await this._service.deletePlaylistById(playlistId)

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    }
  }
}

module.exports = PlaylistsHandler

