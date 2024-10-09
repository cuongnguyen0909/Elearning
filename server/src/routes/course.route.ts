import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { createCourse, updateCourse } from '../controllers/course.controller'

const courseRouter = Router()

courseRouter
    .route('/')
    .get()
    .post(isAuthenticated, authorizeRoles(UserRole.ADMIN), createCourse)
    courseRouter
        .route('/:id')
        .put(isAuthenticated, authorizeRoles(UserRole.ADMIN), updateCourse)

export default courseRouter
