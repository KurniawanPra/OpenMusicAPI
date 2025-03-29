class User {
  constructor(id, username, password, fullname) {
    this.id = id
    this.username = username
    this.password = password
    this.fullname = fullname
  }

  static fromDatabase(dbRecord) {
    return new User(dbRecord.id, dbRecord.username, dbRecord.password, dbRecord.fullname)
  }

  toDatabase() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      fullname: this.fullname,
    }
  }

  toResponse() {
    return {
      id: this.id,
      username: this.username,
      fullname: this.fullname,
    }
  }
}

export default User

