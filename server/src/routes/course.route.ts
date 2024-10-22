import { Router } from 'express'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'

const courseRouter: Router = Router() as Router

courseRouter.route('/').get(courseController.getAllCoursesWithoutPurchasing)
courseRouter.get('/search', courseController.searchCourse)
courseRouter.route('/get-vdocipher-otp').get(courseController.generateVideoUrl)
// <div style="padding-top:41%;position:relative;">
// <iframe src="https://player.vdocipher.com/v2/?otp={otp}&playbackInfo={playbackInfo}&player={playerId}" style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%;" allowFullScreen="true" allow="encrypted-media"></iframe>
// </div>

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

courseRouter.route('/delete/:id').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.deleteCourse)
export default courseRouter
