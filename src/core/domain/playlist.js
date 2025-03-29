class Playlist {
  constructor(id, name, owner) {
    this.id = id
    this.name = name
    this.owner = owner
  }

  static fromDatabase(dbRecord) {
    return new Playlist(dbRecord.id, dbRecord.name, dbRecord.owner)
  }

  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
    }
  }

  toResponse(username) {
    return {
      id: this.id,
      name: this.name,
      username,
    }
  }
}

export default Playlist

