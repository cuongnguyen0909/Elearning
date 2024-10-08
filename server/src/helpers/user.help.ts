import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { IActivationToken, IRegistration, IUser } from '../interfaces/user.interface'
import { redis } from '../config/connect.redis.config'
import { accessTokenOptions, refreshTokenOptions } from '../constants/user.constant'
import { Response } from 'express'
//using dotenv to access environment variables
dotenv.config()

export const generateActivationToken = (user: IRegistration): IActivationToken => {
    //generate activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    //create activation token
    const token: string = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SERCRET_KEY as string,
        { expiresIn: '5m' }
    )

    return { token, activationCode }
}

export const generateToken = async (user: IUser, res: Response) => {
    const accessToken: string = user.signAccessToken()
    const refreshToken: string = user.signRefreshToken()

    //upload session to redis
    await redis.set(user?._id, JSON.stringify(user) as any)

    //only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true
        refreshTokenOptions.secure = true
    }

    //set cookies in the browser
    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)
    //send response
    res.status(200).json({
        success: true,
        user,
        accessToken
    })
}
