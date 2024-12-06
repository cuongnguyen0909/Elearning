import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { CommentModel } from '../models/comment.model'
import { IComment } from '../models/schemas/comment.schema'

const getAllComments = async () => {
    try {
        const allComments: IComment[] = (await CommentModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'name email avatar'
            })
            .populate({
                path: 'commentReplies.user',
                select: 'name email avatar'
            })) as IComment[]
        return allComments
    } catch (error: any) {
        throw new ErrorHandler(error.message, StatusCodes.BAD_REQUEST)
    }
}

export const commentHelper = {
    getAllComments
}
