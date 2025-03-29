const AuthorizationError = require("../../exceptions/AuthorizationError")

class PlaylistSongActivitiesHandler {
  constructor(service, playlistsService, collabsService, usersService, songsService) {
    this._service = service
    this._playlistsService = playlistsService
    this._collabsService = collabsService
    this._usersService = usersService
    this._songsService = songsService
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlistId = request.params.id

    const isOwner = await this._playlistsService.verifyPlaylistOwnerV2({
      id: playlistId,
      owner: credentialId,
    })
    const isCollaborator = await this._collabsService.verifyCollaboration({
      playlistId,
      userId: credentialId,
    })
    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini")
    }

    const activityRecords = await this._service.getActivitiesByPlaylistId(playlistId)

    const activities = await Promise.all(
      activityRecords.map(async (act) => {
        const { username } = await this._usersService.getUserById(act.user_id)
        const { title } = await this._songsService.getSongById(act.song_id)
        return {
          username,
          title,
          action: act.action,
          time: act.time,
        }
      }),
    )

    const response = h.response({
      status: "success",
      data: {
        playlistId,
        activities,
      },
    })
    response.code(200)
    return response
  }
}

module.exports = PlaylistSongActivitiesHandler

