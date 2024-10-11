import mongoose from 'mongoose'
import { courseSchema, ICourse } from './schemas/course.schema'

export const CourseModel: mongoose.Model<ICourse> = mongoose.model('Course', courseSchema)
