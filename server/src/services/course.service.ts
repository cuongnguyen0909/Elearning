import { StatusCodes } from 'http-status-codes'
import { uploadFile } from '../helpers/user.help'
import { CourseModel, ICourse } from '../models/course.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'

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
    const thumbnail: string = courseDataRequest?.thumbnail as unknown as string
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

export const courseServices = {
    createCourse,
    updateCourse
}
