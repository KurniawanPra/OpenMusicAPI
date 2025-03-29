/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("collaborations", {
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
    user_id: {
      type: "VARCHAR(25)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
  })

  pgm.addConstraint("collaborations", "unique_playlist_id_and_user_id", "UNIQUE(playlist_id, user_id)")
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("collaborations")
}

