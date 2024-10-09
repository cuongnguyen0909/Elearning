import mongoose, { Document, Schema } from 'mongoose'
import { IComment } from '../comment.model'
import { ILink, linkSchema } from './link.schema'

export interface ICourseData extends Document {
    title: string
    description: string
    videoUrl: string
    // videoThumbnail: string
    videoSection: string
    videoDuration: string
    videoPlayer: string
    links: ILink[]
    suggestion: string
    questions?: IComment[]
}

export const courseDataSchema: Schema<ICourseData> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        // videoThumbnail: {
        //     type: String
        // },
        videoSection: {
            type: String
        },
        videoDuration: {
            type: String
        },
        videoPlayer: {
            type: String
        },
        links: [linkSchema],
        suggestion: {
            type: String
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    { timestamps: true }
)
