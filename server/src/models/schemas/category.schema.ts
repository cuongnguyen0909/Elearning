import { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
    title: string
}

export const categorySchema: Schema<ICategory> = new Schema<ICategory>(
    {
        title: {
            type: String
        }
    },
    { timestamps: true }
)
