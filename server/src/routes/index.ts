import express from 'express'
import errorMiddleware from '../middlewares/error.middleware'
import analyticRouter from './analytic.route'
import authRouter from './auth.route'
import commentRouter from './comment.route'
import courseRouter from './course.route'
import enrollRouter from './enroll.route'
import layoutRouter from './layout.route'
import notificationRouter from './notification.route'
import profileRouter from './profile.route'
import reviewRouter from './review.route'
import userRouter from './user.route'
import categoryRouter from './category.route'

const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/profile', profileRouter)
    app.use('/api/v1/course', courseRouter)
    app.use('/api/v1/enrollment', enrollRouter)
    app.use('/api/v1/notification', notificationRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/comment', commentRouter)
    app.use('/api/v1/review', reviewRouter)
    app.use('/api/v1/analytic', analyticRouter)
    app.use('/api/v1/layout', layoutRouter)
    app.use('/api/v1/category', categoryRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes
