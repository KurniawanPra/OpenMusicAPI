class Album {
  constructor(id, name, year, createdAt, updatedAt) {
    this.id = id
    this.name = name
    this.year = year
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromDatabase(dbRecord) {
    return new Album(dbRecord.id, dbRecord.name, dbRecord.year, dbRecord.created_at, dbRecord.updated_at)
  }

  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
}

export default Album

