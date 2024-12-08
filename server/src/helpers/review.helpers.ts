import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { ReviewModel } from '../models/review.model'
import { IReview } from '../models/schemas/review.schema'

const getAllReviews = async () => {
    try {
        const allReviews: IReview[] = (await ReviewModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'name email avatar role'
            })
            .populate({
                path: 'reviewReplies.user',
                select: 'name email avatar role'
            })) as IReview[]
        return allReviews
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const reviewHelper = {
    getAllReviews
}
