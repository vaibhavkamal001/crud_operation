const Joi = require('joi')

module.exports.userSchema = Joi.object({
    data:Joi.object({
        username:Joi.string().required(),
        password: Joi.string().required(),
    }).required(),
})