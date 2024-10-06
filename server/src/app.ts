import { FileList } from './../node_modules/filelist/index.d';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import errorMiddleware from './middlewares/error-middleware'
import userRouter from './routes/user.route'
import path from 'path';

//initilize express
const app: express.Application = express()
//using dotenv
dotenv.config()
//body parder
app.use(express.json({ limit: '50mb' }))
//cookieParser
app.use(cookieParser())
//using cors
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
///use urlencoded
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/api/v1', userRouter)
//testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    })
})
//unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any
    error.statusCode = 404
    next(error)
})
//error middleware
app.use(errorMiddleware)

export default app
