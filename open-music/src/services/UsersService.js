import pool from "../config/database.js"
import InvariantError from "../exceptions/InvariantError.js"
import { nanoid } from "nanoid"
import bcrypt from "bcrypt"
import NotFoundError from "../exceptions/NotFoundError.js"

class UsersService {
  constructor() {
    this._pool = pool
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    }

    const { rows } = await this._pool.query(query)

    if (rows.length > 0) {
      throw new InvariantError("Username already taken")
    }
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username)

    const id = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError("Failed to register new user")
    }
    return rows[0].id
  }

  async getUserById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError("User not found")
    }

    return rows[0]
  }
}

export default UsersService

