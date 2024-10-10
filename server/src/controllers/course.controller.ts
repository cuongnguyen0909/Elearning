import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICourse } from '../models/course.model'
import { courseServices } from '../services/course.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

const createCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: ICourse = req.body
        const course: ICourse = await courseServices.createCourse(data)
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Course is created successfully',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const updateCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId: string = req?.params?.id
        const data: ICourse = req?.body
        const updatedCourse: ICourse = (await courseServices.updateCourse(courseId, data)) as ICourse
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Course is updated successfully',
            course: updatedCourse
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getSingleCourseWhithoutPurchasing = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId: string = req?.params?.id as string

        const courseDetails: ICourse = await courseServices.getOneCourse(courseId)
        res.status(StatusCodes.OK).json({
            success: true,
            course: courseDetails
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllCoursesWithoutPurchasing = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses: ICourse[] = (await courseServices.getAllCourses()) as ICourse[]
        res.status(StatusCodes.OK).json({
            success: true,
            courses
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAccessibleCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId: string = req?.params?.id as string
        const courseList: [] = req?.user?.courses as []
        const { content, course } = (await courseServices.getAccessibleCourses(courseList, courseId)) as any

        res.status(StatusCodes.OK).json({
            success: true,
            course,
            content
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const courseController = {
    createCourse,
    updateCourse,
    getSingleCourseWhithoutPurchasing,
    getAllCoursesWithoutPurchasing,
    getAccessibleCourse
}
