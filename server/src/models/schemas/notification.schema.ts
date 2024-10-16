import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
    title: string
    message: string
    status: string
    user: mongoose.Types.ObjectId
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
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)
