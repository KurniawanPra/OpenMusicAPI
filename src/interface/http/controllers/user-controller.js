import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async createUser(request, h) {
    SchemaValidator.validate(SchemaValidator.userSchema, request.payload)

    const { username, password, fullname } = request.payload
    const userId = await this.userRepository.create({ username, password, fullname })

    const response = h.response({
      status: "success",
      message: "User created successfully",
      data: {
        userId,
      },
    })
    response.code(201)
    return response
  }

  async getUserById(request) {
    const { id } = request.params
    const user = await this.userRepository.findById(id)

    return {
      status: "success",
      data: {
        user: user.toResponse(),
      },
    }
  }

  async getUsersByUsername(request) {
    const { username = "" } = request.query
    const users = await this.userRepository.findByUsername(username)

    return {
      status: "success",
      data: {
        users: users.map((user) => user.toResponse()),
      },
    }
  }
}

export default UserController

