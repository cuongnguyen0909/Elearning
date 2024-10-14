import mongoose, { Model } from 'mongoose'
import { IEnroll, enrollmentSchema } from './schemas/enrollment.schema'

export const EnrollmentModel: Model<IEnroll> = mongoose.model('Enrollment', enrollmentSchema)
