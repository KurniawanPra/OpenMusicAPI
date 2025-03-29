import Joi from "joi"
import ValidationError from "../../core/errors/validation-error.js"

class SchemaValidator {
  static validate(schema, payload) {
    const validationResult = schema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }

  static albumSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
  })

  static songSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
  })

  static userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
  })

  static authLoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })

  static authRefreshSchema = Joi.object({
    refreshToken: Joi.string().required(),
  })

  static playlistSchema = Joi.object({
    name: Joi.string().required(),
  })

  static playlistSongSchema = Joi.object({
    songId: Joi.string().required(),
  })

  static collaborationSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
  })
}

export default SchemaValidator

