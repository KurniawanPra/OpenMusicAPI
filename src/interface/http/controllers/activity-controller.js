import ForbiddenError from "../../../core/errors/forbidden-error.js"

class ActivityController {
  constructor(activityRepository, playlistRepository, collaborationRepository, userRepository, songRepository) {
    this.activityRepository = activityRepository
    this.playlistRepository = playlistRepository
    this.collaborationRepository = collaborationRepository
    this.userRepository = userRepository
    this.songRepository = songRepository
  }

  async getPlaylistActivities(request) {
    const { id: userId } = request.auth.credentials
    const { id: playlistId } = request.params

    const isOwner = await this.playlistRepository.checkOwnership(playlistId, userId)
    const isCollaborator = await this.collaborationRepository.verifyCollaborator(playlistId, userId)

    if (!isOwner && !isCollaborator) {
      throw new ForbiddenError("You are not authorized to access this resource")
    }

    const activityRecords = await this.activityRepository.findByPlaylistId(playlistId)

    const activities = await Promise.all(
      activityRecords.map(async (activity) => {
        const user = await this.userRepository.findById(activity.user_id)
        const song = await this.songRepository.findById(activity.song_id)

        return {
          username: user.username,
          title: song.title,
          action: activity.action,
          time: activity.time,
        }
      }),
    )

    return {
      status: "success",
      data: {
        playlistId,
        activities,
      },
    }
  }
}

export default ActivityController

