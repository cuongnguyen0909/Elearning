import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { redis } from '../configs/connect.redis.config'
import { CategoryModel } from '../models/category.mode'

const getAllCategories = async () => {
    try {
        const allCategories = await CategoryModel.find()
        return allCategories
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const categoryHelper = {
    getAllCategories
}
