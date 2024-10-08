import Joi from 'joi'
import { emailRegexPattern } from '../constants/user.constant'

export const registerSchemaValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().trim().strict(),
    email: Joi.string().email().required().trim().strict().regex(emailRegexPattern),
    password: Joi.string().min(6).required().trim().strict()
})

export const loginSchemaValidation = Joi.object({
    email: Joi.string().email().required().trim().strict().regex(emailRegexPattern),
    password: Joi.string().min(6).required().trim().strict()
})

export const activationSchemaValidation = Joi.object({
    activationCode: Joi.string().max(4).min(4).trim().strict().required(),
    activationToken: Joi.string().required().trim().strict()
})
