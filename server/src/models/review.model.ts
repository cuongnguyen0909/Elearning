import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IReview extends Document {
    userId: mongoose.Schema.Types.ObjectId
    rating: number
    review: string
    reviewReplies?: mongoose.Schema.Types.ObjectId[]
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String
        },
        reviewReplies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    { timestamps: true }
)

export const ReviewModel: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema)
