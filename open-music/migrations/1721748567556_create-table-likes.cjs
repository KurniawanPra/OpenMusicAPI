/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(25)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(25)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    album_id: {
      type: "VARCHAR(25)",
      notNull: true,
      references: "albums",
      onDelete: "CASCADE",
    },
  })

  pgm.addConstraint("user_album_likes", "unique_user_id_and_album_id", "UNIQUE(user_id, album_id)")
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("user_album_likes")
}

