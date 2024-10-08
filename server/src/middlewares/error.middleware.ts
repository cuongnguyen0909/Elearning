import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    err.message = err.message || 'Internal Server Error'

    //wrong mongodb id error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, StatusCodes.BAD_REQUEST)
    }

    //duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, StatusCodes.BAD_REQUEST)
    }

    //wrong jwt error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json web token is invalid. Try again!!!`
        err = new ErrorHandler(message, StatusCodes.BAD_REQUEST)
    }

    //JWT expried error
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired. Try again!!!`
        err = new ErrorHandler(message, StatusCodes.BAD_REQUEST)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

export default errorMiddleware
