import ValidationError from "../../core/errors/validation-error.js"

class AuthRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async saveToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    }

    await this.dbPool.query(query)
  }

  async verifyToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    }

    const result = await this.dbPool.query(query)

    if (!result.rows.length) {
      throw new ValidationError("Invalid refresh token")
    }
  }

  async deleteToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    }

    await this.dbPool.query(query)
  }
}

export default AuthRepository

