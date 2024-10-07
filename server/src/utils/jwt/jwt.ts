import dotenv from 'dotenv'
import { ITokenOptions, IUser } from '../../interfaces/user.interface'
import { Response } from 'express'
import { redis } from '../database/connect-redis'
dotenv.config()

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    const accessToken: string = user.signAccessToken()
    const refreshToken: string = user.signRefreshToken()

    //upload session to redis
    redis.set(user?._id, JSON.stringify(user) as any)

    //parse enviroment variables to integrates with fallback values
    const accessTokenExpire: number = parseInt(process.env.ACCESS_TOKEN_EXPRIE || '300', 10)
    const refreshTokenExpire: number = parseInt(process.env.REFRESH_TOKEN_EXPRIE || '300', 10)

    //options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }

    //only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true
        refreshTokenOptions.secure = true
    }

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    })
}
