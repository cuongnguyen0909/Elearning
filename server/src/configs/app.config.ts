import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const configAppExpress = (app: express.Application) => {
    //using dotenv
    dotenv.config()
    //body parder
    app.use(express.json({ limit: '50mb' }))
    //cookieParser
    app.use(cookieParser())
    //using cors
    app.use(
        cors({
            origin: ['http://localhost:3000'],
            credentials: true
        })
    )
    ///use urlencoded
    app.use(express.urlencoded({ extended: true }))
}

export default configAppExpress
