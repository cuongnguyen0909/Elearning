import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

//initilize express
const app = express()
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

export { app }
