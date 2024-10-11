import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './user.schema'

export interface IReview extends Document {
    user: IUser
    rating: number
    review: string
    reviewReplies: IReview[]
}

export const reviewSchema: Schema<IReview> = new mongoose.Schema(
    {
        user: {
            type: Object,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String
        },
        reviewReplies: [Object]
    },
    { timestamps: true }
)
