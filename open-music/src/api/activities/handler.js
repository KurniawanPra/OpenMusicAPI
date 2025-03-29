import autoBind from "auto-bind"

class ActivitiesHandler {
  constructor(activitiesService, playlistsService) {
    this._activitiesService = activitiesService
    this._playlistsService = playlistsService
    autoBind(this)
  }

  async getActivitiesHandler(request, h) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const result = await this._activitiesService.getActivities(playlistId)

    return h.response({
      status: "success",
      data: result,
    })
  }
}

export default ActivitiesHandler

