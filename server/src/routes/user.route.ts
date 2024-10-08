import express from 'express'
import { getUserInfo, socialAuthLogin, updateAccessToken, userActivation, userLogin, userLogout, userRegistration } from '../controllers/user.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import { loginSchemaValidation, registerSchemaValidation, activationSchemaValidation } from '../validations/user.validation'

const userRouter = express.Router()

userRouter.post('/register', validateMiddleware(registerSchemaValidation), userRegistration)
userRouter.post('/activate-user', validateMiddleware(activationSchemaValidation), userActivation)
userRouter.post('/login', validateMiddleware(loginSchemaValidation), userLogin)
userRouter.get('/logout', isAuthenticated, userLogout)
userRouter.get('/refresh-token', updateAccessToken)
userRouter.get('/me', isAuthenticated, getUserInfo)
userRouter.post('/social-auth', socialAuthLogin)

export default userRouter