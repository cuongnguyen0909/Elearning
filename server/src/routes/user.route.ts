import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { userController } from '../controllers/user.controller'

const userRouter = Router()

userRouter.use(isAuthenticated)
userRouter.use(authorizeRoles(UserRole.ADMIN))
userRouter.route('/').get(userController.getAllUser)

export default userRouter
