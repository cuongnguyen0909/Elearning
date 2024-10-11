import dotenv from 'dotenv'
import app from './app'
import connectDB from './configs/connect.mongo.config'

dotenv.config()

const PORT: string = process.env.PORT || '3000'

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
