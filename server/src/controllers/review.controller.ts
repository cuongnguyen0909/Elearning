import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IReplyReviewRequest, IReviewRequest } from '../interfaces/review.interface'
import { ICourse } from '../models/schemas/course.schema'
import { IReview } from '../models/schemas/review.schema'
import { IUser } from '../models/schemas/user.schema'
import { reviewServices } from '../services/review.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { redis } from '../configs/connect.redis.config'

const addReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId: string = req?.params?.id as string
        const userId: IUser = req?.user?._id as IUser
        const reviewRequest: IReviewRequest = req.body as IReviewRequest
        const course: ICourse = (await reviewServices.addReview(reviewRequest, userId, courseId)) as ICourse
        // if (userCourseList?.length === 0 || !userCourseList) {
        //     return res.status(StatusCodes.FORBIDDEN).json({
        //         success: false,
        //         message: 'You are not allowed to access this course'
        //     })
        // }

        if (!course || course instanceof ErrorHandler) {
            return next(new ErrorHandler(course.message, course.statusCode || StatusCodes.BAD_REQUEST))
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Đánh giá thành công',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const addReviewReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const reviewRequest: IReplyReviewRequest = req.body as IReplyReviewRequest
    const userId: any = req?.user?._id as any
    try {
        const course: ICourse = (await reviewServices.addReviewReply(reviewRequest, userId)) as ICourse
        if (!course || course instanceof ErrorHandler) {
            return next(new ErrorHandler(course.message, course.statusCode || StatusCodes.BAD_REQUEST))
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Đánh giá phản hồi thành công',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllReviews = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews: IReview[] = (await reviewServices.getAllReviews()) as IReview[]
        if (!reviews || reviews instanceof ErrorHandler) {
            return next(new ErrorHandler(reviews.message, reviews.statusCode || StatusCodes.BAD_REQUEST))
        }
        await redis.set('allReviews', JSON.stringify(reviews))
        res.status(StatusCodes.OK).json({
            success: true,
            reviews
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const deleteReviewReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId, replyId } = req.body as any
        const course: ICourse = (await reviewServices.deleteReplyReview(reviewId, replyId)) as ICourse
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Xóa phản hồi thành công',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const reviewController = {
    addReview,
    addReviewReply,
    getAllReviews,
    deleteReviewReply
}
