import Joi from "joi"

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
})

export default PlaylistSongPayloadSchema

