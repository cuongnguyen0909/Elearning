import { NextFunction, Request, Response } from 'express'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IUser } from '../models/schemas/user.schema'
import { userServices } from '../services/user.service'
import { StatusCodes } from 'http-status-codes'

const getAllUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: IUser[] = (await userServices.getAllUser()) as IUser[]
        res.status(StatusCodes.OK).json({
            success: true,
            users,
            count: users.length
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

const updateUserRole = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = req.body as any
        const updatedUser: IUser = (await userServices.updateUserRole(userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            user: updatedUser
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

const lockUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body as any
        const updatedUser: IUser = (await userServices.lockUser(userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            user: updatedUser
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

const unLockUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body as any
        const updatedUser: IUser = (await userServices.unLockUser(userId)) as IUser
        res.status(StatusCodes.OK).json({
            success: true,
            user: updatedUser
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const userController = {
    getAllUser,
    updateUserRole,
    lockUser,
    unLockUser
}
