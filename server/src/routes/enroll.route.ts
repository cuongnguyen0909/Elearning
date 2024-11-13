import express, { Router } from 'express'
import { enrollController } from '../controllers/enroll.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'

const enrollRouter: Router = express.Router() as Router

enrollRouter.route('/create').post(isAuthenticated, enrollController.createNewEnrollment)
enrollRouter.route('/all').get(isAuthenticated, authorizeRoles(UserRole.ADMIN), enrollController.getAllEnrollments)
enrollRouter.get('/payment/stripepublishablekey', enrollController.sendStripePulishableKey)
enrollRouter.post('/payment', isAuthenticated, enrollController.newPayment)

export default enrollRouter
