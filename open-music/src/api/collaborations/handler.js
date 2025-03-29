import autoBind from "auto-bind"

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._validator = validator
    autoBind(this)
  }

  async postCollaborationHandler(request, h) {
    await this._validator.validatePostCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwnership(playlistId, credentialId)
    await this._collaborationsService.verifyCollaboratorExist(userId)
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId)

    const response = h.response({
      status: "success",
      data: { collaborationId },
    })

    response.code(201)
    return response
  }

  async deleteCollaborationHandler(request, h) {
    await this._validator.validateDeleteCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwnership(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return h.response({
      status: "success",
      message: "Collaborator removed successfully",
    })
  }
}

export default CollaborationsHandler

