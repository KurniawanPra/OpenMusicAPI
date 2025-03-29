/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: { type: "text", primaryKey: true },
    name: { type: "text", notNull: true },
    owner: {
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
  pgm.dropConstraint("playlists", "playlists_owner_fkey")

  pgm.dropTable("playlists")
}

