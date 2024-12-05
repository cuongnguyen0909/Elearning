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
import { redis } from '../configs/connect.redis.config'
import { profile } from 'console'
import { profileHelpers } from '../helpers/profile.helper'
import { enrollHelper } from '../helpers/enroll.helper'

require('dotenv').config()

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)

const createNewEnrollment = async (enrollRequest: any, userId: string) => {
    try {
        const { course: courseId, payment_info } = enrollRequest as any
        const user: IUser = (await UserModel.findById(userId)) as IUser

        if (payment_info) {
            if ('id' in payment_info) {
                const paymentIntentId = payment_info?.id
                const paymentIntent = await stripe?.paymentIntents?.retrieve(paymentIntentId)

                if (paymentIntent?.status !== 'succeeded') {
                    throw new ErrorHandler('Thanh toán không thành công, vui lòng thử lại!', StatusCodes.BAD_REQUEST)
                }
            }
        }

        if (!courseId || !payment_info) {
            throw new ErrorHandler('Vui lòng điền đầy đủ thông tin.', StatusCodes.BAD_REQUEST)
        }
        //check course is already enrolled or not
        const isCourseEnrolled: any = user?.courses?.some((course: any) => course?._id.toString() === courseId)

        if (isCourseEnrolled) {
            throw new ErrorHandler('Bạn đã mua khóa học này rồi. Hãy mua khóa học khác.', StatusCodes.BAD_REQUEST)
        }

        const course: ICourse = (await CourseModel.findById(courseId)) as ICourse
        if (!course) {
            throw new ErrorHandler('Không tìm thấy khóa học.', StatusCodes.NOT_FOUND)
        }

        //create new enroll
        const newEnroll: IEnroll = (await EnrollmentModel.create({
            user: userId,
            course: courseId,
            payment_info
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
        const updatedUser: IUser = (await profileHelpers.getProfileById(userId)) as IUser
        await redis?.set(userId, JSON.stringify(updatedUser), 'EX', 60 * 60 * 24)

        const notification: INotification = (await NotificationModel.create({
            user: user?._id,
            title: 'Đăng ký khóa học thành công',
            message: `Bạn đã đăng ký khóa học ${course?.title}`
        })) as INotification

        const allEnrollments = await enrollHelper.getAllEntrollments()
        redis.set('allEnrollments', JSON.stringify(allEnrollments))

        return { newEnroll, course, notification, user }
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllEnrollments = async () => {
    try {
        const isCachedExist = await redis.get('allEnrollments')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const allEnrollments: IEnroll[] = (await enrollHelper.getAllEntrollments()) as IEnroll[]
        redis.set('allEnrollments', JSON.stringify(allEnrollments))
        return allEnrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const enrollServices = {
    createNewEnrollment,
    getAllEnrollments
}
