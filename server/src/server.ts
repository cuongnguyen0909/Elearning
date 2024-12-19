import dotenv from 'dotenv'
import app from './app'
import connectDB from './configs/connect.mongo.config'
import http from 'http'
import { initSocketServer } from './socketServer'

const server = http.createServer(app)

dotenv.config()

const PORT: string = process.env.PORT || '3000'

initSocketServer(server)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
