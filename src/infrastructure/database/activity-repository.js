import { nanoid } from "nanoid"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"

class ActivityRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async add(activityData) {
    const { playlistId, songId, userId, action } = activityData
    const id = `activity-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new ValidationError("Failed to add activity")
    }

    return result.rows[0].id
  }

  async findByPlaylistId(playlistId) {
    const query = {
      text: "SELECT * FROM playlist_song_activities WHERE playlist_id = $1",
      values: [playlistId],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("No activities found for playlist")
    }

    return result.rows
  }
}

export default ActivityRepository

