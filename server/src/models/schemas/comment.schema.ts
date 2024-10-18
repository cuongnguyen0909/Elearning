import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
    user: Schema.Types.ObjectId
    comment: string
    commentReplies?: Object[]
    content: Schema.Types.ObjectId
    course: Schema.Types.ObjectId
    isShown?: boolean
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
        isShown: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)
