import mongoose, { Document, Schema } from 'mongoose'
import { isBlock } from 'typescript'

export interface IComment extends Document {
    user: Schema.Types.ObjectId
    comment: string
    commentReplies?: Object[]
    content: Schema.Types.ObjectId
    course: Schema.Types.ObjectId
    isDeleted?: boolean
    isBlocked?: boolean
}

export const commentSchema: Schema<IComment> = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        commentReplies: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                reply: {
                    type: String
                },
                // generate createdAt and updatedAt with timestamps
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                updatedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        content: {
            type: Schema.Types.ObjectId
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)
