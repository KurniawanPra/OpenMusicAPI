import { SongPayloadSchema, SongQuerySchema } from "./schema.js"
import InvariantError from "../../exceptions/InvariantError.js"

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },

  validateSongQuery: (payload) => {
    const validationResult = SongQuerySchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

export default SongValidator

