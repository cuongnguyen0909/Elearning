import { StatusCodes } from 'http-status-codes'
import { redis } from '../configs/connect.redis.config'
import { courseHelper } from '../helpers/course.helper'
import { deleteFile, uploadFile } from '../helpers/upload.help'
import { CourseModel } from '../models/course.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { ICourse } from './../models/schemas/course.schema'
import { CategoryModel } from '../models/category.mode'

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
        const courseId: any = course?._id as any
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        await redis.set(courseId, JSON.stringify(courseAfterUpdate) as any)
        const allCourses = await courseHelper.getAllCourses()
        // await redis.set('allCourses', JSON.stringify(allCourses))
        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updateCourse = async (courseId: string, courseDataRequest: ICourse) => {
    try {
        // Kiểm tra courseId và courseDataRequest có hợp lệ không
        if (!courseId) {
            throw new ErrorHandler('Invalid course id', StatusCodes.BAD_REQUEST)
        }
        if (!courseDataRequest) {
            throw new ErrorHandler('Invalid data', StatusCodes.BAD_REQUEST)
        }

        // Lấy thông tin khóa học hiện tại
        const existingCourse: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!existingCourse) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }

        // Kiểm tra và xử lý thumbnail
        const thumbnail: any = courseDataRequest?.thumbnail
        if (thumbnail) {
            // Nếu có thumbnail mới, xóa thumbnail cũ và cập nhật thumbnail mới
            if (thumbnail?.public_id) {
                await deleteFile(thumbnail.public_id)
            }
            const myCloud: any = await uploadFile('courses', thumbnail)
            courseDataRequest.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        // Loại bỏ các field có giá trị null hoặc undefined khỏi dữ liệu cập nhật
        const cleanRequestData = (data: ICourse) => {
            return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null && v !== undefined))
        }
        const sanitizedData = cleanRequestData(courseDataRequest)

        // Cập nhật khóa học
        const updatedCourse: ICourse = (await CourseModel.findByIdAndUpdate(courseId, sanitizedData, {
            new: true,
            overwrite: false
        })) as ICourse

        // Lấy thông tin khóa học sau khi cập nhật
        const courseAfterUpdate: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse

        // Cập nhật khóa học vào Redis
        await redis.set(courseId, JSON.stringify(courseAfterUpdate))

        // Trả về kết quả
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
            course = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse

            await redis.set(courseId, JSON.stringify(course), 'EX', 60 * 60 * 24 * 7) // 7 days
        }
        return course
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCoursesWithoutLogin = async () => {
    try {
        // const isCachedExist: string = (await redis.get('allCourses')) as unknown as string

        const courses: ICourse[] = (await courseHelper.getAllCourses()) as unknown as ICourse[]
        // await redis.set('allCourses', JSON.stringify(courses) as any)
        return courses
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAccessibleCourses = async (courseList: [], courseId: string) => {
    try {
        const courseExistById: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse
        const courseExists: any = courseList.find((id: any) => id.toString() === courseId) as any

        if (!courseExistById) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }

        if (!courseExists) {
            throw new ErrorHandler('You are not allowed to access this course', StatusCodes.FORBIDDEN)
        }
        const course: ICourse = (await courseHelper.getOneCourseById(courseId)) as unknown as ICourse

        const content: any = course?.contents as any

        return { course, content }
    } catch (error: any) {
        return new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCoursesByAdmin = async () => {
    try {
        const courses: ICourse[] = (await courseHelper.getAllCourses()) as unknown as ICourse[]
        return courses
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const searchCourse = async (title: string, category: string) => {
    try {
        const match: any = {}

        // Tìm kiếm theo title của course
        if (title) {
            match.title = { $regex: title, $options: 'i' } // Case-insensitive search
        }

        // Nếu có category, chuyển `category` từ tên thành `_id`
        if (category) {
            // Tìm `_id` của category trong collection CategoryModel
            const categoryDoc = await CategoryModel.findOne({ title: category })
            if (categoryDoc) {
                match.category = categoryDoc._id // Lọc theo ObjectId của category
            } else {
                // Nếu không tìm thấy category, trả về danh sách rỗng
                return []
            }
        }

        // Dùng aggregate để lookup category từ ObjectId
        const courses = await CourseModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'categories', // Tên collection category
                    localField: 'category', // Field category trong Course
                    foreignField: '_id', // Field _id trong Category
                    as: 'categoryInfo' // Tên field lưu category sau khi lookup
                }
            },
            {
                $unwind: '$categoryInfo' // Giải phóng mảng để lấy từng object category
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    category: '$categoryInfo.title' // Thay thế ObjectId bằng tên category
                }
            }
        ])

        return courses
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteCourse = async (courseId: string) => {
    try {
        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }
        course.isDeleted = true
        await course?.save()
        const deletedCourse: ICourse = (await courseHelper.getOneCourseById(courseId)) as ICourse
        await redis.del(courseId)
        // const allCourses = await courseHelper.getAllCourses()
        // await redis.set('allCourses', JSON.stringify(allCourses))
        return deletedCourse
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
    searchCourse,
    getAllCoursesByAdmin,
    deleteCourse
}
