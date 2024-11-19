import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ICourse } from '../models/schemas/course.schema'
import { courseServices } from '../services/course.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import axios from 'axios'

const createCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data: ICourse = req.body
    try {
        const course: ICourse = (await courseServices.createCourse(data)) as ICourse
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
    const id: string = req?.params?.id as string
    try {
        const courseDetails: ICourse = (await courseServices.getOneCourseWithoutLogin(id)) as unknown as ICourse
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
        const courses: ICourse[] = (await courseServices.getAllCoursesWithoutLogin()) as unknown as ICourse[]
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

const searchCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { keyword, category } = req.query as { keyword?: string; category?: string }

        // Gọi service với title và category
        const courses = await courseServices.searchCourse(keyword || '', category || '')

        res.status(StatusCodes.OK).json({
            success: true,
            courses
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllCoursesByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses: ICourse[] = (await courseServices.getAllCoursesByAdmin()) as ICourse[]
        res.status(StatusCodes.OK).json({
            success: true,
            courses,
            count: courses.length
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const deleteCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId: string = req.params?.id as string
        const deletedCourse: ICourse = (await courseServices.deleteCourse(courseId)) as ICourse
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Course deleted successfully',
            course: deletedCourse
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

// const apiKeys = [
//     process.env.VDOCIPHER_API_KEY_SECRET_1,
//     process.env.VDOCIPHER_API_KEY_SECRET_2,
//     process.env.VDOCIPHER_API_KEY_SECRET_3
// ]
// let currentKeyIndex = 0

// function getNextApiKey() {
//     const apiKey = apiKeys[currentKeyIndex]
//     currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
//     return apiKey
// }

const generateVideoUrl = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body as any

    // for (let attempt = 0; attempt < apiKeys.length; attempt++) {
    // const apiKey = getNextApiKey()
    const apiKey = `${process.env.VDOCIPHER_API_KEY_SECRET_1}`

    try {
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Apisecret ${apiKey}`
                }
            }
        )
        // Trả về kết quả nếu gọi thành công
        return res.json(response.data)
    } catch (error: any) {
        // console.error(`Failed with API key ${apiKey}: ${error.message}`)
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
        // Chỉ chuyển sang key khác nếu gặp lỗi, thử lại
        // if (attempt === apiKeys.length - 1) {
        //     // Nếu tất cả keys đều thất bại
        //     return next(new ErrorHandler('All API keys failed', StatusCodes.BAD_REQUEST))
        // }
        // }
    }
})

export const courseController = {
    createCourse,
    updateCourse,
    getSingleCourseWhithoutPurchasing,
    getAllCoursesWithoutPurchasing,
    getAccessibleCourse,
    searchCourse,
    getAllCoursesByAdmin,
    deleteCourse,
    generateVideoUrl
}
