import express from 'express'
import { userRegistration, userActivation } from '../controllers/users/user.controller'

const userRouter = express.Router()

userRouter.post('/user-registration', userRegistration)
userRouter.post('/activate-user', userActivation)

export default userRouter