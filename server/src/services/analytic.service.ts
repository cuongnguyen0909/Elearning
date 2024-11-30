import { UserModel } from './../models/user.model'
import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { Model } from 'mongoose'
import { generateLast12MonthsData } from '../utils/analytics/analytics.generator'
import { redis } from '../configs/connect.redis.config'

const getUsersAnalytics = async (model: Model<any>) => {
    try {
        const isCachedExist = await redis.get('analyticsAllUsers')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const analyticsAllUsers: any = await generateLast12MonthsData(model)
        await redis.set('analyticsAllUsers', JSON.stringify(analyticsAllUsers))
        return analyticsAllUsers
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getEnrollmentsAnalytics = async (model: Model<any>) => {
    try {
        const isCachedExist = await redis.get('analyticsAllEnrollments')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const analyticsAllEnrollments: any = await generateLast12MonthsData(model)
        await redis.set('analyticsAllEnrollments', JSON.stringify(analyticsAllEnrollments))
        return analyticsAllEnrollments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getNotificationsAnalytics = async (model: Model<any>) => {
    try {
        const isCachedExist = await redis.get('analyticsAllNotifications')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const analyticsAllNotifications: any = await generateLast12MonthsData(model)
        await redis.set('analyticsAllNotifications', JSON.stringify(analyticsAllNotifications))
        return analyticsAllNotifications
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getCoursesAnalytics = async (model: Model<any>) => {
    try {
        const isCachedExist = await redis.get('analyticsAllCourses')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const analyticsAllCourses: any = await generateLast12MonthsData(model)
        await redis.set('analyticsAllCourses', JSON.stringify(analyticsAllCourses))
        return analyticsAllCourses
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
