import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { CategoryModel } from '../models/category.mode'
import { categoryHelper } from '../helpers/category.help'
import { redis } from '../configs/connect.redis.config'

const createCategory = async (title: string) => {
    try {
        // Check if category already exists
        if (!title) {
            throw new ErrorHandler('Tên thể loại không được bỏ trống', StatusCodes.BAD_REQUEST)
        }
        const isCategoryExist = await CategoryModel.findOne({ title })
        if (isCategoryExist) {
            throw new ErrorHandler('Thể loại này đã tồn lại.', StatusCodes.BAD_REQUEST)
        }

        const newCategory = await CategoryModel.create({ title })
        const allCategories = await categoryHelper.getAllCategories()
        redis.set('allCategories', JSON.stringify(allCategories))
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
            throw new ErrorHandler('Thể loại này không khả dụng.', StatusCodes.BAD_REQUEST)
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { title }, { new: true })
        const allCategories = await categoryHelper.getAllCategories()
        redis.set('allCategories', JSON.stringify(allCategories))
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
            throw new ErrorHandler('Thể loại này không khả dụng.', StatusCodes.BAD_REQUEST)
        }

        await CategoryModel.findByIdAndDelete(id)
        const allCategories = await categoryHelper.getAllCategories()
        redis.set('allCategories', JSON.stringify(allCategories))
        return 'Xóa thể loại thành công'
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

const getAllCategories = async () => {
    try {
        const isCachedExist = await redis.get('allCategories')
        if (isCachedExist) {
            return JSON.parse(isCachedExist)
        }
        const allCategories = await categoryHelper.getAllCategories()
        redis.set('allCategories', JSON.stringify(allCategories))
        return allCategories
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const categoryServices = { createCategory, updateCategory, deleteCategory, getAllCategories }
