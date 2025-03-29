const Joi = require("joi")

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
})

module.exports = { PostPlaylistSongPayloadSchema }

