import ExportsPlaylistPayloadSchema from "./schema.js"
import InvariantError from "../../exceptions/InvariantError.js"

const ExportsValidator = {
  validateExportsPlaylistPayload: (payload) => {
    const validationResult = ExportsPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

export default ExportsValidator

