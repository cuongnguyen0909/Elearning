import { socialAuthLogin, updateAccessToken, userLogout } from './../controllers/auth.controller'
import express from 'express'

import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import {
    loginSchemaValidation,
    registerSchemaValidation,
    activationSchemaValidation
} from '../validations/user.validation'
import { userActivation, userLogin, userRegistration } from '../controllers/auth.controller'

const authRouter = express.Router()

// Register user
authRouter.post('/register', validateMiddleware(registerSchemaValidation), userRegistration)
authRouter.post('/activate', validateMiddleware(activationSchemaValidation), userActivation)
// Login user
authRouter.post('/login', validateMiddleware(loginSchemaValidation), userLogin)
// Social auth
authRouter.post('/social', socialAuthLogin)
// Logout user
authRouter.get('/logout', isAuthenticated, userLogout)
// Refresh token
authRouter.get('/refresh-token', updateAccessToken)

export default authRouter
