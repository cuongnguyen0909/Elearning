import { StatusCodes } from 'http-status-codes'
import { CourseModel } from '../models/course.model'
import { ICourse } from '../models/schemas/course.schema'
import ErrorHandler from '../utils/handlers/ErrorHandler'

const getOneCourseById = async (courseId: string) => {
    try {
        const updatedCourse: ICourse = (await CourseModel.findById(courseId)
            .select('-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions')
            .populate({
                path: 'reviews',
                populate: [
                    {
                        path: 'user',
                        select: 'name email avatar'
                    },
                    {
                        path: 'reviewReplies.user',
                        select: 'name email avatar'
                    }
                ]
            })
            .populate({
                path: 'contents.comments',
                populate: [
                    {
                        path: 'user',
                        select: 'name email avatar'
                    },
                    {
                        path: 'commentReplies.user',
                        select: 'name email avatar'
                    }
                ]
            })) as ICourse
        return updatedCourse
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCourses = async () => {
    try {
        const courses = (await CourseModel.find()
            .sort({ createdAt: -1 })
            .select('-contents.videoUrl -contents.suggestion -contents.links')
            .populate({
                path: 'reviews', // Populate các reviews
                populate: [
                    {
                        path: 'user', // Populate thông tin người dùng của review
                        select: 'name email avatar' // Chọn các thông tin cần thiết của user
                    },
                    {
                        path: 'reviewReplies.user', // Populate thông tin người dùng của review reply
                        select: 'name email avatar' // Chọn các thông tin cần thiết của user
                    }
                ]
            })
            .populate({
                path: 'contents.comments',
                populate: [
                    {
                        path: 'user',
                        select: 'name email avatar'
                    },
                    {
                        path: 'commentReplies.user',
                        select: 'name email avatar'
                    }
                ]
            })
            .populate({
                path: 'category',
                select: 'title'
            })) as ICourse[]
        return courses
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const courseHelper = {
    getOneCourseById,
    getAllCourses
}
