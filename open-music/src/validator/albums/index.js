import { AlbumPayloadSchema, AlbumCoverHeadersSchema } from "./schema.js"
import InvariantError from "../../exceptions/InvariantError.js"

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },

  validateAlbumCoverHeaders: (headers) => {
    const validationResult = AlbumCoverHeadersSchema.validate(headers)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

export default AlbumsValidator

