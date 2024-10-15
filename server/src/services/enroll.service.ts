import { INotification } from './../models/schemas/notification.schema'
import { enrollController } from './../controllers/enroll.controller'
import { CourseModel } from '../models/course.model'
import { ICourse } from '../models/schemas/course.schema'
import { IUser } from '../models/schemas/user.schema'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IEnroll } from '../models/schemas/enrollment.schema'
import { EnrollmentModel } from '../models/enrollment.model'
import sendMail from '../utils/mails/send-mail'
import { TypeOfEmail } from '../constants/user.constant'
import { ObjectId } from 'mongoose'
import { NotificationModel } from '../models/notification.model'
import { IEnrollMailData, IEnrollRequest } from '../interfaces/enroll.interface'

const createNewEnrollment = async (enrollRequest: IEnrollRequest, userId: string) => {
    try {
        const { courseId, payment_method } = enrollRequest as IEnrollRequest
        const user: IUser = (await UserModel.findById(userId)) as IUser
        if (!courseId || !payment_method) {
            throw new ErrorHandler('Missing required fields', 400)
        }
        //check course is already enrolled or not
        const isCourseEnrolled: any = user?.courses?.some((course: any) => course?._id.toString() === courseId)

        if (isCourseEnrolled) {
            throw new ErrorHandler('You have already purchased this course', 400)
        }

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Course not found', 404)
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
        throw new ErrorHandler(error.message, 400)
    }
}

const getAllEnrollments = async () => {
    try {
        const enrollments: IEnroll[] = (await EnrollmentModel.find().sort({ createdAt: -1 })) as IEnroll[]
        return enrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, 400)
    }
}

export const enrollServices = {
    createNewEnrollment,
    getAllEnrollments
}
