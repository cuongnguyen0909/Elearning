import { authorizeRoles } from './../middlewares/auth.middleware'
import { categoryController } from '../controllers/category.controller'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'

const categoryRouter: Router = Router()

categoryRouter.post(
    '/create',
    isAuthenticated,
    authorizeRoles(UserRole.ADMIN),
    categoryController.createCategoryByAdmin
)

categoryRouter.put(
    '/update/:id',
    isAuthenticated,
    authorizeRoles(UserRole.ADMIN),
    categoryController.updateCategoryByAdmin
)

categoryRouter.delete(
    '/delete/:id',
    isAuthenticated,
    authorizeRoles(UserRole.ADMIN),
    categoryController.deleteCategoryByAdmin
)

categoryRouter.get('/all', categoryController.getAllCategories)

export default categoryRouter
