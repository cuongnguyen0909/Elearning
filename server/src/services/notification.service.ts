import path from 'path'
import { NotificationModel } from '../models/notification.model'
import { INotification } from '../models/schemas/notification.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import cron from 'node-cron'

const getNotifications = async () => {
    try {
        //get all notifications
        const notifications: INotification[] = await NotificationModel.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'name email'
        })
        return notifications
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

//update notification status --only for admin
const updateNotificationStatus = async (notificationId: string) => {
    try {
        const notification: INotification = (await NotificationModel.findById(notificationId)) as INotification
        if (!notification) {
            throw new ErrorHandler('Notification not found', 404)
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
        throw new ErrorHandler(error.message, 400)
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
        throw new ErrorHandler(error.message, 400)
    }
}
export const notificationServices = {
    getNotifications,
    updateNotificationStatus,
    deleleNotificationsAfter30Days
}
