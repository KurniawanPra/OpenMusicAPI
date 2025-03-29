import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class AuthController {
  constructor(authRepository, tokenManager, userRepository) {
    this.authRepository = authRepository
    this.tokenManager = tokenManager
    this.userRepository = userRepository
  }

  async login(request, h) {
    SchemaValidator.validate(SchemaValidator.authLoginSchema, request.payload)

    const { username, password } = request.payload
    const userId = await this.userRepository.verifyCredential(username, password)

    const accessToken = this.tokenManager.generateAccessToken({ id: userId })
    const refreshToken = this.tokenManager.generateRefreshToken({ id: userId })

    await this.authRepository.saveToken(refreshToken)

    const response = h.response({
      status: "success",
      message: "Authentication successful",
      data: {
        accessToken,
        refreshToken,
      },
    })
    response.code(201)
    return response
  }

  async refreshToken(request) {
    SchemaValidator.validate(SchemaValidator.authRefreshSchema, request.payload)

    const { refreshToken } = request.payload
    await this.authRepository.verifyToken(refreshToken)

    const { id } = this.tokenManager.verifyRefreshToken(refreshToken)
    const accessToken = this.tokenManager.generateAccessToken({ id })

    return {
      status: "success",
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    }
  }

  async logout(request) {
    SchemaValidator.validate(SchemaValidator.authRefreshSchema, request.payload)

    const { refreshToken } = request.payload
    await this.authRepository.verifyToken(refreshToken)
    await this.authRepository.deleteToken(refreshToken)

    return {
      status: "success",
      message: "Logout successful",
    }
  }
}

export default AuthController

