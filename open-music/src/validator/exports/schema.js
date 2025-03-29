import Joi from "joi"

const ExportsPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
})

export default ExportsPlaylistPayloadSchema

