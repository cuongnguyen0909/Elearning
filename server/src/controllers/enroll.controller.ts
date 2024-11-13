// import { metadata } from './../../../client/app/layout'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IEnrollRequest } from '../interfaces/enroll.interface'
import { enrollServices } from '../services/enroll.service'
import catchAsyncError from '../utils/handlers/catch-async-error'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IEnroll } from '../models/schemas/enrollment.schema'
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const createNewEnrollment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { course, payment_info } = req.body as any
    const userId: any = req.user?._id as any
    try {
        const { newEnroll, notification, user } = await enrollServices.createNewEnrollment(
            {
                course,
                payment_info
            },
            userId
        )
        res.status(StatusCodes.CREATED).json({
            success: true,
            newEnroll,
            notification,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllEnrollments = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollServices.getAllEnrollments()
        res.status(StatusCodes.OK).json({
            success: true,
            enrollments,
            count: enrollments.length
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const sendStripePulishableKey = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.OK).json({
            publishablekey: `${process.env.STRIPE_PUBLISHABLE_KEY}`
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const newPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req?.body?.amount,
            currency: 'USD',
            metadata: {
                company: 'Edemy'
            },
            automatic_payment_methods: {
                enabled: true
            }
        })

        res.status(StatusCodes.OK).json({
            success: true,
            client_secret: myPayment.client_secret
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const enrollController = {
    createNewEnrollment,
    getAllEnrollments,
    sendStripePulishableKey,
    newPayment
}
