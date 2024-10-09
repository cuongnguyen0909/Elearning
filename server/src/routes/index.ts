import express from 'express'
import errorMiddleware from '../middlewares/error.middleware'
import userRouter from './user.route'
import authRouter from './auth.route'
import courseRouter from './course.route'
const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/courses', courseRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes
