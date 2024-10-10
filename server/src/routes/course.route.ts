import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { courseController } from '../controllers/course.controller'

const courseRouter: Router = Router() as Router

courseRouter
    .route('/')
    .get(courseController.getAllCoursesWithoutPurchasing)
    .post(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.createCourse)
courseRouter
    .route('/:id')
    .get(courseController.getSingleCourseWhithoutPurchasing)
    .put(isAuthenticated, authorizeRoles(UserRole.ADMIN), courseController.updateCourse)

courseRouter.get('/access/:id', isAuthenticated, courseController.getAccessibleCourse)

export default courseRouter
