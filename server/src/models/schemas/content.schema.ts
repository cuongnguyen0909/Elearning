import mongoose, { Document, Schema } from 'mongoose'
import { commentSchema, IComment } from './comment.schema'
import { ILink, linkSchema } from './link.schema'

export interface IContent extends Document {
    title: string
    description: string
    videoUrl: string
    // videoThumbnail: string
    videoSection: string
    videoDuration: string
    videoPlayer: string
    links: ILink[]
    suggestion: string
    comments?: Schema.Types.ObjectId[]
}

export const contentSchema: Schema<IContent> = new mongoose.Schema(
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
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    { timestamps: true }
)
