import Joi from 'joi'
import { emailRegexPattern } from '../constants/user.constant'

export const registerSchemaValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().trim(),
    email: Joi.string().required().trim().regex(emailRegexPattern),
    password: Joi.string().min(6).required().trim()
})

export const loginSchemaValidation = Joi.object({
    email: Joi.string().required().trim().regex(emailRegexPattern),
    password: Joi.string().min(6).required().trim()
})

export const activationSchemaValidation = Joi.object({
    activationCode: Joi.string().max(4).min(4).trim().required(),
    activationToken: Joi.string().required().trim()
})

export const changePasswordSchemaValidation = Joi.object({
    currentPassword: Joi.string().min(6).required().trim(),
    newPassword: Joi.string().min(6).required().trim()
})
