import express from 'express'
import errorMiddleware from '../middlewares/error.middleware'
import profileRouter from './profile.route'
import authRouter from './auth.route'
import courseRouter from './course.route'

const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/me', profileRouter)
    app.use('/api/v1/course', courseRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes
