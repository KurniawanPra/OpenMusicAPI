import pool from "../config/database.js"
import { nanoid } from "nanoid"

class ActivitiesService {
  constructor() {
    this._pool = pool
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `history-${nanoid(16)}`

    const query = {
      text: "INSERT INTO playlist_songs_activities VALUES ($1, $2, $3, $4, $5)",
      values: [id, playlistId, songId, userId, action],
    }

    await this._pool.query(query)
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT playlist_id AS "playlistId",
                    COALESCE(JSON_AGG(JSON_BUILD_OBJECT('username', users.username, 'title', songs.title, 'action',
                                                        action, 'time', time) ORDER BY time), '[]'::json) AS activities
             FROM playlist_songs_activities
                    LEFT JOIN users ON user_id = users.id
                    LEFT JOIN songs ON song_id = songs.id
             WHERE playlist_id = $1
             GROUP BY playlist_id`,
      values: [playlistId],
    }

    const { rows } = await this._pool.query(query)

    return rows[0]
  }
}

export default ActivitiesService

