import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { NotificationModel } from '../models/notification.model'
import { INotification } from '../models/schemas/notification.schema'

const getAllNotifications = async () => {
    try {
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

export const notificationHelper = {
    getAllNotifications
}
