import mongoose, { Document, Model, Schema } from 'mongoose'
import { IComment } from './comment.schema'

export interface IReview extends Document {
    user: object
    rating: number
    review: string
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
        }
    },
    { timestamps: true }
)
