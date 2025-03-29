/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
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
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("playlist_songs", "playlist_songs_playlist_id_fkey")
  pgm.dropConstraint("playlist_songs", "playlist_songs_song_id_fkey")

  pgm.dropTable("playlist_songs")
}

