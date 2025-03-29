import { nanoid } from "nanoid"
import bcrypt from "bcrypt"
import User from "../../core/domain/user.js"
import NotFoundError from "../../core/errors/not-found-error.js"
import ValidationError from "../../core/errors/validation-error.js"
import UnauthorizedError from "../../core/errors/unauthorized-error.js"

class UserRepository {
  constructor(dbPool) {
    this.dbPool = dbPool
  }

  async isUsernameAvailable(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    }

    const result = await this.dbPool.query(query)

    return result.rowCount === 0
  }

  async create(userData) {
    const { username, password, fullname } = userData

    const isAvailable = await this.isUsernameAvailable(username)
    if (!isAvailable) {
      throw new ValidationError("Username already exists")
    }

    const userId = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [userId, username, hashedPassword, fullname],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new ValidationError("Failed to create user")
    }

    return result.rows[0].id
  }

  async findById(id) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [id],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError("User not found")
    }

    return User.fromDatabase({
      ...result.rows[0],
      password: null,
    })
  }

  async findByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    }

    const result = await this.dbPool.query(query)

    return result.rows.map((row) =>
      User.fromDatabase({
        ...row,
        password: null,
      }),
    )
  }

  async verifyCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    }

    const result = await this.dbPool.query(query)

    if (!result.rowCount) {
      throw new UnauthorizedError("Invalid credentials")
    }

    const { id, password: hashedPassword } = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials")
    }

    return id
  }
}

export default UserRepository

