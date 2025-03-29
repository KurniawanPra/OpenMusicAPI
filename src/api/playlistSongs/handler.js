const AuthorizationError = require("../../exceptions/AuthorizationError")

class PlaylistSongsHandler {
  constructor(service, validator, playlistsService, songsService, usersService, collabsService, activitiesService) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._usersService = usersService
    this._collabsService = collabsService
    this._activitiesService = activitiesService
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const playlistId = request.params.id
    const { songId } = request.payload

    await this._songsService.getSongById(songId)

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

    await this._service.addPlaylistSong({ playlistId, songId })

    await this._activitiesService.addActivities({
      playlistId,
      song_id: songId,
      user_id: credentialId,
      action: "add",
    })

    const response = h.response({
      status: "success",
      message: "Playlist song berhasil ditambahkan",
    })
    response.code(201)
    return response
  }

  async getPlaylistSongsHandler(request) {
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

    const playlist = await this._playlistsService.getPlaylistById(playlistId)

    const playlistSongs = await this._service.getPlaylistSongsByPlaylistId(playlistId)

    const songs = await Promise.all(
      playlistSongs.map(async (playlistSong) => {
        const song = await this._songsService.getSongById(playlistSong.song_id)
        return song
      }),
    )

    const { username } = await this._usersService.getUserById(playlist.owner)

    return {
      status: "success",
      message: "Playlist songs berhasil ditemukan",
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username,
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      },
    }
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePostPlaylistSongPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const playlistId = request.params.id
    const { songId } = request.payload

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

    await this._service.deletePlaylistSongBySongId(songId)

    await this._activitiesService.addActivities({
      playlistId,
      song_id: songId,
      user_id: credentialId,
      action: "delete",
    })

    return {
      status: "success",
      message: "Playlist song berhasil dihapus",
    }
  }
}

module.exports = PlaylistSongsHandler

