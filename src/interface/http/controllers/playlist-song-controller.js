import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"
import ForbiddenError from "../../../core/errors/forbidden-error.js"

class PlaylistSongController {
  constructor(
    playlistSongRepository,
    playlistRepository,
    songRepository,
    userRepository,
    collaborationRepository,
    activityRepository,
  ) {
    this.playlistSongRepository = playlistSongRepository
    this.playlistRepository = playlistRepository
    this.songRepository = songRepository
    this.userRepository = userRepository
    this.collaborationRepository = collaborationRepository
    this.activityRepository = activityRepository
  }

  async addSongToPlaylist(request, h) {
    SchemaValidator.validate(SchemaValidator.playlistSongSchema, request.payload)

    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params
    const { songId } = request.payload

    await this.songRepository.findById(songId)

    const isOwner = await this.playlistRepository.checkOwnership(playlistId, userId)
    const isCollaborator = await this.collaborationRepository.verifyCollaborator(playlistId, userId)

    if (!isOwner && !isCollaborator) {
      throw new ForbiddenError("You are not authorized to access this resource")
    }

    await this.playlistSongRepository.add(playlistId, songId)

    await this.activityRepository.add({
      playlistId,
      songId,
      userId,
      action: "add",
    })

    const response = h.response({
      status: "success",
      message: "Song added to playlist successfully",
    })
    response.code(201)
    return response
  }

  async getPlaylistSongs(request) {
    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params

    const isOwner = await this.playlistRepository.checkOwnership(playlistId, userId)
    const isCollaborator = await this.collaborationRepository.verifyCollaborator(playlistId, userId)

    if (!isOwner && !isCollaborator) {
      throw new ForbiddenError("You are not authorized to access this resource")
    }

    const playlist = await this.playlistRepository.findById(playlistId)
    const playlistSongs = await this.playlistSongRepository.findByPlaylistId(playlistId)

    const songIds = playlistSongs.map((ps) => ps.song_id)
    const songs = await Promise.all(songIds.map((id) => this.songRepository.findById(id)))

    const owner = await this.userRepository.findById(playlist.owner)

    return {
      status: "success",
      message: "Playlist songs retrieved successfully",
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: owner.username,
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      },
    }
  }

  async removeSongFromPlaylist(request) {
    SchemaValidator.validate(SchemaValidator.playlistSongSchema, request.payload)

    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params
    const { songId } = request.payload

    const isOwner = await this.playlistRepository.checkOwnership(playlistId, userId)
    const isCollaborator = await this.collaborationRepository.verifyCollaborator(playlistId, userId)

    if (!isOwner && !isCollaborator) {
      throw new ForbiddenError("You are not authorized to access this resource")
    }

    await this.playlistSongRepository.removeBySongId(songId)

    await this.activityRepository.add({
      playlistId,
      songId,
      userId,
      action: "delete",
    })

    return {
      status: "success",
      message: "Song removed from playlist successfully",
    }
  }
}

export default PlaylistSongController

