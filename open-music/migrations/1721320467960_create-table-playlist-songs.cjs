/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(25)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(25)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(25)",
      notNull: true,
      references: "songs",
      onDelete: "CASCADE",
    },
  })

  pgm.addConstraint("playlist_songs", "unique_playlist_id_and_song_id", "UNIQUE(playlist_id, song_id)")
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("playlist_songs")
}

