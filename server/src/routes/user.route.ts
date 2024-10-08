import express from 'express'
import { changeAvatar, changePassword, getUserInfo, updateProfile } from '../controllers/user.controller'
import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import { changePasswordSchemaValidation } from '../validations/user.validation'

const userRouter = express.Router()
// Get user info
userRouter
    .route('/profile')
    //get user info
    .get(isAuthenticated, getUserInfo)
    //update user info
    .put(isAuthenticated, updateProfile)
userRouter.put('/change-password', isAuthenticated, validateMiddleware(changePasswordSchemaValidation), changePassword)
userRouter.put('/change-avatar', isAuthenticated, changeAvatar)
export default userRouter
