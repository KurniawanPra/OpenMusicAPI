import InvariantError from "../../exceptions/InvariantError.js"
import PlaylistPayloadSchema from "./schema.js"

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

export default PlaylistsValidator

