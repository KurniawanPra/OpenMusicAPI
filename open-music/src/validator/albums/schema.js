import Joi from "joi"

export const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
})

export const AlbumCoverHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid("image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/webp")
    .required(),
}).unknown()

