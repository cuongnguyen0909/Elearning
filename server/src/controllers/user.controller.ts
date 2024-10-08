import { NextFunction, Request, Response } from 'express'
import { accessTokenOptions, refreshTokenOptions } from '../constants/user.constant'
import { generateToken } from '../helpers/user.help'
import { IActivationRequest, ILoginRequest, IRegistration, ISocialAuthRequestBody, IUser } from '../interfaces/user.interface'
import { userServices } from '../services/user.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'

//register user
export const userRegistration = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userData: IRegistration = req?.body
    try {
        const { activationToken, email } = await userServices.registerUser(userData)
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
        const userActivated: IUser = (await userServices.activateUser(activationRequest)) as IUser
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
        const user: IUser = (await userServices.loginUser(loginRequest)) as IUser
        await generateToken(user, res)
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
        await userServices.logoutUser(userId)
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
        const { newAccessToken, newRefreshToken } = await userServices.createNewAccessToken(refreshToken)
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

export const getUserInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user?._id as string
        const user = await userServices.getUserById(userId)

        res.status(StatusCodes.OK).json({
            success: true,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})



export const socialAuthLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const socialAuthRequest: ISocialAuthRequestBody = req?.body as ISocialAuthRequestBody
    try {
        //login by social
        const user = await userServices.loginBySoial(socialAuthRequest)
        //generate token
        user && await generateToken(user, res)
        res.status(200).json({
            success: true,
            message: 'User is logged in successfully',
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})