import express from 'express'
import errorMiddleware from '../middlewares/error.middleware'
import userRouter from './user.route'
import authRouter from './auth.route'
const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/users', userRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes
