import { ref } from 'joi'
import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
    title: string
    message: string
    status: string
    user: mongoose.Types.ObjectId
    comment?: mongoose.Types.ObjectId
    review?: mongoose.Types.ObjectId
    content?: mongoose.Types.ObjectId
    course?: mongoose.Types.ObjectId
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
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
        review: {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
        content: {
            type: Schema.Types.ObjectId
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }
    },
    {
        timestamps: true
    }
)
