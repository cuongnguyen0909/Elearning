import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import ErrorHandler from '../utils/handlers/ErrorHandler'

const validateMiddleware = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            return next()
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
}

export default validateMiddleware
