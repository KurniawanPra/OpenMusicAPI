/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: { type: "text", primaryKey: true },
    title: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
    genre: { type: "text", notNull: true },
    performer: { type: "text", notNull: true },
    duration: { type: "integer" },
    album_id: {
      type: "text",
      references: "albums(id)",
      onDelete: "CASCADE",
    }, // Foreign key reference to albums table
    created_at: { type: "bigint", notNull: true },
    updated_at: { type: "bigint", notNull: true },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("songs", "songs_album_id_fkey")

  pgm.dropTable("songs")
}

