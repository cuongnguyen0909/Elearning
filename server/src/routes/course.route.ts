import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'
import validateMiddleware from '../middlewares/validate.middleware'
import { commentValidationSchema } from '../validations/user.validation'

const courseRouter: Router = Router() as Router
courseRouter.post('/create', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.createCourse)
courseRouter.route('/').get(courseController.getAllCoursesWithoutPurchasing)
courseRouter.put('/comment', isAuthenticated, validateMiddleware(commentValidationSchema), courseController.addComment)
courseRouter.put('/reply', isAuthenticated, courseController.addCommentReply)
courseRouter.put('/reply-review', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.addReviewReply)
courseRouter.put('/review/:id', isAuthenticated, courseController.addReview)
courseRouter.put('/update/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.updateCourse)
courseRouter.route('/:id').get(courseController.getSingleCourseWhithoutPurchasing)

courseRouter.get('/access/:id', isAuthenticated, courseController.getAccessibleCourse)

export default courseRouter
