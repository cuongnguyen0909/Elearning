import express from 'express'
import { userActivation, userLogin, userLogout, userRegistration } from '../controllers/users/user.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'

const userRouter = express.Router()

userRouter.post('/register', userRegistration)
userRouter.post('/activate-user', userActivation)
userRouter.post('/login', userLogin)
userRouter.get('/logout', isAuthenticated, userLogout)

export default userRouter