import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IReplyReviewRequest, IReviewRequest } from '../interfaces/review.interface'
import { ICourse } from '../models/schemas/course.schema'
import { IReview } from '../models/schemas/review.schema'
import { IUser } from '../models/schemas/user.schema'
import { reviewServices } from '../services/review.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'

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
            message: 'Review is added successfully',
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
        const review: IReview = (await reviewServices.addReviewReply(reviewRequest, userId)) as IReview
        if (!review || review instanceof ErrorHandler) {
            return next(new ErrorHandler(review.message, review.statusCode || StatusCodes.BAD_REQUEST))
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Review reply is added successfully',
            review
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
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'All reviews are fetched successfully',
            reviews
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const reviewController = {
    addReview,
    addReviewReply,
    getAllReviews
}
