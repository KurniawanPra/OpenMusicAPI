/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlist_song_activities", {
    id: { type: "text", primaryKey: true },
    playlist_id: {
      type: "text",
      references: "playlists(id)",
      notNull: true,
      onDelete: "CASCADE",
    }, // Foreign key reference to playlists table
    song_id: {
      type: "text",
      references: "songs(id)",
      notNull: true,
      onDelete: "CASCADE",
    }, // Foreign key reference to songs table
    user_id: {
      type: "text",
      references: "users(id)",
      notNull: true,
      onDelete: "CASCADE",
    }, // Foreign key reference to users table
    action: { type: "text", notNull: true },
    time: { type: "text", notNull: true },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("playlist_song_activities", "playlist_song_activities_playlist_id_fkey")
  pgm.dropConstraint("playlist_song_activities", "playlist_song_activities_song_id_fkey")
  pgm.dropConstraint("playlist_song_activities", "playlist_song_activities_user_id_fkey")

  pgm.dropTable("playlist_song_activities")
}

