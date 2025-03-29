/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const { PgLiteral } = require("node-pg-migrate")
exports.up = (pgm) => {
  pgm.createTable("playlist_songs_activities", {
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
    },
    user_id: {
      type: "VARCHAR(25)",
      notNull: true,
    },
    action: {
      type: "TEXT",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      notNull: true,
      default: new PgLiteral("current_timestamp"),
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("playlist_songs_activities")
}

