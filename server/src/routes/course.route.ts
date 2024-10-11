import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'
import validateMiddleware from '../middlewares/validate.middleware'
import { commentValidationSchema } from '../validations/user.validation'

const courseRouter: Router = Router() as Router

courseRouter.route('/').get(courseController.getAllCoursesWithoutPurchasing)
courseRouter.route('/:id').get(courseController.getSingleCourseWhithoutPurchasing)

//authencicating user
courseRouter.use(isAuthenticated)
courseRouter.put('/reply', courseController.addCommentReply)
courseRouter.put('/comment', validateMiddleware(commentValidationSchema), courseController.addComment)
courseRouter.put('/review/:id', courseController.addReview)
courseRouter.get('/access/:id', courseController.getAccessibleCourse)

//check ADMIN role
courseRouter.use(authorizeRoles(UserRole.ADMIN))
courseRouter.post('/create', courseController.createCourse)
courseRouter.put('/reply-review', courseController.addReviewReply)
courseRouter.put('/update/:id', courseController.updateCourse)

export default courseRouter
