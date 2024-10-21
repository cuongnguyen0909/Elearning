import path from 'path'
import { NotificationModel } from '../models/notification.model'
import { INotification } from '../models/schemas/notification.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import cron from 'node-cron'
import { StatusCodes } from 'http-status-codes'

const getNotifications = async () => {
    try {
        //get all notifications
        const notifications: INotification[] = await NotificationModel.find()
            .sort({ createdAt: -1 })
            ?.populate({
                path: 'user',
                select: 'name email'
            })
            ?.populate({
                path: 'comment',
                populate: [
                    {
                        path: 'user',
                        select: 'avatar name email'
                    },
                    {
                        path: 'commentReplies.user',
                        select: 'avatar name email'
                    }
                ]
            })
            ?.populate({
                path: 'review'
            })
        return notifications
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

//update notification status --only for admin
const updateNotificationStatus = async (notificationId: string) => {
    try {
        const notification: INotification = (await NotificationModel.findById(notificationId)) as INotification
        if (!notification) {
            throw new ErrorHandler('Notification not found', StatusCodes.NOT_FOUND)
        }
        if (notification.status) {
            notification.status = 'read'
        }
        ;(await notification?.save()).populate({
            path: 'user'
        })

        const notifications: INotification[] = await NotificationModel.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'name email'
        })
        return { notification, notifications }
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleleNotificationsAfter30Days = async () => {
    try {
        cron.schedule('0 0 0 * * *', async () => {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            await NotificationModel.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } })
            console.log('Deleted read notifications after 30 days')
        })
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}
export const notificationServices = {
    getNotifications,
    updateNotificationStatus,
    deleleNotificationsAfter30Days
}
