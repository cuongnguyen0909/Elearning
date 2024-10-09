import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IComment extends Document {
    userId: mongoose.Schema.Types.ObjectId
    comment: string
    commentReplies?: mongoose.Schema.Types.ObjectId[]
}

const commentSchema: Schema<IComment> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        commentReplies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    { timestamps: true }
)

export const CommentModel: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema)
