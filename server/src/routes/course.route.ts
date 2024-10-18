import { Router } from 'express'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'

const courseRouter: Router = Router() as Router

courseRouter.route('/').get(courseController.getAllCoursesWithoutPurchasing)
courseRouter.get('/search', courseController.searchCourse)

//authencicating user
// courseRouter.put('/reply', isAuthenticated, courseController.addCommentReply)
// courseRouter.put('/comment', isAuthenticated, validateMiddleware(commentValidationSchema), courseController.addComment)

//check ADMIN role
courseRouter
    .route('/admin')
    .get(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.getAllCoursesByAdmin)
    .post(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.createCourse)
// courseRouter.put('/reply-review', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.addReviewReply)
courseRouter.put('/update/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.updateCourse)
// courseRouter.put('/review/:id', isAuthenticated, courseController.addReview)
courseRouter.get('/access/:id', isAuthenticated, courseController.getAccessibleCourse)
courseRouter.route('/:id').get(courseController.getSingleCourseWhithoutPurchasing)

export default courseRouter
