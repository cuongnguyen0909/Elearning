import { Document, Schema } from 'mongoose'

export interface IFaq extends Document {
    question: string
    answer: string
}

export const faqSchema: Schema<IFaq> = new Schema<IFaq>(
    {
        question: {
            type: String
        },
        answer: {
            type: String
        }
    },
    { timestamps: true }
)
