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

// const addComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const commentData: ICommentRequest = req.body as ICommentRequest
//     const userId: any = req?.user?._id as any
//     try {
//         const course = (await courseServices.addComment(commentData, userId)) as any
//         res.status(StatusCodes.OK).json({
//             success: true,
//             message: 'Comment is added successfully',
//             course
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
//     }
// })

// const addCommentReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const replyCommentRequest: IReplyCommentRequest = req.body as IReplyCommentRequest
//     const userId: any = req?.user?._id as any
//     try {
//         const { comment }: IComment = (await courseServices.addCommentReply(
//             replyCommentRequest,
//             userId
//         )) as unknown as IComment
//         res.status(StatusCodes.OK).json({
//             success: true,
//             message: 'Reply is added successfully',
//             comment
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
//     }
// })

// const addReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const courseId: string = req?.params?.id as string
//         const user: IUser = req?.user as IUser
//         const reviewRequest: IReviewRequest = req.body as IReviewRequest
//         const { course, newReview, notification, userCourseList }: any = (await courseServices.addReview(
//             reviewRequest,
//             user,
//             courseId
//         )) as any
//         // if (userCourseList?.length === 0 || !userCourseList) {
//         //     return res.status(StatusCodes.FORBIDDEN).json({
//         //         success: false,
//         //         message: 'You are not allowed to access this course'
//         //     })
//         // }
//         res.status(StatusCodes.OK).json({
//             success: true,
//             message: 'Review is added successfully',
//             course
//         })
//     } catch (error: any) {}
// })

//just only admin can reply to the review
// const addReviewReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const reviewRequest: IReplyReviewRequest = req.body as IReplyReviewRequest
//     const userId: any = req?.user?._id as any
//     try {
//         const { course, review, newReviewReply }: any = (await courseServices.addReviewReply(
//             reviewRequest,
//             userId
//         )) as any
//         res.status(StatusCodes.OK).json({
//             success: true,
//             message: 'Review reply is added successfully',
//             course,
//             review,
//             newReviewReply
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
//     }
// })

//search course by title
const searchCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req?.query as any
        const courses: ICourse[] = (await courseServices.searchCourse(title)) as ICourse[]
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

const apiKeys = [
    process.env.VDOCIPHER_API_KEY_SECRET_1,
    process.env.VDOCIPHER_API_KEY_SECRET_2,
    process.env.VDOCIPHER_API_KEY_SECRET_3
]
let currentKeyIndex = 0

function getNextApiKey() {
    const apiKey = apiKeys[currentKeyIndex]
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
    return apiKey
}

const generateVideoUrl = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body as any

    for (let attempt = 0; attempt < apiKeys.length; attempt++) {
        const apiKey = getNextApiKey()

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
            console.error(`Failed with API key ${apiKey}: ${error.message}`)

            // Chỉ chuyển sang key khác nếu gặp lỗi, thử lại
            if (attempt === apiKeys.length - 1) {
                // Nếu tất cả keys đều thất bại
                return next(new ErrorHandler('All API keys failed', StatusCodes.BAD_REQUEST))
            }
        }
    }
})

export const courseController = {
    createCourse,
    updateCourse,
    getSingleCourseWhithoutPurchasing,
    getAllCoursesWithoutPurchasing,
    getAccessibleCourse,
    // addComment,
    // addCommentReply,
    // addReview,
    // addReviewReply,
    searchCourse,
    getAllCoursesByAdmin,
    deleteCourse,
    generateVideoUrl
}
