import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './user.schema'

export interface IReview extends Document {
    user: Schema.Types.ObjectId
    course: Schema.Types.ObjectId
    rating: number
    review: string
    reviewReplies: Object[]
}

export const reviewSchema: Schema<IReview> = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
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
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                reply: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
)
