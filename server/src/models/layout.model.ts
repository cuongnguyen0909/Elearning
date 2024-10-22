import mongoose, { Model } from 'mongoose'
import { ILayout, layoutSchema } from './schemas/layout.schema'

export const LayoutModel: Model<ILayout> = mongoose.model('Layout', layoutSchema)
