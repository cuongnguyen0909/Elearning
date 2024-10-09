import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import { IUser } from '../models/user.model'
import { userServices } from '../services/user.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

export const getUserInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user?._id as string
        const user: IUser = (await userServices.getUserById(userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const updateProfile = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateInfoRequest: IUpdateProfileRequest = req?.body as IUpdateProfileRequest
        const userId: any = req?.user?._id as any
        const user: IUser = (await userServices.updateUserInfo(userId, updateInfoRequest)) as IUser

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User info is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const changePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const changePasswordRequest: IUpdatePasswordRequest = req?.body as IUpdatePasswordRequest

        const userId: any = req?.user?._id as any
        const user: IUser = (await userServices.updatePassword(changePasswordRequest, userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Password is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const changeAvatar = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateAvatarRequest: IUpdateAvatarRequest = req?.body as IUpdateAvatarRequest
        const userId: any = req?.user?._id as any
        const user: IUser = (await userServices.uploadImage(userId, updateAvatarRequest)) as unknown as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Avatar is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})
