import { ObjectId } from 'mongoose'
import { TypeOfEmail } from '../constants/user.constant'
import { IEnrollMailData, IEnrollRequest } from '../interfaces/enroll.interface'
import { CourseModel } from '../models/course.model'
import { EnrollmentModel } from '../models/enrollment.model'
import { NotificationModel } from '../models/notification.model'
import { ICourse } from '../models/schemas/course.schema'
import { IEnroll } from '../models/schemas/enrollment.schema'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import sendMail from '../utils/mails/send-mail'
import { INotification } from './../models/schemas/notification.schema'
import { StatusCodes } from 'http-status-codes'

const createNewEnrollment = async (enrollRequest: IEnrollRequest, userId: string) => {
    try {
        const { courseId, payment_method } = enrollRequest as IEnrollRequest
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (!courseId || !payment_method) {
            throw new ErrorHandler('Missing required fields', StatusCodes.BAD_REQUEST)
        }
        //check course is already enrolled or not
        const isCourseEnrolled: any = user?.courses?.some((course: any) => course?._id.toString() === courseId)

        if (isCourseEnrolled) {
            throw new ErrorHandler('You have already purchased this course', StatusCodes.BAD_REQUEST)
        }

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', StatusCodes.NOT_FOUND)
        }

        //create new enroll
        const newEnroll: IEnroll = (await EnrollmentModel.create({
            user: userId,
            course: courseId,
            payment_method
        })) as IEnroll
        //increase course quantity purchased
        course.purchased = (course.purchased || 0) + 1
        await course?.save()

        // send mail to user
        if (user) {
            const mailData: IEnrollMailData = {
                enroll: {
                    courseId: (course?._id as string).toString().slice(0, 6),
                    courseName: course?.title as string,
                    price: course?.price as number,
                    date: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
                },
                userName: user?.name as string
            }

            await sendMail(
                {
                    email: user?.email,
                    subject: 'Enroll Course',
                    template: 'enroll-confirmation.template.ejs',
                    data: mailData
                },
                TypeOfEmail.CONFIRMATION
            )
            user.courses?.push(courseId as unknown as ObjectId)
        }
        await user?.save()

        const notification: INotification = (await NotificationModel.create({
            user: user?._id,
            title: 'New Course Enrolled',
            message: `You have a new course enrolled: ${course?.title}`
        })) as INotification

        //save user and course

        return { newEnroll, course, notification, user }
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllEnrollments = async () => {
    try {
        const enrollments: IEnroll[] = (await EnrollmentModel.find().sort({ createdAt: -1 }).populate({
            path: 'user course'
        })) as IEnroll[]
        return enrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const enrollServices = {
    createNewEnrollment,
    getAllEnrollments
}
