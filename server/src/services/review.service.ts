import { StatusCodes } from 'http-status-codes'
import { redis } from '../configs/connect.redis.config'
import { courseHelper } from '../helpers/course.helper'
import { IReplyReviewRequest, IReviewRequest } from '../interfaces/review.interface'
import { CourseModel } from '../models/course.model'
import { NotificationModel } from '../models/notification.model'
import { ReviewModel } from '../models/review.model'
import { ICourse } from '../models/schemas/course.schema'
import { IReview } from '../models/schemas/review.schema'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { UserRole } from '../constants/enums/user.enum'
import sendMail from '../utils/mails/send-mail'
import { TypeOfEmail } from '../constants/user.constant'

const addReview = async (reviewRequest: IReviewRequest, userId: any, courseId: string) => {
    try {
        const { review, rating } = reviewRequest as IReviewRequest
        //check if the user is allowed to access the course
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (!user) {
            throw new ErrorHandler('User not found', StatusCodes.NOT_FOUND)
        }
        if (user.role === UserRole.ADMIN) {
            throw new ErrorHandler('Admin is not allowed to add review', StatusCodes.FORBIDDEN)
        }
        const userCourseList: any = user?.courses as any

        if (Number(rating) < 1 || Number(rating) > 5) {
            throw new ErrorHandler('Rating must be between 1 and 5', StatusCodes.BAD_REQUEST)
        }

        if (userCourseList?.length === 0 || !userCourseList) {
            throw new ErrorHandler(
                'You have not purchased any course. Please enroll in this course',
                StatusCodes.FORBIDDEN
            )
        }
        const courseExists: any = userCourseList?.some((course: any) => course?._id.toString() === courseId) as any
        if (!courseExists) {
            throw new ErrorHandler('You are not allowed to access this course', StatusCodes.FORBIDDEN)
        }

        //find the course by id
        const course: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        const isUserReviewed: boolean = course?.reviews?.some(
            (review: any) => review.user?._id.toString() === userId.toString()
        )
        if (isUserReviewed) {
            throw new ErrorHandler('You have already added a review to this course', StatusCodes.BAD_REQUEST)
        }
        //create a new review and save in to database
        const newReview: IReview = await ReviewModel.create({
            user: userId,
            rating,
            course: courseId,
            review,
            reviewReplies: []
        })
        course?.reviews?.push(newReview?._id as any)
        //calculate the average rating
        let toltalrating: number = 0
        //find all reviews of the course by id and calculate the average rating of the course
        //and update the course rating
        //by using $in operator we can find all reviews of the course
        const reviews = await ReviewModel.find({ _id: { $in: course?.reviews } })
        reviews?.forEach((review: any) => {
            toltalrating += parseInt(review.rating)
        })
        course.rating = (toltalrating / reviews.length) as number
        await course?.save()

        //update in redis
        const notification = await NotificationModel.create({
            title: 'New Review Added',
            message: `${user?.name} added a review to ${course?.title} with rating ${rating}`,
            user: userId
        })
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)
        const allCourses: ICourse[] = (await courseHelper.getAllCourses()) as unknown as ICourse[]
        await redis.set('allCourses', JSON.stringify(allCourses))

        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

//if only admin can reply to the review
const addReviewReply = async (reviewRequest: IReplyReviewRequest, userId: string) => {
    try {
        const { reply, reviewId, courseId } = reviewRequest as IReplyReviewRequest
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (!user) {
            throw new ErrorHandler('User not found', StatusCodes.NOT_FOUND)
        }

        //check course exist
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        //check review exist
        const review: IReview = (await ReviewModel.findById(reviewId)) as IReview
        const reviewrUser: IUser = (await UserModel.findById(review?.user)) as IUser
        if (!review) {
            throw new ErrorHandler('Review not found', StatusCodes.NOT_FOUND)
        }
        //create a new review reply
        const newReviewReply: any = {
            user: userId,
            reply
        }

        //add review reply to the review
        if (!review.reviewReplies) {
            review.reviewReplies = []
        }
        review.reviewReplies?.push(newReviewReply)

        await review?.save()
        const data: any = {
            reviewerName: reviewrUser?.name,
            courseName: course?.title,
            replierName: user?.name
        }
        await sendMail(
            {
                email: reviewrUser?.email,
                subject: 'Reply to your review',
                template: 'reply-review.template.ejs',
                data
            },
            TypeOfEmail.NOTIFICATION
        )

        return review
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllReviews = async () => {
    try {
        const reviews: IReview[] = (await ReviewModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'name email avatar'
            })
            .populate({
                path: 'reviewReplies.user',
                select: 'name email avatar'
            })) as IReview[]
        return reviews
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const reviewServices = {
    addReview,
    addReviewReply,
    getAllReviews
}
