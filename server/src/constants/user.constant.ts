import { ITokenOptions } from '../interfaces/user.interface'
import dotenv from 'dotenv'
dotenv.config()

//parse enviroment variables to integrates with fallback values
export const accessTokenExpire: number = parseInt(process.env.ACCESS_TOKEN_EXPRIE as string, 10)
export const refreshTokenExpire: number = parseInt(process.env.REFRESH_TOKEN_EXPRIE as string, 10)

//options for cookies
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // 5 minutes
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
}

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // 3 days
    maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
}
