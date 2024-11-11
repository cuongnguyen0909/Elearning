import catchAsyncError from '../utils/handlers/catch-async-error'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { StatusCodes } from 'http-status-codes'
import { categoryServices } from '../services/category.service'
const createCategoryByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body
        const newCategory = await categoryServices.createCategory(title)
        res.status(StatusCodes.CREATED).json({
            success: true,
            newCategory
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const updateCategoryByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { title } = req.body
        const updatedCategory = await categoryServices.updateCategory(id, title)
        res.status(StatusCodes.OK).json({
            success: true,
            updatedCategory
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const deleteCategoryByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const message = await categoryServices.deleteCategory(id)
        res.status(StatusCodes.OK).json({
            success: true,
            message
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryServices.getAllCategories()
        res.status(StatusCodes.OK).json({
            success: true,
            categories
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const categoryController = {
    createCategoryByAdmin,
    updateCategoryByAdmin,
    deleteCategoryByAdmin,
    getAllCategories
}
