import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { reviewController } from '../controllers/review.controller'
import { UserRole } from '../constants/enums/user.enum'

const reviewRouter = Router()

reviewRouter.put('/reply', isAuthenticated, authorizeRoles(UserRole.ADMIN), reviewController.addReviewReply)
reviewRouter.get('/all', isAuthenticated, authorizeRoles(UserRole.ADMIN), reviewController.getAllReviews)
reviewRouter.delete('/reply', isAuthenticated, authorizeRoles(UserRole.ADMIN), reviewController.deleteReviewReply)
reviewRouter.post('/add/:id', isAuthenticated, reviewController.addReview)
export default reviewRouter
