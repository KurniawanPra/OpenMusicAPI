const Joi = require('@hapi/joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().allow(null),
  albumId: Joi.string().allow(null),
});

module.exports = { SongPayloadSchema };