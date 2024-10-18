import mongoose, { Model } from 'mongoose'
import { commentSchema, IComment } from './schemas/comment.schema'

export const CommentModel: Model<IComment> = mongoose.model('Comment', commentSchema)
