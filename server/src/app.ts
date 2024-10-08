import express from 'express'
import configAppExpress from './config/app.config'
import initializeRoutes from './routes'

//initilize express
const app: express.Application = express()

//config express app
configAppExpress(app)

//initialize routes
initializeRoutes(app)

export default app
