import mongoose, { Document, Schema } from 'mongoose'
import { IReview } from './review.model'
import { courseDataSchema, ICourseData } from './schemas/courseData.schema'
import { ILink } from './schemas/link.schema'
import { IComment } from './comment.model'

// interface IComment extends Document {
//     user: object
//     comment: string
//     commentReplies?: IComment[]
// }

// interface IReview extends Document {
//     user: object
//     rating: number
//     review: string
//     reviewReplies: IComment[]
// }

// interface ILink extends Document {
//     title: string
//     url: string
// }

// interface ICourseData extends Document {
//     title: string
//     description: string
//     videoUrl: string
//     videoThumbnail: string
//     videoSection: string
//     videoDuration: string
//     videoPlayer: string
//     links: ILink[]
//     suggestion: string
//     questions: IComment[]
// }

// const reviewSchema: Schema<IReview> = new mongoose.Schema({
//     userId: Object,
//     rating: {
//         type: Number,
//         required: true
//     },
//     review: String
// })

// const linkSchema: Schema<ILink> = new mongoose.Schema({
//     title: String,
//     url: String
// })

// const commentSchema: Schema<IComment> = new mongoose.Schema({
//     userId: Object,
//     comment: String,
//     commentReplies: [Object]
// })

// const courseDataSchema: Schema<ICourseData> = new mongoose.Schema({
//     title: String,
//     description: String,
//     videoUrl: String,
//     videoThumbnail: Object,
//     videoSection: String,
//     videoDuration: String,
//     videoPlayer: String,
//     links: [linkSchema],
//     suggestion: String,
//     questions: [commentSchema]
// })
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
    courseData: ICourseData[]
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
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        courseData: [courseDataSchema],
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
