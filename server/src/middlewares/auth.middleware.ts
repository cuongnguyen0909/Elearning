import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../configs/connect.redis.config'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { UserRole } from '../constants/enums/user.enum'
import { IUser } from '../models/schemas/user.schema'
import { authController } from '../controllers/auth.controller'

export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies?.accessToken
    if (!accessToken) {
        return next(new ErrorHandler('Please login to access this resource', StatusCodes.UNAUTHORIZED))
    }

    const decoded: JwtPayload = jwt.decode(accessToken) as JwtPayload
    if (!decoded) {
        return next(new ErrorHandler('Access token is not valid', StatusCodes.UNAUTHORIZED))
    }

    //check if the access token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
        try {
            await authController.updateAccessToken(req, res, next)
        } catch (error: any) {
            return next(error)
        }
    } else {
        const userOfSession: any = await redis.get(decoded?.id as string)
        if (!userOfSession) {
            return next(new ErrorHandler('Please login to access this resource', StatusCodes.NOT_FOUND))
        }
        req.user = JSON.parse(userOfSession) as IUser
        next()
    }
})

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role as UserRole)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    StatusCodes.FORBIDDEN
                )
            )
        }
        next()
    }
}
