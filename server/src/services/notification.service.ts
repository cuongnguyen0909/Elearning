import path from 'path'
import { NotificationModel } from '../models/notification.model'
import { INotification } from '../models/schemas/notification.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import cron from 'node-cron'
import { StatusCodes } from 'http-status-codes'
import { redis } from '../configs/connect.redis.config'
import { notificationHelper } from '../helpers/notification.helper'

const getNotifications = async () => {
    try {
        const isCachedExist = await redis.get('allNotifications')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const allNotifications: INotification[] = await notificationHelper.getAllNotifications()
        await redis.set('allNotifications', JSON.stringify(allNotifications))
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
        const allNotifications = await redis.get('allNotifications')
        await redis.set('allNotifications', JSON.stringify(allNotifications))
        return { notification, allNotifications }
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
        const allNotifications = await notificationHelper.getAllNotifications()
        return allNotifications
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}
export const notificationServices = {
    getNotifications,
    updateNotificationStatus,
    deleleNotificationsAfter30Days
}
