import express from 'express';
import errorMiddleware from '../middlewares/error-middleware';
import userRouter from './user.route';
const initializeRoutes = (app: express.Application) => {
    app.use('/api/v1', userRouter)

    app.use(errorMiddleware)
}

export default initializeRoutes