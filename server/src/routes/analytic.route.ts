import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { analyticController } from '../controllers/analytic.controller'

const analyticRouter = Router()

analyticRouter.get('/users', isAuthenticated, authorizeRoles(UserRole.ADMIN), analyticController.getUsersAnalytics)
analyticRouter.get(
    '/notifications',
    isAuthenticated,
    authorizeRoles(UserRole.ADMIN),
    analyticController.getNotificationsAnalytics
)
analyticRouter.get(
    '/enrollments',
    isAuthenticated,
    authorizeRoles(UserRole.ADMIN),
    analyticController.getEnrollmentsAnalytics
)

analyticRouter.get('/courses', isAuthenticated, authorizeRoles(UserRole.ADMIN), analyticController.getCoursesAnalytics)

export default analyticRouter
