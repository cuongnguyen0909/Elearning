import { StatusCodes } from 'http-status-codes'
import { CourseModel, ICourse } from '../models/course.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { redis } from '../configs/connect.redis.config'

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

    const content: any = course?.courseData as any

    return { course, content }
}

export const courseServices = {
    createCourse,
    updateCourse,
    getOneCourse,
    getAllCourses,
    getAccessibleCourses
}
