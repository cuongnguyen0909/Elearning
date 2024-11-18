import { NextFunction, Request, Response } from 'express'
import { ICommentRequest, IReplyCommentRequest } from '../interfaces/comment.interface,'
import catchAsyncError from '../utils/handlers/catch-async-error'
import { commentServices } from '../services/comment.service'
import { StatusCodes } from 'http-status-codes'
import ErrorHandler from '../utils/handlers/ErrorHandler'
import { IComment } from '../models/schemas/comment.schema'
import { UserRole } from '../constants/enums/user.enum'

const addComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId: any = req?.user?._id as any
    const role = req?.user?.role as any
    const commentData: ICommentRequest = req.body as ICommentRequest
    try {
        if (role === UserRole.ADMIN) {
            throw new ErrorHandler('Admin cannot add comment', StatusCodes.BAD_REQUEST)
        }
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

const deleteComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, courseId, contentId }: any = req.body
    try {
        if (!commentId || !courseId || !contentId) {
            throw new ErrorHandler('Invalid request', StatusCodes.BAD_REQUEST)
        }
        ;(await commentServices.deleteComment(commentId, courseId, contentId)) as any
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Comment is deleted successfully'
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

const deleteCommentReply = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId, replyId }: any = req.body
        if (!commentId || !replyId) {
            throw new ErrorHandler('Invalid request', StatusCodes.BAD_REQUEST)
        }
        const course = (await commentServices.deleteCommentReply(commentId, replyId)) as any
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Reply is deleted successfully',
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST))
    }
})

export const commentController = { addComment, addCommentReply, getAllComments, deleteComment, deleteCommentReply }
