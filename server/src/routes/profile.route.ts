import express, { Router } from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import { changePasswordSchemaValidation } from '../validations/user.validation'
import { profileController } from '../controllers/profile.controller'

const profileRouter: Router = express.Router() as Router
// Get user info
profileRouter
    .route('/')
    //get user info
    .get(isAuthenticated, profileController.getProfileInfo)
    //update user info
    .put(isAuthenticated, profileController.updateProfile)

// Change password
profileRouter.put(
    '/change-password',
    isAuthenticated,
    validateMiddleware(changePasswordSchemaValidation),
    profileController.changePassword
)
//change avatar
profileRouter.put('/change-avatar', isAuthenticated, profileController.changeAvatar)

export default profileRouter
