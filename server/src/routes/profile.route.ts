import express, { Router } from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware'
import validateMiddleware from '../middlewares/validate.middleware'
import { changePasswordSchemaValidation } from '../validations/validation'
import { profileController } from '../controllers/profile.controller'

const profileRouter: Router = express.Router() as Router
//isAuthenticated
profileRouter.use(isAuthenticated)
// Get user info
profileRouter
    .route('/')
    //get user info
    .get(profileController.getProfileInfo)
    //update user info
    .put(profileController.updateProfile)

// Change password
profileRouter.put(
    '/change-password',
    validateMiddleware(changePasswordSchemaValidation),
    profileController.changePassword
)
//change avatar
profileRouter.put('/change-avatar', profileController.changeAvatar)

export default profileRouter
