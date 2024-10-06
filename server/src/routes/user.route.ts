import express from 'express'
import { userRegistration } from '../controllers/users/user.controller'

const userRouter = express.Router()

userRouter.post('/registration', userRegistration)

export default userRouter