import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class CollaborationController {
  constructor(collaborationRepository, playlistRepository, userRepository) {
    this.collaborationRepository = collaborationRepository
    this.playlistRepository = playlistRepository
    this.userRepository = userRepository
  }

  async addCollaboration(request, h) {
    SchemaValidator.validate(SchemaValidator.collaborationSchema, request.payload)

    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this.playlistRepository.verifyOwner(playlistId, credentialId)
    await this.userRepository.findById(userId)

    const collaborationId = await this.collaborationRepository.add(playlistId, userId)

    const response = h.response({
      status: "success",
      message: "Collaboration added successfully",
      data: {
        collaborationId,
      },
    })
    response.code(201)
    return response
  }

  async removeCollaboration(request) {
    SchemaValidator.validate(SchemaValidator.collaborationSchema, request.payload)

    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this.playlistRepository.verifyOwner(playlistId, credentialId)
    await this.userRepository.findById(userId)

    await this.collaborationRepository.remove(playlistId, userId)

    return {
      status: "success",
      message: "Collaboration removed successfully",
    }
  }
}

export default CollaborationController

