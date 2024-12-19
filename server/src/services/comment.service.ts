import { StatusCodes } from 'http-status-codes'
import { redis } from '../configs/connect.redis.config'
import { TypeOfEmail } from '../constants/user.constant'
import { courseHelper } from '../helpers/course.helper'
import { ICommentRequest, IReplyCommentRequest } from '../interfaces/comment.interface,'
import { CommentModel } from '../models/comment.model'
import { CourseModel } from '../models/course.model'
import { NotificationModel } from '../models/notification.model'
import { IComment } from '../models/schemas/comment.schema'
import { IContent } from '../models/schemas/content.schema'
import { ICourse } from '../models/schemas/course.schema'
import { INotification } from '../models/schemas/notification.schema'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import sendMail from '../utils/mails/send-mail'
import { commentHelper } from '../helpers/comment.helper'
import { notificationHelper } from '../helpers/notification.helper'

const addComment = async (commentRequest: ICommentRequest, userId: any) => {
    try {
        const user: IUser = (await UserModel.findById(userId)) as IUser
        const { comment, courseId, contentId } = commentRequest as ICommentRequest

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }

        const courseContent: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId
        ) as IContent
        if (!courseContent) {
            throw new ErrorHandler('Không tìm thấy bài học.', StatusCodes.NOT_FOUND)
        }

        const newComment: IComment = await CommentModel.create({
            user: userId,
            comment,
            content: contentId,
            course: courseId,
            commentReplies: []
        })

        courseContent.comments?.push(newComment?._id as any)
        await course?.save()

        const newNotification: INotification = (await NotificationModel.create({
            user: user?._id,
            title: 'Nhận một bình luận mới.',
            message: `${user?.name} đã bình luận ${courseContent?.title}`,
            comment: newComment?._id,
            content: contentId,
            course: courseId
        })) as INotification
        const allNotifications = (await notificationHelper.getAllNotifications()) as any
        await redis.set('allNotifications', JSON.stringify(allNotifications) as any)
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)
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
            throw new ErrorHandler('Không thể tìm thấy bình luận', StatusCodes.NOT_FOUND)
        }
        const course: ICourse = (await CourseModel.findById(comment?.course)) as ICourse
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }
        const content: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId.toString()
        ) as IContent
        if (!content) {
            throw new ErrorHandler('Không tìm thấy bài học.', StatusCodes.NOT_FOUND)
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
                title: 'Bình luận mới.',
                message: `Bạn có một bình luận từ ${userReply?.name} trong ${content?.title}`,
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
        const allNotifications = (await notificationHelper.getAllNotifications()) as any
        await redis.set('allNotifications', JSON.stringify(allNotifications) as any)
        const courseAfterReplyComment: ICourse = (await courseHelper.getOneCourseById(
            comment.course as unknown as string
        )) as unknown as ICourse
        await redis.set(comment.course.toString(), JSON.stringify(courseAfterReplyComment) as any)
        return comment
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllComments = async () => {
    try {
        const isCachedExist = await redis.get('allComments')
        if (isCachedExist) {
            return JSON.parse(isCachedExist) as IComment[]
        }
        const comments: IComment[] = await commentHelper.getAllComments()
        await redis.set('allComments', JSON.stringify(comments) as any)
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
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }
        const content: IContent = course?.contents?.find(
            (content: any) => content?._id.toString() === contentId.toString()
        ) as IContent
        if (!content) {
            throw new ErrorHandler('Không tìm thấy bài học.', StatusCodes.NOT_FOUND)
        }
        content.comments = content.comments?.filter((comment: any) => comment.toString() !== commentId.toString())
        ;(await CommentModel.findByIdAndDelete(commentId)) as any
        await course?.save()
        const courseAfterDeleteComment: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterDeleteComment) as any)
        const allComments = (await commentHelper.getAllComments()) as any
        await redis.set('allComments', JSON.stringify(allComments) as any)
        return 'Xóa bình luận thành công'
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteCommentReply = async (commentId: any, replyId: any) => {
    try {
        const comment: IComment = (await CommentModel.findById(commentId)) as IComment
        if (!comment) {
            throw new ErrorHandler('Không thể tìm thấy bình luận', StatusCodes.NOT_FOUND)
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
