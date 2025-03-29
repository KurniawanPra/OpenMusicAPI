import autoBind from "auto-bind"

class AuthenticationsHandler {
  constructor(service, tokenManager, validator) {
    this._service = service
    this._tokenManager = tokenManager
    this._validator = validator
    autoBind(this)
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload)
    const { username, password } = request.payload
    const id = await this._service.verifyUserCredential(username, password)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._service.addRefreshToken(refreshToken)

    const response = h.response({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    })

    response.code(201)
    return response
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload

    await this._service.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })

    return h.response({
      status: "success",
      data: { accessToken },
    })
  }

  async deleteAuthenticationHandler(request, h) {
    await this._validator.validateDeleteAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload

    await this._service.verifyRefreshToken(refreshToken)
    await this._service.deleteRefreshToken(refreshToken)

    return h.response({
      status: "success",
      message: "Authentication deleted successfully",
    })
  }
}

export default AuthenticationsHandler

