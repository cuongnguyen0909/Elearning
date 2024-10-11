import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IUpdateAvatarRequest, IUpdatePasswordRequest, IUpdateProfileRequest } from '../interfaces/user.interface'
import { profileServices } from '../services/profile.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IUser } from '../models/schemas/user.schema'

const getProfileInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.user?._id as string
    try {
        const user: IUser = (await profileServices.getProfileById(userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const updateProfile = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const updateInfoRequest: IUpdateProfileRequest = req?.body as IUpdateProfileRequest
    const userId: any = req?.user?._id as any
    try {
        const user: IUser = (await profileServices.updateProfile(userId, updateInfoRequest)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User info is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const changePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const changePasswordRequest: IUpdatePasswordRequest = req?.body as IUpdatePasswordRequest
    const userId: any = req?.user?._id as any
    try {
        const user: IUser = (await profileServices.updatePassword(changePasswordRequest, userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Password is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const changeAvatar = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const updateAvatarRequest: IUpdateAvatarRequest = req?.body as IUpdateAvatarRequest
    const userId: any = req?.user?._id as any
    try {
        const user: IUser = (await profileServices.uploadImage(userId, updateAvatarRequest)) as unknown as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Avatar is updated successfully',
            userId: user._id
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const profileController = {
    getProfileInfo,
    updateProfile,
    changePassword,
    changeAvatar
}
