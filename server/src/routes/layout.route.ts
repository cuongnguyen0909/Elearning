import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'
import { layoutController } from '../controllers/layout.controller'

const layoutRouter = Router()

layoutRouter.post('/create', isAuthenticated, authorizeRoles(UserRole.ADMIN), layoutController.createLayout)
layoutRouter.put('/update', isAuthenticated, authorizeRoles(UserRole.ADMIN), layoutController.editLayout)
layoutRouter.get(
    '/',
    // isAuthenticated,
    // authorizeRoles(UserRole.ADMIN),
    layoutController.getLayoutByType
)

export default layoutRouter
