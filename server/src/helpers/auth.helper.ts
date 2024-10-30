import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { redis } from '../configs/connect.redis.config'
import { accessTokenOptions, refreshTokenOptions } from '../constants/user.constant'
import { IActivationToken, IRegistrationRequest } from '../interfaces/user.interface'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
//using dotenv to access environment variables
dotenv.config()

const generateActivationToken = (user: IRegistrationRequest): IActivationToken => {
    //generate activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    //create activation token
    const token: string = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SERCRET_KEY as string, {
        expiresIn: '5m'
    })

    return { token, activationCode }
}

const generateToken = async (userId: string) => {
    const user: IUser = (await UserModel.findById(userId)) as IUser
    const accessToken: string = user.signAccessToken()
    const refreshToken: string = user.signRefreshToken()

    //upload session to redis
    await redis.set(user?._id, JSON.stringify(user), 'EX', 60 * 60 * 24 * 7) // 7 days

    //only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true
        refreshTokenOptions.secure = true
    }

    return { accessToken, refreshToken }
}

export const authHelper = {
    generateActivationToken,
    generateToken
}
