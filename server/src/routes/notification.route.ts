import express, { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { notificationController } from '../controllers/notification.controller'

const notificationRouter = Router()

notificationRouter.use(isAuthenticated)
notificationRouter.use(authorizeRoles(UserRole.ADMIN))
notificationRouter.route('/').get(notificationController.getNotifications)
notificationRouter.route('/:id').put(notificationController.updateNotificationStatus)

export default notificationRouter
