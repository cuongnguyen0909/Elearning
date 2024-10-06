import app from './app'
import dotenv from 'dotenv'
import connectDB from './utils/database/connect-mongo'

dotenv.config()

const PORT: string = process.env.PORT || '3000'

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
