import { UserModel } from './../models/user.model'
import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { Model } from 'mongoose'
import { generateLast12MonthsData } from '../utils/analytics/analytics.generator'

const getUsersAnalytics = async (model: Model<any>) => {
    try {
        const users: any = await generateLast12MonthsData(model)
        return users
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getEnrollmentsAnalytics = async (model: Model<any>) => {
    try {
        const enrollments: any = await generateLast12MonthsData(model)
        return enrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getNotificationsAnalytics = async (model: Model<any>) => {
    try {
        const notifications: any = await generateLast12MonthsData(model)
        return notifications
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getCoursesAnalytics = async (model: Model<any>) => {
    try {
        const courses: any = await generateLast12MonthsData(model)
        return courses
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const analyticSevices = {
    getUsersAnalytics,
    getEnrollmentsAnalytics,
    getNotificationsAnalytics,
    getCoursesAnalytics
}
