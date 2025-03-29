class Song {
  constructor(id, title, year, genre, performer, duration, albumId, createdAt, updatedAt) {
    this.id = id
    this.title = title
    this.year = year
    this.genre = genre
    this.performer = performer
    this.duration = duration
    this.albumId = albumId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromDatabase(dbRecord) {
    return new Song(
      dbRecord.id,
      dbRecord.title,
      dbRecord.year,
      dbRecord.genre,
      dbRecord.performer,
      dbRecord.duration,
      dbRecord.album_id,
      dbRecord.created_at,
      dbRecord.updated_at,
    )
  }

  toDatabase() {
    return {
      id: this.id,
      title: this.title,
      year: this.year,
      genre: this.genre,
      performer: this.performer,
      duration: this.duration,
      album_id: this.albumId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }

  toResponse() {
    return {
      id: this.id,
      title: this.title,
      performer: this.performer,
    }
  }
}

export default Song

