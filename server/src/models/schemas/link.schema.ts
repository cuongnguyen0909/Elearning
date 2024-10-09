import mongoose, { Document, Schema } from 'mongoose'

export interface ILink extends Document {
    title: string
    url: string
}

export const linkSchema: Schema<ILink> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)
