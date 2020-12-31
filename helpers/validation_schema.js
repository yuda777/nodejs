const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  // username: Joi.string().email().lowercase().required(),
  // password: Joi.string().min(2).required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
})

module.exports = {
  authSchema,
}