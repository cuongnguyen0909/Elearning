import { Document, Schema } from 'mongoose'
import { faqSchema, IFaq } from './faq.schema'
import { categorySchema, ICategory } from './category.schema'
import { bannerSchema, IBanner } from './banner.schema'

export interface ILayout extends Document {
    type: string
    faq: IFaq[]
    categories: ICategory[]
    banner: {
        image: IBanner
        title: string
        subTitle: string
    }
}

export const layoutSchema: Schema<ILayout> = new Schema<ILayout>(
    {
        type: {
            type: String
        },
        faq: [faqSchema],
        categories: [categorySchema],
        banner: {
            image: bannerSchema,
            title: {
                type: String
            },
            subTitle: {
                type: String
            }
        }
    },
    { timestamps: true }
)
