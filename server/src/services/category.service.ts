import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { CategoryModel } from '../models/category.mode'

const createCategory = async (title: string) => {
    try {
        // Check if category already exists
        if (!title) {
            throw new ErrorHandler('Category title is required', StatusCodes.BAD_REQUEST)
        }
        const isCategoryExist = await CategoryModel.findOne({ title })
        if (isCategoryExist) {
            throw new ErrorHandler('Category is already exist', StatusCodes.BAD_REQUEST)
        }

        const newCategory = await CategoryModel.create({ title })
        return newCategory
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const updateCategory = async (id: string, title: string) => {
    try {
        // Check if category already exists
        const isCategoryExist = await CategoryModel.findById(id)
        if (!isCategoryExist) {
            throw new ErrorHandler('Category does not exist', StatusCodes.BAD_REQUEST)
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { title }, { new: true })
        return updatedCategory
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const deleteCategory = async (id: string) => {
    try {
        // Check if category already exists
        const isCategoryExist = await CategoryModel.findById(id)
        if (!isCategoryExist) {
            throw new ErrorHandler('Category does not exist', StatusCodes.BAD_REQUEST)
        }

        await CategoryModel.findByIdAndDelete(id)
        return 'Category deleted successfully'
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCategories = async () => {
    try {
        const categories = await CategoryModel.find()
        return categories
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const categoryServices = { createCategory, updateCategory, deleteCategory, getAllCategories }
