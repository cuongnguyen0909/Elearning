import { Router } from 'express'
import { commentController } from '../controllers/comment.controller'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware'
import { UserRole } from '../constants/enums/user.enum'

const commentRouter = Router()

commentRouter.post('/add', isAuthenticated, commentController.addComment)
commentRouter.put('/reply', isAuthenticated, commentController.addCommentReply)
commentRouter.get('/all', isAuthenticated, authorizeRoles(UserRole.ADMIN), commentController.getAllComments)
commentRouter.delete('/delete', isAuthenticated, commentController.deleteComment)
commentRouter.delete('/delete-reply', isAuthenticated, commentController.deleteCommentReply)

export default commentRouter
