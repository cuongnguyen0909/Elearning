import express, { Router } from 'express'
import { enrollController } from '../controllers/enroll.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'

const enrollRouter: Router = express.Router() as Router

enrollRouter.route('/').post(isAuthenticated, enrollController.createNewEnrollment)
enrollRouter.route('/').get(isAuthenticated, authorizeRoles(UserRole.ADMIN), enrollController.getAllEnrollments)

export default enrollRouter
