import { ICourse } from './../models/schemas/course.schema'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { redis } from '../configs/connect.redis.config'
import { TypeOfEmail } from '../constants/user.constant'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import {
    ICommentRequest,
    IReplyCommentRequest,
    IReplyReviewRequest,
    IReviewRequest
} from '../interfaces/course.interface'
import { CourseModel } from '../models/course.model'
import { IComment } from '../models/schemas/comment.schema'
import { IContent } from '../models/schemas/content.schema'
import { IUser } from '../models/schemas/user.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import sendMail from '../utils/mails/send-mail'
import { NotificationModel } from '../models/notification.model'
import { IReview } from '../models/schemas/review.schema'
import { ReviewModel } from '../models/review.model'
import { UserRole } from '../constants/enums/user.enum'
import { UserModel } from '../models/user.model'

const createCourse = async (courseDataRequest: ICourse) => {
    try {
        const thumbnail: string = courseDataRequest?.thumbnail as unknown as string
        if (!courseDataRequest) {
            throw new ErrorHandler('Invalid data', StatusCodes.BAD_REQUEST)
        }
        // if (!thumbnail) {
        //     throw new ErrorHandler('Thumbnail is required', StatusCodes.BAD_REQUEST)
        // }
        if (thumbnail) {
            const myCloud: any = await uploadFile('courses', thumbnail)
            courseDataRequest.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        const course: ICourse = (await CourseModel.create(courseDataRequest)) as ICourse
        const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        await redis.set('allCourses', JSON.stringify(allCourses))
        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updateCourse = async (courseId: string, courseDataRequest: ICourse) => {
    try {
        const existingCourse: ICourse = (await CourseModel.findById(courseId)) as ICourse
        const thumbnail: any = courseDataRequest?.thumbnail as unknown as any
        if (!courseId) {
            throw new ErrorHandler('Invalid course id', StatusCodes.BAD_REQUEST)
        }
        if (!courseDataRequest) {
            throw new ErrorHandler('Invalid data', StatusCodes.BAD_REQUEST)
        }
        if (!existingCourse) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        // if (!thumbnail) {
        //     throw new ErrorHandler('Thumbnail is required', StatusCodes.BAD_REQUEST)
        // }
        if (thumbnail) {
            await deleteFile(thumbnail?.public_id)
            const myCloud: any = await uploadFile('courses', thumbnail)
            courseDataRequest.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        const updatedCourse: ICourse = (await CourseModel.findByIdAndUpdate(courseId, courseDataRequest, {
            new: true
        })) as ICourse
        await redis.set(courseId, JSON.stringify(updatedCourse) as any)
        const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        await redis.set('allCourses', JSON.stringify(allCourses))
        return updatedCourse
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getOneCourseWithoutLogin = async (courseId: string) => {
    try {
        let course: ICourse
        const isCachedExist: string = (await redis.get(courseId)) as unknown as string
        if (isCachedExist) {
            course = JSON.parse(isCachedExist) as ICourse
        } else {
            course = (await CourseModel.findById(courseId)
                .select('-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions')
                .populate({
                    path: 'reviews', // Populate các reviews
                    populate: [
                        {
                            path: 'user', // Populate thông tin người dùng của review
                            select: 'name email' // Chọn các thông tin cần thiết của user
                        },
                        {
                            path: 'reviewReplies.user', // Populate thông tin người dùng của review reply
                            select: 'name email' // Chọn các thông tin cần thiết của user
                        }
                    ]
                })) as ICourse

            await redis.set(courseId, JSON.stringify(course) as any)
        }
        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCoursesWithoutLogin = async () => {
    try {
        const isCachedExist: string = (await redis.get('allCourses')) as unknown as string
        let courses: ICourse[]
        if (isCachedExist) {
            courses = JSON.parse(isCachedExist) as ICourse[]
        } else {
            courses = (await CourseModel.find()
                .select('-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions')
                .populate({
                    path: 'reviews', // Populate các reviews
                    populate: [
                        {
                            path: 'user', // Populate thông tin người dùng của review
                            select: 'name email' // Chọn các thông tin cần thiết của user
                        },
                        {
                            path: 'reviewReplies.user', // Populate thông tin người dùng của review reply
                            select: 'name email' // Chọn các thông tin cần thiết của user
                        }
                    ]
                })) as ICourse[]
            await redis.set('allCourses', JSON.stringify(courses) as any)
        }
        return courses
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAccessibleCourses = async (courseList: [], courseId: string) => {
    try {
        const courseExistById: ICourse = (await CourseModel.findById(courseId)) as ICourse
        const courseExists: any = courseList.find((id: any) => id.toString() === courseId) as any

        if (!courseExistById) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }

        if (!courseExists) {
            throw new ErrorHandler('You are not allowed to access this course', StatusCodes.FORBIDDEN)
        }
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse

        const content: any = course?.contents as any

        return { course, content }
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const addComment = async (commentRequest: ICommentRequest, userId: any) => {
    try {
        const user: IUser = (await UserModel.findById(userId)) as IUser
        const { comment, courseId, contentId } = commentRequest as ICommentRequest

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }

        const courseContent: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId
        ) as IContent
        if (!courseContent) {
            throw new ErrorHandler('Content not found', StatusCodes.NOT_FOUND)
        }

        //create a new comment
        const newComment: any = {
            user: user,
            comment,
            commentReplies: []
        }

        //add comment to the course content
        courseContent.comments?.push(newComment)
        await course?.save()
        await redis.set(courseId, JSON.stringify(course) as any)

        //create new a notification for admin
        await NotificationModel.create({
            userId: user?._id,
            title: 'New Comment Received',
            message: `${user?.name} added a comment to ${courseContent?.title}`
        })

        const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        await redis.set('allCourses', JSON.stringify(allCourses))
        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const addCommentReply = async (commentRequest: IReplyCommentRequest, user: any) => {
    try {
        const { reply, courseId, contentId, commentId } = commentRequest as IReplyCommentRequest

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse

        const content: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId
        ) as IContent

        const comment: IComment = content?.comments?.find(
            (comment: any) => comment?._id.toString() === commentId
        ) as IComment

        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        if (!content) {
            throw new ErrorHandler('Content not found', StatusCodes.NOT_FOUND)
        }
        if (!comment) {
            throw new ErrorHandler('Comment not found', StatusCodes.NOT_FOUND)
        }
        const newReply: any = {
            user: user,
            reply
        }
        comment.commentReplies?.push(newReply)
        await course?.save()

        //send notifcation mail to the user when admin reply to the comment
        if (user?._id === comment.user?._id) {
            // create a notification
            await NotificationModel.create({
                userId: user?._id,
                title: 'New Comment Received',
                message: `You have a comment from ${user?.name} on ${content?.title}`
            })
        } else {
            // send email
            const data: any = {
                commnetName: comment?.user?.name,
                contentTitle: content?.title,
                replierName: user?.name,
                courseName: course?.title
            }
            await sendMail(
                {
                    email: comment?.user?.email,
                    subject: 'Reply to your comment',
                    template: 'reply-comment.template.ejs',
                    data
                },
                TypeOfEmail.NOTIFICATION
            )
        }
        await redis.set(courseId, JSON.stringify(course) as any)
        const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        await redis.set('allCourses', JSON.stringify(allCourses))
        return { course, content, comment }
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const addReview = async (reviewRequest: IReviewRequest, user: IUser, courseId: string) => {
    try {
        const { review, rating } = reviewRequest as IReviewRequest
        //check if the user is allowed to access the course
        const userCourseList: any = user?.courses as any

        if (userCourseList?.length === 0 || !userCourseList) {
            throw new ErrorHandler(
                'You have not purchased any course. Please enroll in this course',
                StatusCodes.FORBIDDEN
            )
        }
        const courseExists: any = userCourseList?.some((course: any) => course?._id.toString() === courseId) as any
        if (!courseExists) {
            console.log('courseExists', courseExists)
            throw new ErrorHandler('You are not allowed to access this course', StatusCodes.FORBIDDEN)
        }

        //find the course by id
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        //create a new review and save in to database
        const newReview: IReview = await ReviewModel.create({
            user: user?._id,
            rating,
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
        await redis.set(courseId, JSON.stringify(course) as any)
        const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        await redis.set('allCourses', JSON.stringify(allCourses))

        const notification = {
            title: 'New Review Added',
            message: `${user?.name} added a review to ${course?.title}`
        }
        return { course, newReview, notification }
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

//if only admin can reply to the review
const addReviewReply = async (reviewRequest: IReplyReviewRequest, userId: string) => {
    try {
        const { reply, reviewId, courseId } = reviewRequest as IReplyReviewRequest
        const user: IUser = (await UserModel.findById(userId)) as IUser
        //check course exist
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        //check review exist
        const review: IReview = (await ReviewModel.findById(reviewId)) as IReview
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

        return { course, review, newReviewReply }
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCoursesByAdmin = async () => {
    try {
        const courses: ICourse[] = (await CourseModel.find().sort({ createdAt: -1 })) as ICourse[]
        return courses
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

//seach course by title
const searchCourse = async (title: string) => {
    try {
        const query: any = title ? { title: { $regex: title, $options: 'i' } } : {}
        const courses: ICourse[] = (await CourseModel.find(query)) as ICourse[]
        return courses
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const courseServices = {
    createCourse,
    updateCourse,
    getOneCourseWithoutLogin,
    getAllCoursesWithoutLogin,
    getAccessibleCourses,
    addComment,
    addCommentReply,
    addReview,
    addReviewReply,
    searchCourse,
    getAllCoursesByAdmin
}
