import mongoose, { Model } from 'mongoose'
import { categorySchema, ICategory } from './schemas/category.schema'

export const CategoryModel: Model<ICategory> = mongoose.model('Category', categorySchema)
