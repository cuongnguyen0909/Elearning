import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './user.schema'

export interface IComment extends Document {
    user: IUser
    comment: string
    commentReplies?: IComment[]
}

export const commentSchema: Schema<IComment> = new mongoose.Schema(
    {
        user: {
            type: Object,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        commentReplies: [Object]
    },
    { timestamps: true }
)
