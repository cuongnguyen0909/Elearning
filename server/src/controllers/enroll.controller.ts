import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IEnrollRequest } from '../interfaces/enroll.interface'
import { enrollServices } from '../services/enroll.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

const createNewEnrollment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const enrollRequest: IEnrollRequest = req.body as IEnrollRequest
    const userId: any = req.user?._id as any
    try {
        const { newEnroll, notification, user } = await enrollServices.createNewEnrollment(enrollRequest, userId)
        res.status(StatusCodes.CREATED).json({
            success: true,
            newEnroll,
            notification,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllEnrollments = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollServices.getAllEnrollments()
        res.status(StatusCodes.OK).json({
            success: true,
            enrollments,
            count: enrollments.length
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})
export const enrollController = {
    createNewEnrollment,
    getAllEnrollments
}
