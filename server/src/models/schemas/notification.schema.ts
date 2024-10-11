import mongoose, { Schema } from 'mongoose'

export interface INotification {
    title: string
    message: string
    status: string
    userId: mongoose.Types.ObjectId
}

export const notificationSchema = new mongoose.Schema<INotification>(
    {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'unread'
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)
