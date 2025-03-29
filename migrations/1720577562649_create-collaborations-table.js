/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: { type: "text", primaryKey: true },
    playlist_id: {
      type: "text",
      references: "playlists(id)",
      notNull: true,
      onDelete: "CASCADE",
    }, // Foreign key reference to playlists table
    user_id: {
      type: "text",
      references: "users(id)",
      notNull: true,
      onDelete: "CASCADE",
    }, // Foreign key reference to users table
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "collaborations_playlist_id_fkey")
  pgm.dropConstraint("collaborations", "collaborations_user_id_fkey")

  pgm.dropTable("collaborations")
}

