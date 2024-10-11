import mongoose, { Model } from 'mongoose'
import { courseSchema, ICourse } from './schemas/course.schema'

export const CourseModel: Model<ICourse> = mongoose.model('Course', courseSchema)
