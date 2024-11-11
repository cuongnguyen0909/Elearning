import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import catchAsyncError from '../utils/handlers/catch-async-error'
import { layoutServices } from '../services/layout.service'
import { ILayout } from '../models/schemas/layout.schema'

const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, image, title, subtitle, faq, categories } = req.body
        if (!type) {
            throw new ErrorHandler('Type is required', StatusCodes.BAD_REQUEST)
        }
        // if (type === 'Banner' && (!image || !title || !subtitle)) {
        //     throw new ErrorHandler('Banner details are required', StatusCodes.BAD_REQUEST)
        // }
        // if (type === 'FAQ' && !faqRequest?.faq) {
        //     throw new ErrorHandler('FAQ details are required', StatusCodes.BAD_REQUEST)
        // }
        if (type === 'Category' && !categories) {
            throw new ErrorHandler('Categories are required', StatusCodes.BAD_REQUEST)
        }

        // Create layout
        await layoutServices.createLayout(type, image, title, subtitle, faq, categories)
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Layout created successfully'
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, image, title, subtitle, faq, categories } = req.body
        if (!type) {
            throw new ErrorHandler('Type is required', StatusCodes.BAD_REQUEST)
        }
        // if (
        //     type === 'Banner' &&
        //     (!bannerRequest || !bannerRequest.image || !bannerRequest.title || !bannerRequest.subTitle)
        // ) {
        //     throw new ErrorHandler('Banner details are required', StatusCodes.BAD_REQUEST)
        // }
        // if (type === 'FAQ' && !faq) {
        //     throw new ErrorHandler('FAQ details are required', StatusCodes.BAD_REQUEST)
        // }
        // if (type === 'Category' && !categories) {
        //     throw new ErrorHandler('Categories are required', StatusCodes.BAD_REQUEST)
        // }

        // Edit layout
        await layoutServices.editLayout(type, image, title, subtitle, faq, categories)
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Layout updated successfully'
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getLayoutByType = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params as { type: string }
        if (!type) {
            throw new ErrorHandler('Type is required', StatusCodes.BAD_REQUEST)
        }
        const layout: ILayout = (await layoutServices.getLayoutByType(type)) as ILayout
        res.status(StatusCodes.OK).json({
            success: true,
            layout
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const layoutController = {
    createLayout,
    editLayout,
    getLayoutByType
}
