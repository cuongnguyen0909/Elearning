import { NextFunction, Request, Response } from 'express'
import { ICommentRequest, IReplyCommentRequest } from '../interfaces/comment.interface,'
import catchAsyncError from '../utils/handlers/catch-async-error'
import { commentServices } from '../services/comment.service'
import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IComment } from '../models/schemas/comment.schema'

const addComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const commentData: ICommentRequest = req.body as ICommentRequest
    const userId: any = req?.user?._id as any
    try {
        const comment = (await commentServices.addComment(commentData, userId)) as any
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Comment is added successfully',
            comment
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const addCommentReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const replyCommentRequest: IReplyCommentRequest = req.body as IReplyCommentRequest
    const userId: any = req?.user?._id as any
    try {
        const comment: IComment = (await commentServices.addCommentReply(replyCommentRequest, userId)) as IComment
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Reply is added successfully',
            comment
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const getAllComments = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = (await commentServices.getAllComments()) as any
        res.status(StatusCodes.OK).json({
            success: true,
            comments
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const commentController = { addComment, addCommentReply, getAllComments }
