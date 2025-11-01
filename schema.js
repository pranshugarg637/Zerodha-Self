const Joi=require('joi');

module.exports.userSchema=Joi.object({
    user:Joi.object({
        email:Joi.string().required(),
        password:Joi.string().required(),
        username:Joi.string().required(),
    }).required()
})