import jwt from "@hapi/jwt"
import ValidationError from "../../core/errors/validation-error.js"

class TokenManager {
  constructor(accessTokenKey, refreshTokenKey, accessTokenAge) {
    this.accessTokenKey = accessTokenKey
    this.refreshTokenKey = refreshTokenKey
    this.accessTokenAge = accessTokenAge
  }

  generateAccessToken(payload) {
    return jwt.token.generate(payload, this.accessTokenKey)
  }

  generateRefreshToken(payload) {
    return jwt.token.generate(payload, this.refreshTokenKey)
  }

  verifyRefreshToken(token) {
    try {
      const artifacts = jwt.token.decode(token)
      jwt.token.verifySignature(artifacts, this.refreshTokenKey)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new ValidationError("Invalid refresh token")
    }
  }
}

export default TokenManager

