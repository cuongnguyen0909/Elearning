import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { IUser } from '../interfaces/user.interface'
import { redis } from '../utils/database/connect-redis'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies?.accessToken
    if (!accessToken) {
        return next(new ErrorHandler('Please login to access this resource', 401))
    }

    const decoded: JwtPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
    if (!decoded) {
        return next(new ErrorHandler('Access token is not valid', 401))
    }
    const userOfSession: any = await redis.get(decoded?.id as string)

    if (!userOfSession) {
        return next(new ErrorHandler('User not found', 404))
    }

    req.user = JSON.parse(userOfSession) as IUser
    next()
})