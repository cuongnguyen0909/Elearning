import { model, Model } from 'mongoose'
import { IReview, reviewSchema } from './schemas/review.schema'

export const ReviewModel: Model<IReview> = model<IReview>('Review', reviewSchema)
