import bcrypt from "bcrypt"
import pool from "../config/database.js"
import InvariantError from "../exceptions/InvariantError.js"
import AuthenticationError from "../exceptions/AuthenticationError.js"

class AuthenticationsService {
  constructor() {
    this._pool = pool
  }

  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    }

    await this._pool.query(query)
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    }

    const { rows } = await this._pool.query(query)

    if (!rows.length) {
      throw new InvariantError("Invalid refresh token")
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    }

    await this._pool.query(query)
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    }

    const { rows } = await this._pool.query(query)

    if (!rows.length) {
      throw new AuthenticationError("Invalid credentials")
    }

    const { id, password: hashedPassword } = rows[0]

    const isMatch = await bcrypt.compare(password, hashedPassword)

    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials")
    }

    return id
  }
}

export default AuthenticationsService

