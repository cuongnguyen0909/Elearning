import { Router } from 'express'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'

const courseRouter: Router = Router() as Router

courseRouter.route('/').get(courseController.getAllCoursesWithoutPurchasing)
courseRouter.get('/search', courseController.searchCourse)
courseRouter.route('/get-vdocipher-otp').post(courseController.generateVideoUrl)

//authencicating user
// courseRouter.put('/reply', isAuthenticated, courseController.addCommentReply)
// courseRouter.put('/comment', isAuthenticated, validateMiddleware(commentValidationSchema), courseController.addComment)

courseRouter.get('/admin', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.getAllCoursesByAdmin)
courseRouter.post('/admin', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.createCourse)
courseRouter.route('/:id').get(courseController.getSingleCourseWhithoutPurchasing)
// courseRouter.put('/reply-review', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.addReviewReply)
courseRouter.put('/update/:id', isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.updateCourse)
// courseRouter.put('/review/:id', isAuthenticated, courseController.addReview)
courseRouter.get('/access/:id', isAuthenticated, courseController.getAccessibleCourse)

courseRouter.route('/delete/:id').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.deleteCourse)
export default courseRouter
