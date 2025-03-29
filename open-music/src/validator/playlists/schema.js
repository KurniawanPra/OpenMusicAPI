import Joi from "joi"

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
})

export default PlaylistPayloadSchema

