import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IComment extends Document {
    user: object
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
