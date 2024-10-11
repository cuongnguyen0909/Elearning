import mongoose, { Types } from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { CourseModel, ICourse } from '../models/course.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { redis } from '../configs/connect.redis.config'
import { ICommentRequest } from '../interfaces/course.interface'
import { IContent } from '../models/schemas/content.schema'
import { IComment } from '../models/schemas/comment.schema'

const createCourse = async (courseDataRequest: ICourse) => {
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
    return course
}

const updateCourse = async (courseId: string, courseDataRequest: ICourse) => {
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
    return updatedCourse
}

const getOneCourse = async (courseId: string) => {
    const isCachedExist: string = (await redis.get(courseId)) as unknown as string
    let course: ICourse
    if (isCachedExist) {
        course = JSON.parse(isCachedExist) as ICourse
    } else {
        course = (await CourseModel.findById(courseId).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions'
        )) as ICourse
        await redis.set(courseId, JSON.stringify(course) as any)
    }
    return course
}

const getAllCourses = async () => {
    const isCachedExist: string = (await redis.get('allCourses')) as unknown as string
    let courses: ICourse[]
    if (isCachedExist) {
        courses = JSON.parse(isCachedExist) as ICourse[]
    } else {
        courses = (await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions'
        )) as ICourse[]
        await redis.set('allCourses', JSON.stringify(courses) as any)
    }
    return courses
}

const getAccessibleCourses = async (courseList: [], courseId: string) => {
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
}

const addComment = async (commentRequest: ICommentRequest, user: any) => {
    const { comment, courseId, contentId } = commentRequest as ICommentRequest

    const course: ICourse = (await CourseModel.findById(courseId)) as ICourse

    if (!course) {
        throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
    }

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ErrorHandler('Invalid course or content id', StatusCodes.BAD_REQUEST)
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
        comment: comment,
        commentReplies: []
    }

    //add comment to the course content
    courseContent.comments?.push(newComment)

    await course.save()
    return { course, courseContent }
}
const addReply = async (commentRequest: IReplyCommentRequest, user: any) => {
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
    } else {
        // send email
        const data = {
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
    return { course, content, comment }
}

export const courseServices = {
    createCourse,
    updateCourse,
    getOneCourse,
    getAllCourses,
    getAccessibleCourses,
    addComment,
    addReply
}
