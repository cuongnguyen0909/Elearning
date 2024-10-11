import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICommentRequest, IReplyCommentRequest } from '../interfaces/course.interface'
import { courseServices } from '../services/course.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { ICourse } from '../models/schemas/course.schema'

const createCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data: ICourse = req.body
    try {
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
    const courseId: string = req?.params?.id
    const data: ICourse = req?.body
    try {
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
    const courseId: string = req?.params?.id as string
    try {
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
    const courseId: string = req?.params?.id as string
    const courseList: [] = req?.user?.courses as []
    try {
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

const addComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const commentData: ICommentRequest = req.body as ICommentRequest
    const user: any = req?.user as any
    try {
        const course: ICourse = (await courseServices.addComment(commentData, user)) as unknown as ICourse
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Comment is added successfully',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const addReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const replyCommentRequest: IReplyCommentRequest = req.body as IReplyCommentRequest
    const user: any = req?.user as any
    try {
        const course: ICourse = (await courseServices.addReply(replyCommentRequest, user)) as unknown as ICourse
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Reply is added successfully',
            course
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
    getAccessibleCourse,
    addComment,
    addReply
}
