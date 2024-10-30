import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { accessTokenOptions, refreshTokenOptions } from '../constants/user.constant'
import {
    IActivationRequest,
    ILoginRequest,
    IRegistrationRequest,
    ISocialAuthRequest
} from '../interfaces/user.interface'
import { IUser } from '../models/schemas/user.schema'
import { authServices } from '../services/auth.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { authHelper } from '../helpers/auth.helper'
import { redis } from '../configs/connect.redis.config'

//register user
const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userData: IRegistrationRequest = req?.body
    try {
        const { activationToken, email } = await authServices.registerUser(userData)
        res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: `Please check your email: ${email} to activate your account`,
            activationToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

//activate user
const userActivation = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const activationRequest: IActivationRequest = req?.body
    try {
        const userActivated: IUser = (await authServices.activateUser(activationRequest)) as IUser
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User is created successfully',
            user: userActivated
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

//login user
const userLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const loginRequest: ILoginRequest = req?.body
    try {
        const user: IUser = (await authServices.loginUser(loginRequest)) as IUser
        const userId: any = user._id as any
        const { accessToken, refreshToken } = await authHelper.generateToken(userId)
        //set cookies in the browser
        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
        res.status(StatusCodes.OK).json({
            success: true,
            user,
            accessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

//logout user
const userLogout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId: any = req?.user?._id as any
    try {
        res.cookie('accessToken', '', { maxAge: 1 })
        res.cookie('refreshToken', '', { maxAge: 1 })
        //remove session from redis
        await authServices.logoutUser(userId)
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Logged out successfully',
            userId
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const updateAccessToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string = req.cookies?.refreshToken as string
        //create new access token
        const { user, newAccessToken, newRefreshToken } = await authServices.createNewAccessToken(refreshToken)
        //update user in request
        req.user = user
        //set cookies in the browser
        res.cookie('accessToken', newAccessToken, accessTokenOptions)
        res.cookie('refreshToken', newRefreshToken, refreshTokenOptions)

        // await redis.set(user._id, JSON.stringify(user), 'EX', 5) //set user in redis for 5 seconds
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Access token is updated successfully',
            newAccessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const socialAuthLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const socialAuthRequest: ISocialAuthRequest = req?.body as ISocialAuthRequest
    try {
        //login by social
        const user = await authServices.loginBySoial(socialAuthRequest)
        const userId: any = user?._id as any
        //generate token
        const { accessToken, refreshToken } = await authHelper.generateToken(userId)
        //set cookies in the browser
        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
        res.status(StatusCodes.OK).json({
            success: true,
            user,
            accessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const authController = {
    userRegistration,
    userActivation,
    userLogin,
    userLogout,
    updateAccessToken,
    socialAuthLogin
}
