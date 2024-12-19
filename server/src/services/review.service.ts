import { StatusCodes } from 'http-status-codes'
import { redis } from '../configs/connect.redis.config'
import { UserRole } from '../constants/enums/user.enum'
import { TypeOfEmail } from '../constants/user.constant'
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
import sendMail from '../utils/mails/send-mail'
import { reviewHelper } from '../helpers/review.helpers'
import { notificationHelper } from '../helpers/notification.helper'

const getReviewById = async (reviewId: any) => {
    try {
        const review: IReview = (await ReviewModel.findById(reviewId).populate({
            path: 'user',
            select: 'name email avatar'
        })) as IReview
        return review
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const addReview = async (reviewRequest: IReviewRequest, userId: any, courseId: string) => {
    try {
        const { review, rating } = reviewRequest as IReviewRequest
        //check if the user is allowed to access the course
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (!user) {
            throw new ErrorHandler('Không tìm thấy tài khoản.', StatusCodes.NOT_FOUND)
        }
        if (user.role === UserRole.ADMIN) {
            throw new ErrorHandler('Quản trị viên không được đánh giá khóa học.', StatusCodes.FORBIDDEN)
        }
        const userCourseList: any = user?.courses as any

        if (Number(rating) < 1 || Number(rating) > 5) {
            throw new ErrorHandler('Số sao phải từ một đến năm.', StatusCodes.BAD_REQUEST)
        }

        if (userCourseList?.length === 0 || !userCourseList) {
            throw new ErrorHandler('Bạn chưa đăng ký khóa học. Hãy đăng ký ngay!', StatusCodes.FORBIDDEN)
        }
        const courseExists: any = userCourseList?.some((course: any) => course?._id.toString() === courseId) as any
        if (!courseExists) {
            throw new ErrorHandler('Bạn không có quyền truy cập vào khóa học.', StatusCodes.FORBIDDEN)
        }

        //find the course by id
        const course: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }
        const isUserReviewed: boolean = course?.reviews?.some(
            (review: any) => review.user?._id.toString() === userId.toString()
        )
        if (isUserReviewed) {
            throw new ErrorHandler('Bạn đã đánh giá khóa học này rồi.', StatusCodes.BAD_REQUEST)
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
            title: 'Đánh giá mới',
            message: `${user?.name} vừa đánh giá bài học: ${course?.title} với số sao: ${rating}`,
            user: userId,
            review: newReview?._id,
            course: courseId
        })
        const allNotifications = (await notificationHelper.getAllNotifications()) as any
        await redis.set('allNotifications', JSON.stringify(allNotifications) as any)
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)
        const reviewAfterUpdate: IReview = (await getReviewById(newReview?._id)) as unknown as IReview

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
            throw new ErrorHandler('Không tìm thấy người dùng.', StatusCodes.NOT_FOUND)
        }

        //check course exist
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }
        //check review exist
        const review: IReview = (await ReviewModel.findById(reviewId)) as IReview
        const reviewrUser: IUser = (await UserModel.findById(review?.user)) as IUser
        if (!review) {
            throw new ErrorHandler('Không tìm thấy đánh giá.', StatusCodes.NOT_FOUND)
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
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)

        return courseAfterUpdate
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllReviews = async () => {
    try {
        const reviews: IReview[] = await reviewHelper.getAllReviews()
        return reviews
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteReplyReview = async (reviewId: any, replyId: any) => {
    try {
        const review: IReview = (await ReviewModel.findById(reviewId)) as IReview
        if (!review) {
            throw new ErrorHandler('Không tìm thấy đánh giá.', StatusCodes.NOT_FOUND)
        }
        const replyIndex: number = review.reviewReplies.findIndex((reply: any) => reply._id.toString() === replyId)
        if (replyIndex === -1) {
            throw new ErrorHandler('Reply not found', StatusCodes.NOT_FOUND)
        }
        review.reviewReplies.splice(replyIndex, 1)
        await review?.save()
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(
            review.course as unknown as string
        )) as unknown as ICourse
        await redis.set(review.course.toString(), JSON.stringify(courseAfterUpdate) as any)
        return courseAfterUpdate
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const reviewServices = {
    addReview,
    addReviewReply,
    getAllReviews,
    deleteReplyReview
}
