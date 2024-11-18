import { StatusCodes } from 'http-status-codes'
import { ICourse } from '../models/schemas/course.schema'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import { IContent } from '../models/schemas/content.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { CommentModel } from '../models/comment.model'
import { IComment } from '../models/schemas/comment.schema'
import { CourseModel } from '../models/course.model'
import { INotification } from '../models/schemas/notification.schema'
import { NotificationModel } from '../models/notification.model'
import { redis } from '../configs/connect.redis.config'
import { ICommentRequest, IReplyCommentRequest } from '../interfaces/comment.interface,'
import sendMail from '../utils/mails/send-mail'
import { TypeOfEmail } from '../constants/user.constant'
import { courseHelper } from '../helpers/course.helper'
import { UserRole } from '../constants/enums/user.enum'

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
        const newComment: IComment = await CommentModel.create({
            user: userId,
            comment,
            content: contentId,
            course: courseId,
            commentReplies: []
        })

        //add comment to the course content
        courseContent.comments?.push(newComment?._id as any)
        await course?.save()
        // await redis.set(courseId, JSON.stringify(course) as any)

        //create new a notification for admin
        const newNotification: INotification = (await NotificationModel.create({
            user: user?._id,
            title: 'New Comment Received',
            message: `${user?.name} added a comment to ${courseContent?.title}`,
            comment: newComment?._id
        })) as INotification
        // console.log('newNotification', newNotification)
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)
        // const allCourses: ICourse[] = (await courseHelper.getAllCourses()) as unknown as ICourse[]
        // await redis.set('allCourses', JSON.stringify(allCourses))
        const newCommentPopulated: IComment = (await getOneCommentById(newComment?._id)) as unknown as IComment
        return newCommentPopulated
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const addCommentReply = async (commentRequest: IReplyCommentRequest, userId: any) => {
    try {
        const { reply, commentId } = commentRequest as IReplyCommentRequest
        const userReply: IUser = (await UserModel.findById(userId)) as IUser
        const comment: IComment = (await CommentModel.findById(commentId)) as IComment
        const userComment: IUser = (await UserModel.findById(comment?.user)) as IUser
        const contentId: any = comment?.content as any
        if (!comment) {
            throw new ErrorHandler('Comment not found', StatusCodes.NOT_FOUND)
        }
        const course: ICourse = (await CourseModel.findById(comment?.course)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        const content: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId.toString()
        ) as IContent
        if (!content) {
            throw new ErrorHandler('Content not found', StatusCodes.NOT_FOUND)
        }
        const newReply: any = {
            user: userId,
            reply,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        comment.commentReplies?.push(newReply)
        await comment?.save()
        //send notifcation mail to the user when admin reply to the comment
        if (userReply?._id.toString() === userComment?._id.toString()) {
            // create a notification
            await NotificationModel.create({
                user: userReply?._id,
                title: 'New Comment Received',
                message: `You have a comment from ${userReply?.name} on ${content?.title}`,
                comment: commentId
            })
        } else {
            // send email
            const data: any = {
                commnetName: userComment?.name,
                contentTitle: content?.title,
                replierName: userReply?.name,
                courseName: course?.title
            }
            await sendMail(
                {
                    email: userComment?.email,
                    subject: 'Reply to your comment',
                    template: 'reply-comment.template.ejs',
                    data
                },
                TypeOfEmail.NOTIFICATION
            )
        }
        const courseAfterReplyComment: ICourse = (await courseHelper.getOneCourseById(
            comment.course as unknown as string
        )) as unknown as ICourse
        await redis.set(comment.course.toString(), JSON.stringify(courseAfterReplyComment) as any)
        // const allCourses = await CourseModel.find().sort({ createdAt: -1 })
        // await redis.set('allCourses', JSON.stringify(allCourses))
        return comment
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllComments = async () => {
    try {
        const comments: IComment[] = (await CommentModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'name email avatar'
            })
            .populate({
                path: 'commentReplies.user',
                select: 'name email avatar'
            })) as IComment[]
        // .populate({

        // })
        return comments
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getOneCommentById = async (commentId: any) => {
    try {
        const comment: IComment = (await CommentModel.findById(commentId)
            .populate({
                path: 'user',
                select: 'name email avatar'
            })
            .populate({
                path: 'commentReplies.user',
                select: 'name email avatar'
            })) as IComment
        return comment
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteComment = async (commentId: any, courseId: any, contentId: any) => {
    try {
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        const content: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId.toString()
        ) as IContent
        if (!content) {
            throw new ErrorHandler('Content not found', StatusCodes.NOT_FOUND)
        }
        content.comments = content.comments?.filter((comment: any) => comment.toString() !== commentId.toString())
        ;(await CommentModel.findByIdAndDelete(commentId)) as any
        await course?.save()
        const courseAfterDeleteComment: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterDeleteComment) as any)
        return 'Comment is deleted successfully'
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteCommentReply = async (commentId: any, replyId: any) => {
    try {
        const comment: IComment = (await CommentModel.findById(commentId)) as IComment
        if (!comment) {
            throw new ErrorHandler('Comment not found', StatusCodes.NOT_FOUND)
        }
        comment.commentReplies = comment.commentReplies?.filter(
            (reply: any) => reply._id.toString() !== replyId.toString()
        )
        await comment?.save()
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(
            comment.course as unknown as string
        )) as unknown as ICourse
        await redis.set(comment.course.toString(), JSON.stringify(courseAfterUpdate) as any)
        return courseAfterUpdate
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const commentServices = {
    addComment,
    addCommentReply,
    getAllComments,
    getOneCommentById,
    deleteComment,
    deleteCommentReply
}
