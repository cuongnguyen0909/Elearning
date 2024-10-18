import express from 'express'
import errorMiddleware from '../middlewares/error.middleware'
import profileRouter from './profile.route'
import authRouter from './auth.route'
import courseRouter from './course.route'
import enrollRouter from './enroll.route'
import notificationRouter from './notification.route'
import userRouter from './user.route'
import commentRouter from './comment.route'
import reviewRouter from './review.route'

const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/profile', profileRouter)
    app.use('/api/v1/course', courseRouter)
    app.use('/api/v1/enrollment', enrollRouter)
    app.use('/api/v1/notification', notificationRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/comment', commentRouter)
    app.use('/api/v1/review', reviewRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes
