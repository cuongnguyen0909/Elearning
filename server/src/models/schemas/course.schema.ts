import mongoose, { Document, Schema } from 'mongoose'
import { contentSchema, IContent } from './content.schema'
import { IReview, reviewSchema } from './review.schema'
import { ICategory } from './category.schema'

export interface ICourse extends Document {
    title: string
    description: string
    category: ICategory
    price: number
    estimatedPrice: number
    thumbnail: object
    tags: string
    level: string
    demoUrl: string
    benefits: { title: string }[]
    prerequisites: { title: string }[]
    reviews: Schema.Types.ObjectId[]
    contents: IContent[]
    rating?: number
    purchased?: number
    isDeleted: boolean
}

export const courseSchema: Schema<ICourse> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
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
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        contents: [contentSchema],
        rating: {
            type: Number,
            default: 0
        },
        purchased: {
            type: Number,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)
