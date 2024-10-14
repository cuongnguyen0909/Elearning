import express, { Router } from 'express'
import { enrollController } from '../controllers/enroll.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'

const enrollRouter: Router = express.Router() as Router

enrollRouter.use(isAuthenticated)
enrollRouter.route('/').post(enrollController.createNewEnrollment)

export default enrollRouter
