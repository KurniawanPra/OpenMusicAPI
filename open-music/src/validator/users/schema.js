import Joi from "joi"

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(1).max(255).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
})

export default UserPayloadSchema

