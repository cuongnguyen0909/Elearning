import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const databaseURI: string = (process.env.DB_URI_1 || process.env.DB_URI_2) as string;

const connectMongo: any = async () => {
    try {
        await mongoose.connect(databaseURI)
            .then((data: any) => {
                console.log(`Database connected to ${data?.connection?.host}`);
            })
    }
    catch (err: any) {
        console.log(err?.message)
        setTimeout(connectMongo, 5000)
    }
}

export default connectMongo;