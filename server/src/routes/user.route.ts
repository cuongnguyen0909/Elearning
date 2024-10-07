import express from 'express'
import { getUserInfo, socialAuthLogin, updateAccessToken, userActivation, userLogin, userLogout, userRegistration } from '../controllers/user.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'

const userRouter = express.Router()

userRouter.post('/register', userRegistration)
userRouter.post('/activate-user', userActivation)
userRouter.post('/login', userLogin)
userRouter.get('/logout', isAuthenticated, userLogout)
userRouter.get('/refresh-token', updateAccessToken)
userRouter.get('/me', isAuthenticated, getUserInfo)
userRouter.post('/social-auth', socialAuthLogin)

export default userRouter