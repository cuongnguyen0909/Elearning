import { NextFunction, Request, Response } from 'express'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'
import { analyticSevices } from '../services/analytic.service'
import { Model } from 'mongoose'
import { UserModel } from '../models/user.model'
import { EnrollmentModel } from '../models/enrollment.model'
import { NotificationModel } from '../models/notification.model'

const getUsersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const model: Model<any> = UserModel as Model<any>
        const users: any = await analyticSevices.getUsersAnalytics(model)
        res.status(StatusCodes.OK).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getEnrollmentsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const model: Model<any> = EnrollmentModel as Model<any>
        const enrollmerns: any = await analyticSevices.getEnrollmentsAnalytics(model)
        res.status(StatusCodes.OK).json({
            success: true,
            enrollmerns
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})
const getNotificationsAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const model: Model<any> = NotificationModel as Model<any>
        const notifications: any = await analyticSevices.getNotificationsAnalytics(model)
        res.status(StatusCodes.OK).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const analyticController = { getUsersAnalytics, getEnrollmentsAnalytics, getNotificationsAnalytics }
