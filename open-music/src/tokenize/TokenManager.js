import Jwt from "@hapi/jwt"
import config from "../utils/config.js"
import InvariantError from "../exceptions/InvariantError.js"

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.auth.accessKey),

  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.auth.refreshKey),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, config.auth.refreshKey)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError("Invalid refresh token")
    }
  },
}

export default TokenManager

