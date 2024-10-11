import mongoose, { Model } from 'mongoose'
import { INotification, notificationSchema } from './schemas/notification.schema'

export const NotificationModel: Model<INotification> = mongoose.model('Notification', notificationSchema)
