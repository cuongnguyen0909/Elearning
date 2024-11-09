import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { userController } from '../controllers/user.controller'

const userRouter = Router()

userRouter.route('/all').get(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.getAllUser)
userRouter.route('/update').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.updateUserRole)
userRouter.route('/delete').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.deleteAdminRole)
userRouter.route('/lock').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.lockUser)
userRouter.route('/unlock').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.unLockUser)
userRouter.route('/delete/:id').put(isAuthenticated, authorizeRoles(UserRole.ADMIN), userController.deleteUser)

export default userRouter
