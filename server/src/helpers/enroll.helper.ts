import { StatusCodes } from 'http-status-codes'
import { EnrollmentModel } from '../models/enrollment.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IEnroll } from '../models/schemas/enrollment.schema'

const getAllEntrollments = async () => {
    try {
        const enrollments: IEnroll[] = (await EnrollmentModel.find().sort({ createdAt: -1 }).populate({
            path: 'user course'
        })) as IEnroll[]
        return enrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const enrollHelper = {
    getAllEntrollments
}
