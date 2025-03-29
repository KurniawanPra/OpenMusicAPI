import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class PlaylistController {
  constructor(playlistRepository, collaborationRepository, userRepository) {
    this.playlistRepository = playlistRepository
    this.collaborationRepository = collaborationRepository
    this.userRepository = userRepository
  }

  async createPlaylist(request, h) {
    SchemaValidator.validate(SchemaValidator.playlistSchema, request.payload)

    const { id: userId } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this.playlistRepository.create({ name, owner: userId })

    const response = h.response({
      status: "success",
      message: "Playlist created successfully",
      data: {
        playlistId,
      },
    })
    response.code(201)
    return response
  }

  async getPlaylists(request) {
    const { id: userId } = request.auth.credentials

    const ownedPlaylists = await this.playlistRepository.findByOwner(userId)
    const collaborations = await this.collaborationRepository.findByUserId(userId)

    const collaboratedPlaylistIds = collaborations.map((collab) => collab.playlist_id)
    const collaboratedPlaylists =
      collaboratedPlaylistIds.length > 0 ? await this.playlistRepository.findByIds(collaboratedPlaylistIds) : []

    const allPlaylists = [...ownedPlaylists, ...collaboratedPlaylists]

    const playlistsWithUsername = await Promise.all(
      allPlaylists.map(async (playlist) => {
        const user = await this.userRepository.findById(playlist.owner)
        return playlist.toResponse(user.username)
      }),
    )

    return {
      status: "success",
      message: "Playlists retrieved successfully",
      data: {
        playlists: playlistsWithUsername,
      },
    }
  }

  async deletePlaylist(request) {
    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params

    await this.playlistRepository.verifyOwner(playlistId, userId)
    await this.playlistRepository.delete(playlistId)

    return {
      status: "success",
      message: "Playlist deleted successfully",
    }
  }
}

export default PlaylistController

