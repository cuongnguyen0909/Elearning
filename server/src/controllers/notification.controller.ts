import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { notificationServices } from '../services/notification.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

const getNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificationServices.getNotifications()
        res.status(StatusCodes.OK).json({
            success: true,
            notifications,
            count: notifications.length
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const updateNotificationStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId = req.params.id as string
        const notification = await notificationServices.updateNotificationStatus(notificationId)
        res.status(StatusCodes.OK).json({
            success: true,
            notification
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

//by using the cron to delete mutilple notifications after 30 days automatically
;async () => {
    await notificationServices.deleleNotificationsAfter30Days()
}

export const notificationController = {
    getNotifications,
    updateNotificationStatus
}
