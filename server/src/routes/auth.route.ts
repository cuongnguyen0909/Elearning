import { authController } from './../controllers/auth.controller'
import express, { Router } from 'express'

import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import { loginSchemaValidation, registerSchemaValidation, activationSchemaValidation } from '../validations/validation'

const authRouter: Router = express.Router() as Router

// Register user
authRouter.post('/register', validateMiddleware(registerSchemaValidation), authController.userRegistration)
authRouter.post('/activate', validateMiddleware(activationSchemaValidation), authController.userActivation)
// Login user
authRouter.post('/login', validateMiddleware(loginSchemaValidation), authController.userLogin)
// Social auth
authRouter.post('/social', authController.socialAuthLogin)
// Logout user
authRouter.get('/logout', isAuthenticated, authController.userLogout)
// Refresh token
// authRouter.get('/refresh-token', authController.updateAccessToken)

export default authRouter
