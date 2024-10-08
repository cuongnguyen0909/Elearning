import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { accessTokenOptions, refreshTokenOptions } from '../constants/user.constant'
import { generateToken } from '../helpers/user.help'
import {
    IActivationRequest,
    ILoginRequest,
    IRegistrationRequest,
    ISocialAuthRequest,
    IUser
} from '../interfaces/user.interface'
import { authServices } from '../services/auth.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

//register user
export const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userData: IRegistrationRequest = req?.body
    try {
        const { activationToken, email } = await authServices.registerUser(userData)
        res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: `Please check your email: ${email} to activate your account`,
            activationToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//activate user
export const userActivation = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const activationRequest: IActivationRequest = req?.body
    try {
        const userActivated: IUser = (await authServices.activateUser(activationRequest)) as IUser
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User is created successfully',
            user: userActivated
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//login user
export const userLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const loginRequest: ILoginRequest = req?.body
    try {
        const user: IUser = (await authServices.loginUser(loginRequest)) as IUser
        const { accessToken, refreshToken } = await generateToken(user)
        //set cookies in the browser
        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
        res.status(StatusCodes.OK).json({
            success: true,
            user,
            accessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//logout user
export const userLogout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId: any = req?.user?._id as any
    try {
        res.cookie('accessToken', '', { maxAge: 1 })
        res.cookie('refreshToken', '', { maxAge: 1 })
        //remove session from redis
        await authServices.logoutUser(userId)
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const updateAccessToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string = req.cookies?.refreshToken as string
        //create new access token
        const { user, newAccessToken, newRefreshToken } = await authServices.createNewAccessToken(refreshToken)
        //update user in request
        req.user = user
        //set cookies in the browser
        res.cookie('accessToken', newAccessToken, accessTokenOptions)
        res.cookie('refreshToken', newRefreshToken, refreshTokenOptions)
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Access token is updated successfully',
            accessToken: newAccessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const socialAuthLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const socialAuthRequest: ISocialAuthRequest = req?.body as ISocialAuthRequest
    try {
        //login by social
        const user = await authServices.loginBySoial(socialAuthRequest)
        //generate token
        const { accessToken, refreshToken } = await generateToken(user)
        //set cookies in the browser
        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
        res.status(StatusCodes.OK).json({
            success: true,
            user,
            accessToken
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})
