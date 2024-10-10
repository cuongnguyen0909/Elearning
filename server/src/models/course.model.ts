import mongoose, { Document, Schema } from 'mongoose'
import { IReview, reviewSchema } from './schemas/review.schema'
import { contentSchema, IContent } from './schemas/content.schema'
import { ILink } from './schemas/link.schema'
import { IComment } from './schemas/comment.schema'

export interface ICourse extends Document {
    name: string
    description: string
    price: number
    estimatedPrice: number
    thumbnail: object
    tags: string
    level: string
    demoUrl: string
    benefits: { title: string }[]
    prerequisites: { title: string }[]
    reviews: IReview[]
    contents: IContent[]
    rating?: number
    purchased?: number
}

const courseSchema: Schema<ICourse> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        estimatedPrice: {
            type: Number
        },
        thumbnail: {
            public_id: {
                type: String
                // required: true
            },
            url: {
                type: String
                // required: true
            }
        },
        tags: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        },
        demoUrl: {
            type: String,
            required: true
        },
        benefits: [{ title: String }],
        prerequisites: [{ title: String }],
        reviews: [reviewSchema],
        contents: [contentSchema],
        rating: {
            type: Number,
            default: 0
        },
        purchased: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

export const CourseModel: mongoose.Model<ICourse> = mongoose.model('Course', courseSchema)
