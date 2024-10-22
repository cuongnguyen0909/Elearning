import { Document, Schema } from 'mongoose'

export interface IBanner extends Document {
    public_id: string
    url: string
}

export const bannerSchema: Schema<IBanner> = new Schema<IBanner>(
    {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    { timestamps: true }
)
